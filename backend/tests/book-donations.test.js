const request = require('supertest');

const { buildApp } = require('./helpers/app');
const { installBiteshipMock } = require('./helpers/biteship-mock');
const {
	resetAndSeed,
	seedAddress,
	seedMerchant,
	seedBookDonation,
	countLogs,
	PAYMENT_STATUS,
} = require('./helpers/db');
const { BookDonation } = require('../models');

const app = buildApp();
const PROOF = Buffer.from('bukti-pembayaran-dummy');

let actors;
let addressA;
let biteship;

const as = (user) => (req) => req.set('x-actor-uuid', user.uuid);

const storePayload = (address) => ({
	transaction: {
		items: [
			{
				title: 'Laskar Pelangi',
				author: 'Andrea Hirata',
				publisher: 'Bentang',
				year: 2005,
				amount: 2,
			},
		],
		detail: {
			address_id: String(address.id),
			package_size: 'small',
			estimated_value: 100000,
			length: 20,
			width: 15,
			height: 10,
			weight: 1000,
		},
		courier: {
			company: 'JNE',
			courier_code: 'jne',
			courier_service_code: 'reg',
			shipping_fee: 15000,
			duration: '2-3 hari',
			type: 'reg',
			service_type: 'standard',
		},
		method: 'drop_off',
		schedule: {
			type: 'drop_off',
			point_id: 'POINT-1',
			point_name: 'Drop Point Test',
			point_address: 'Jl. Drop No. 1',
		},
	},
});

beforeEach(async () => {
	actors = await resetAndSeed();
	await seedMerchant();
	addressA = await seedAddress(actors.donaturA);
	biteship = installBiteshipMock();
});

describe('BD-INDEX GET /api/book-donations', () => {
	it('BD-01 Donatur: hanya miliknya, termasuk Pending', async () => {
		await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.PENDING);
		await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.SUCCESS);
		const addressB = await seedAddress(actors.donaturB);
		await seedBookDonation(actors.donaturB, addressB, PAYMENT_STATUS.SUCCESS);

		const res = await request(app)
			.get('/api/book-donations')
			.use(as(actors.donaturA));

		expect(res.status).toBe(200);
		expect(res.body.data.rows).toHaveLength(2);
		for (const row of res.body.data.rows) {
			expect(row.user_id).toBe(actors.donaturA.id);
		}
	});

	it('BD-02 Admin: donasi Pending tidak muncul (point 4)', async () => {
		await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.PENDING);
		await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.FAILED);

		const res = await request(app)
			.get('/api/book-donations')
			.use(as(actors.admin));

		expect(res.status).toBe(200);
		expect(res.body.data.rows).toHaveLength(1);
		expect(res.body.data.rows[0].status).toBe(PAYMENT_STATUS.FAILED);
	});

	it('BD-03 Admin: filter ?status=Pending -> rows kosong', async () => {
		await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.PENDING);

		const res = await request(app)
			.get('/api/book-donations')
			.query({ status: PAYMENT_STATUS.PENDING })
			.use(as(actors.admin));

		expect(res.status).toBe(200);
		expect(res.body.data.rows).toHaveLength(0);
	});

	it('BD-04 Superadmin: Pending tersembunyi', async () => {
		await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.PENDING);
		await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.SUCCESS);

		const res = await request(app)
			.get('/api/book-donations')
			.use(as(actors.superadmin));

		expect(res.status).toBe(200);
		expect(res.body.data.rows).toHaveLength(1);
		expect(res.body.data.rows[0].status).toBe(PAYMENT_STATUS.SUCCESS);
	});
});

