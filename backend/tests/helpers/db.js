const {
	sequelize,
	User,
	PaymentChannel,
	FinancialDonation,
	BookDonation,
	Address,
	Merchant,
	Province,
	City,
	Log,
} = require('../../models');
const { ROLES, PAYMENT_STATUS } = require('../../libs/constant');

const resetAndSeed = async () => {
	await sequelize.sync({ force: true });

	const [donaturA, donaturB, admin, superadmin] = await Promise.all(
		[
			{ name: 'Donatur A', email: 'donatur.a@test.local', role: ROLES.DONATUR },
			{ name: 'Donatur B', email: 'donatur.b@test.local', role: ROLES.DONATUR },
			{ name: 'Admin', email: 'admin@test.local', role: ROLES.ADMIN },
			{
				name: 'Superadmin',
				email: 'superadmin@test.local',
				role: ROLES.SUPERADMIN,
			},
		].map((u) =>
			User.create({ ...u, password: 'rahasia-test', is_verified: true })
		)
	);

	const activeChannel = await PaymentChannel.create({
		type: 'bank',
		name: 'Bank Test Aktif',
		account_number: '1234567890',
		account_holder: 'Yayasan Test',
		is_active: true,
	});

	await Province.create({ id: '1', name: 'Jawa Timur' });
	await City.create({ id: '1', province_id: '1', name: 'Surabaya' });

	const inactiveChannel = await PaymentChannel.create({
		type: 'bank',
		name: 'Bank Test Nonaktif',
		account_number: '0987654321',
		account_holder: 'Yayasan Test',
		is_active: false,
	});

	return { donaturA, donaturB, admin, superadmin, activeChannel, inactiveChannel };
};

const seedFinancialDonation = (user, status, overrides = {}) =>
	FinancialDonation.create({
		amount: 50000,
		notes: 'donasi test',
		user_id: user.id,
		status,
		...overrides,
	});

const seedAddress = (user, overrides = {}) =>
	Address.create({
		user_id: user.id,
		area_id: 'AREA-SEED-' + user.id,
		name: 'Rumah ' + user.name,
		contact_name: user.name,
		contact_phone: '0812345678',
		street_address: 'Jl. Test No. 1',
		latitude: -7.25,
		longitude: 112.75,
		province_id: '1',
		city_id: '1',
		zipcode: '60111',
		is_default: true,
		...overrides,
	});

const seedMerchant = () =>
	Merchant.create({
		name: 'Taman Mraen Mimpi',
		phone: '081111111111',
		email: 'merchant@test.local',
		address: 'Jl. Merchant No. 1',
		zipcode: '60222',
		area_id: 'AREA-MERCHANT',
		latitude: -7.3,
		longitude: 112.8,
	});

const seedBookDonation = (user, address, status, overrides = {}) =>
	BookDonation.create({
		user_id: user.id,
		address_id: address.id,
		method: 'drop_off',
		estimated_value: 100000,
		length: 20,
		width: 15,
		height: 10,
		weight: 1000,
		order_id: 'DRAFT-SEED',
		shipping_fee: 15000,
		courier_code: 'jne',
		courier_service_code: 'reg',
		shipping_eta: '2-3 hari',
		status,
		...overrides,
	});

const countLogs = () => Log.count();

module.exports = {
	resetAndSeed,
	seedFinancialDonation,
	seedAddress,
	seedMerchant,
	seedBookDonation,
	countLogs,
	PAYMENT_STATUS,
};
