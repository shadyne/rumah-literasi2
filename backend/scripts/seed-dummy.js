'use strict';

/**
 * Skrip data dummy untuk menguji perbaikan Kelompok A secara lokal:
 *   #1 pagination donasi finansial  -> dibuat >5 baris
 *   #2 admin edit alamat user       -> dibuat 1 alamat milik Donatur
 *   #3 user hapus donasi PENDING    -> dibuat book donation status Pending (order_id null)
 *
 * Jalankan dari folder backend:  node scripts/seed-dummy.js
 * Aman dijalankan berulang: user & alamat pakai findOrCreate.
 */

const argon2 = require('argon2');
const { ROLES, PAYMENT_STATUS } = require('../libs/constant');
const db = require('../models');

const {
	sequelize,
	User,
	FinancialDonation,
	Address,
	BookDonation,
} = db;

const Province = db.Province;
const City = db.City;
const District = db.District;

async function firstId(model, fallback) {
	try {
		if (!model) return fallback;
		const row = await model.findOne();
		return row ? String(row.id) : fallback;
	} catch {
		return fallback;
	}
}

async function run() {
	await sequelize.authenticate();
	console.log('DB terhubung:', sequelize.getDialect());

	// 1. Donatur uji coba
	const hashed = await argon2.hash('password');
	const [donatur] = await User.findOrCreate({
		where: { email: 'donatur@example.com' },
		defaults: {
			name: 'Donatur Uji',
			password: hashed,
			role: ROLES.DONATUR,
			is_verified: true,
		},
	});
	console.log(`Donatur: ${donatur.email} (id=${donatur.id}) / password: "password"`);

	// 2. Alamat milik Donatur (untuk tes admin edit lokasi)
	const provinceId = await firstId(Province, '31');
	const cityId = await firstId(City, '3171');
	const districtId = await firstId(District, '317107');

	const [address] = await Address.findOrCreate({
		where: { user_id: donatur.id, name: 'Rumah (Dummy)' },
		defaults: {
			contact_name: 'Donatur Uji',
			contact_phone: '081234567890',
			street_address: 'Jalan Pedurenan Masjid I, Karet Kuningan',
			latitude: -6.2185,
			longitude: 106.8283,
			province_id: provinceId,
			city_id: cityId,
			district_id: districtId,
			zipcode: '12920',
			location_source: 'manual_drag',
			is_location_confirmed: true,
			is_default: true,
		},
	});
	console.log(`Alamat: id=${address.id} (province_id=${provinceId}, city_id=${cityId}, district_id=${districtId})`);

	// 3. Donasi finansial >5 baris (untuk tes pagination)
	const statuses = [
		PAYMENT_STATUS.PENDING,
		PAYMENT_STATUS.WAITING_VERIFICATION,
		PAYMENT_STATUS.SUCCESS,
		PAYMENT_STATUS.FAILED,
	];
	const financialRows = Array.from({ length: 12 }, (_, i) => ({
		amount: (i + 1) * 25000,
		status: statuses[i % statuses.length],
		notes: `Donasi dummy #${i + 1}`,
		user_id: donatur.id,
	}));
	await FinancialDonation.bulkCreate(financialRows, { validate: true });
	console.log(`Donasi finansial dibuat: ${financialRows.length} baris`);

	// 4. Book donation PENDING (untuk tes hapus oleh user) + items
	const pending = await BookDonation.create(
		{
			user_id: donatur.id,
			address_id: address.id,
			method: 'pickup',
			status: PAYMENT_STATUS.PENDING,
			estimated_value: 150000,
			length: 20,
			width: 15,
			height: 10,
			weight: 1000,
			order_id: null, // null -> destroy tidak memanggil Biteship (aman untuk lokal)
			courier_code: 'jne',
			courier_service_code: 'reg',
			book_donation_items: [
				{
					title: 'Buku Dummy A',
					author: 'Penulis A',
					publisher: 'Penerbit A',
					year: 2020,
					amount: 2,
				},
				{
					title: 'Buku Dummy B',
					author: 'Penulis B',
					publisher: 'Penerbit B',
					year: 2021,
					amount: 1,
				},
			],
		},
		{ include: ['book_donation_items'] }
	);
	console.log(`Book donation PENDING dibuat: id=${pending.id} (bisa dihapus user)`);

	console.log('\nSelesai. Login sebagai donatur@example.com / "password" untuk tes.');
}

run()
	.then(async () => {
		await sequelize.close();
		process.exit(0);
	})
	.catch(async (err) => {
		console.error('Gagal seed dummy:', err);
		try {
			await sequelize.close();
		} catch {}
		process.exit(1);
	});