describe('BD-SHOW GET /api/book-donations/:id', () => {
	it('BD-06 pemilik: 200; BD-07 donatur lain: 404; BD-08 Admin non-Pending: 200', async () => {
		const d = await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.SUCCESS);

		const owner = await request(app)
			.get('/api/book-donations/' + d.id)
			.use(as(actors.donaturA));
		expect(owner.status).toBe(200);

		const other = await request(app)
			.get('/api/book-donations/' + d.id)
			.use(as(actors.donaturB));
		expect(other.status).toBe(404);

		const admin = await request(app)
			.get('/api/book-donations/' + d.id)
			.use(as(actors.admin));
		expect(admin.status).toBe(200);
	});

	it('BD-09 Admin/SA membuka detail donasi buku Pending via URL: 404 (point 4)', async () => {
		const d = await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.PENDING);

		for (const actor of [actors.admin, actors.superadmin]) {
			const res = await request(app)
				.get('/api/book-donations/' + d.id)
				.use(as(actor));
			expect(res.status).toBe(404);
		}

		const owner = await request(app)
			.get('/api/book-donations/' + d.id)
			.use(as(actors.donaturA));
		expect(owner.status).toBe(200);
	});
});

describe('BD-STORE POST /api/book-donations', () => {
	it('BD-10 Donatur: 200, Pending, draft Biteship dibuat, tanpa log', async () => {
		const res = await request(app)
			.post('/api/book-donations')
			.send(storePayload(addressA))
			.use(as(actors.donaturA));

		expect(res.status).toBe(200);
		expect(res.body.data.status).toBe(PAYMENT_STATUS.PENDING);
		expect(res.body.data.order_id).toBe('DRAFT-NEW');
		expect(res.body.data.shipping_fee).toBe(15000);
		expect(biteship.post).toHaveBeenCalledWith(
			'draft_orders',
			expect.any(Object)
		);
		expect(await countLogs()).toBe(0);
	});

	it('BD-11 Donatur: alamat bukan miliknya -> 404, tanpa draft Biteship', async () => {
		const res = await request(app)
			.post('/api/book-donations')
			.send(storePayload(addressA))
			.use(as(actors.donaturB));

		expect(res.status).toBe(404);
		expect(biteship.post).not.toHaveBeenCalled();
	});

	it('BD-11b Admin: 403 (middleware)', async () => {
		const res = await request(app)
			.post('/api/book-donations')
			.send(storePayload(addressA))
			.use(as(actors.admin));
		expect(res.status).toBe(403);
	});

	it('BD-12 Superadmin membuat donasi buku: 403', async () => {
		const res = await request(app)
			.post('/api/book-donations')
			.send(storePayload(addressA))
			.use(as(actors.superadmin));
		expect(res.status).toBe(403);
	});
});

describe('BD-PAY POST /api/book-donations/:id/pay', () => {
	it('BD-13 pemilik + Pending: 200 -> WaitingVerification', async () => {
		const d = await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.PENDING);

		const res = await request(app)
			.post(`/api/book-donations/${d.id}/pay`)
			.field('payment_channel_id', String(actors.activeChannel.id))
			.attach('payment_proof', PROOF, 'bukti.png')
			.use(as(actors.donaturA));

		expect(res.status).toBe(200);
		expect(res.body.data.status).toBe(PAYMENT_STATUS.WAITING_VERIFICATION);
	});

	it('BD-14 pemilik + non-Pending: 400', async () => {
		const d = await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.SUCCESS);

		const res = await request(app)
			.post(`/api/book-donations/${d.id}/pay`)
			.field('payment_channel_id', String(actors.activeChannel.id))
			.attach('payment_proof', PROOF, 'bukti.png')
			.use(as(actors.donaturA));

		expect(res.status).toBe(400);
	});

	it('BD-17 donatur lain: 404; BD-18 Admin: 403', async () => {
		const d = await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.PENDING);

		const other = await request(app)
			.post(`/api/book-donations/${d.id}/pay`)
			.field('payment_channel_id', String(actors.activeChannel.id))
			.attach('payment_proof', PROOF, 'bukti.png')
			.use(as(actors.donaturB));
		expect(other.status).toBe(404);

		const admin = await request(app)
			.post(`/api/book-donations/${d.id}/pay`)
			.field('payment_channel_id', String(actors.activeChannel.id))
			.attach('payment_proof', PROOF, 'bukti.png')
			.use(as(actors.admin));
		expect(admin.status).toBe(403);
	});

	it(
		'BD-19 Superadmin membayar donasi buku orang lain: 404',
		async () => {
			const d = await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.PENDING);

			const res = await request(app)
				.post(`/api/book-donations/${d.id}/pay`)
				.field('payment_channel_id', String(actors.activeChannel.id))
				.attach('payment_proof', PROOF, 'bukti.png')
				.use(as(actors.superadmin));

			expect(res.status).toBe(404);
		}
	);
});

describe('BD-UPDATE PUT /api/book-donations/:id', () => {
	it('BD-20 pemilik + Pending: field whitelist berubah', async () => {
		const d = await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.PENDING, {
			method: 'pickup',
			pickup_note: 'lama',
		});

		const res = await request(app)
			.put('/api/book-donations/' + d.id)
			.send({ estimated_value: 250000, pickup_note: 'baru' })
			.use(as(actors.donaturA));

		expect(res.status).toBe(200);
		const fresh = await BookDonation.findByPk(d.id);
		expect(fresh.estimated_value).toBe(250000);
		expect(fresh.pickup_note).toBe('baru');
	});

	it('BD-21 pemilik menyelipkan status/shipping_fee/order_id: diabaikan (whitelist)', async () => {
		const d = await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.PENDING);

		const res = await request(app)
			.put('/api/book-donations/' + d.id)
			.send({
				estimated_value: 250000,
				status: PAYMENT_STATUS.SUCCESS,
				shipping_fee: 1,
				order_id: 'HACKED',
			})
			.use(as(actors.donaturA));

		expect(res.status).toBe(200);
		const fresh = await BookDonation.findByPk(d.id);
		expect(fresh.status).toBe(PAYMENT_STATUS.PENDING);
		expect(fresh.shipping_fee).toBe(15000);
		expect(fresh.order_id).toBe('DRAFT-SEED');
	});

	it('BD-22 pemilik + non-Pending: 400 (sudah dibayar = terkunci)', async () => {
		for (const status of [
			PAYMENT_STATUS.WAITING_VERIFICATION,
			PAYMENT_STATUS.SUCCESS,
			PAYMENT_STATUS.FAILED,
		]) {
			const d = await seedBookDonation(actors.donaturA, addressA, status);
			const res = await request(app)
				.put('/api/book-donations/' + d.id)
				.send({ estimated_value: 250000 })
				.use(as(actors.donaturA));
			expect(res.status).toBe(400);
		}
	});

	it('BD-23 donatur lain: 404; BD-24 Admin: 403; BD-25 SA: 404', async () => {
		const d = await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.PENDING);
		const payload = { estimated_value: 250000 };

		const other = await request(app)
			.put('/api/book-donations/' + d.id)
			.send(payload)
			.use(as(actors.donaturB));
		expect(other.status).toBe(404);

		const admin = await request(app)
			.put('/api/book-donations/' + d.id)
			.send(payload)
			.use(as(actors.admin));
		expect(admin.status).toBe(403);

		const sa = await request(app)
			.put('/api/book-donations/' + d.id)
			.send(payload)
			.use(as(actors.superadmin));
		expect(sa.status).toBe(404);
	});
});

describe('BD-DESTROY DELETE /api/book-donations/:id', () => {
	it('BD-26 pemilik + Pending: 200, draft Biteship dibatalkan, tanpa log', async () => {
		const d = await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.PENDING);

		const res = await request(app)
			.delete('/api/book-donations/' + d.id)
			.use(as(actors.donaturA));

		expect(res.status).toBe(200);
		expect(await BookDonation.findByPk(d.id)).toBeNull();
		expect(biteship.del).toHaveBeenCalledWith('draft_orders/DRAFT-SEED');
		expect(await countLogs()).toBe(0);
	});

	it('BD-27 pemilik hapus donasi Gagal: 400', async () => {
		const d = await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.FAILED);
		const res = await request(app)
			.delete('/api/book-donations/' + d.id)
			.use(as(actors.donaturA));
		expect(res.status).toBe(400);
		expect(await BookDonation.findByPk(d.id)).not.toBeNull();
	});

	it('BD-27b Admin hapus donasi Gagal: 200, draft Biteship dibatalkan, log tercatat', async () => {
		const d = await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.FAILED);

		const res = await request(app)
			.delete('/api/book-donations/' + d.id)
			.use(as(actors.admin));

		expect(res.status).toBe(200);
		expect(await BookDonation.findByPk(d.id)).toBeNull();
		expect(biteship.del).toHaveBeenCalledWith('draft_orders/DRAFT-SEED');
		expect(await countLogs()).toBe(1);
	});

	it('BD-28 Admin hapus non-Gagal: 400; BD-29 SA (Pending orang lain): 400; BD-30 donatur lain: 404', async () => {
		const d = await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.PENDING);

		const admin = await request(app)
			.delete('/api/book-donations/' + d.id)
			.use(as(actors.admin));
		expect(admin.status).toBe(400);

		const sa = await request(app)
			.delete('/api/book-donations/' + d.id)
			.use(as(actors.superadmin));
		expect(sa.status).toBe(400);

		const other = await request(app)
			.delete('/api/book-donations/' + d.id)
			.use(as(actors.donaturB));
		expect(other.status).toBe(404);
	});
});

describe('BD-VERIFY POST /api/book-donations/:id/verify', () => {
	it('BD-32 Admin approve: 200 -> Success, tracking terisi, idempoten, log tercatat', async () => {
		const d = await seedBookDonation(
			actors.donaturA,
			addressA,
			PAYMENT_STATUS.WAITING_VERIFICATION
		);

		const res = await request(app)
			.post(`/api/book-donations/${d.id}/verify`)
			.send({ approve: true })
			.use(as(actors.admin));

		expect(res.status).toBe(200);
		expect(res.body.data.status).toBe(PAYMENT_STATUS.SUCCESS);
		expect(res.body.data.tracking_id).toBe('TRACK-123');
		expect(biteship.post).toHaveBeenCalledWith('draft_orders/DRAFT-SEED/confirm');
		expect(await countLogs()).toBe(1);

		const again = await request(app)
			.post(`/api/book-donations/${d.id}/verify`)
			.send({ approve: true })
			.use(as(actors.admin));
		expect(again.status).toBe(400);
	});

	it('BD-33 Admin approve tapi Biteship gagal: 502, status TIDAK berubah', async () => {
		const d = await seedBookDonation(
			actors.donaturA,
			addressA,
			PAYMENT_STATUS.WAITING_VERIFICATION
		);

		biteship.post.mockRejectedValueOnce(new Error('Biteship down'));

		const res = await request(app)
			.post(`/api/book-donations/${d.id}/verify`)
			.send({ approve: true })
			.use(as(actors.admin));

		expect(res.status).toBe(502);
		const fresh = await BookDonation.findByPk(d.id);
		expect(fresh.status).toBe(PAYMENT_STATUS.WAITING_VERIFICATION);
	});

	it('BD-34 Admin reject: 200 -> Failed, order Biteship dibatalkan, log tercatat', async () => {
		const d = await seedBookDonation(
			actors.donaturA,
			addressA,
			PAYMENT_STATUS.WAITING_VERIFICATION
		);

		const res = await request(app)
			.post(`/api/book-donations/${d.id}/verify`)
			.send({ approve: false })
			.use(as(actors.admin));

		expect(res.status).toBe(200);
		expect(res.body.data.status).toBe(PAYMENT_STATUS.FAILED);
		expect(biteship.del).toHaveBeenCalledWith('draft_orders/DRAFT-SEED');
		expect(await countLogs()).toBe(1);
	});

	it('BD-35 verify pada status selain WaitingVerification: 400; Donatur: 403', async () => {
		const d = await seedBookDonation(actors.donaturA, addressA, PAYMENT_STATUS.SUCCESS);

		const wrongStatus = await request(app)
			.post(`/api/book-donations/${d.id}/verify`)
			.send({ approve: true })
			.use(as(actors.admin));
		expect(wrongStatus.status).toBe(400);

		const donatur = await request(app)
			.post(`/api/book-donations/${d.id}/verify`)
			.send({ approve: true })
			.use(as(actors.donaturA));
		expect(donatur.status).toBe(403);
	});
});
