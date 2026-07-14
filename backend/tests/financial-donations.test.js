const request = require('supertest');

const { buildApp } = require('./helpers/app');
const {
	resetAndSeed,
	seedFinancialDonation,
	countLogs,
	PAYMENT_STATUS,
} = require('./helpers/db');
const { FinancialDonation } = require('../models');

const app = buildApp();
const PROOF = Buffer.from('bukti-pembayaran-dummy');

let actors;

const as = (user) => (req) => req.set('x-actor-uuid', user.uuid);

beforeEach(async () => {
	actors = await resetAndSeed();
});

describe('Autentikasi dasar', () => {
	it('tanpa identitas -> 401', async () => {
		const res = await request(app).get('/api/financial-donations');
		expect(res.status).toBe(401);
	});
});

describe('FD-INDEX GET /api/financial-donations', () => {
	it('FD-01 Donatur: hanya miliknya, termasuk Pending', async () => {
		await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);
		await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.SUCCESS);
		await seedFinancialDonation(actors.donaturB, PAYMENT_STATUS.SUCCESS);

		const res = await request(app)
			.get('/api/financial-donations')
			.use(as(actors.donaturA));

		expect(res.status).toBe(200);
		expect(res.body.data.rows).toHaveLength(2);
		const statuses = res.body.data.rows.map((r) => r.status).sort();
		expect(statuses).toEqual([PAYMENT_STATUS.PENDING, PAYMENT_STATUS.SUCCESS]);
		for (const row of res.body.data.rows) {
			expect(row.user_id).toBe(actors.donaturA.id);
		}
	});

	it('FD-02 Admin: donasi Pending tidak muncul (point 4)', async () => {
		await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);
		await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.SUCCESS);
		await seedFinancialDonation(actors.donaturB, PAYMENT_STATUS.FAILED);

		const res = await request(app)
			.get('/api/financial-donations')
			.use(as(actors.admin));

		expect(res.status).toBe(200);
		expect(res.body.data.rows).toHaveLength(2);
		for (const row of res.body.data.rows) {
			expect(row.status).not.toBe(PAYMENT_STATUS.PENDING);
		}
	});

	it('FD-03 Admin: filter ?status=Pending -> rows kosong', async () => {
		await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);

		const res = await request(app)
			.get('/api/financial-donations')
			.query({ status: PAYMENT_STATUS.PENDING })
			.use(as(actors.admin));

		expect(res.status).toBe(200);
		expect(res.body.data.rows).toHaveLength(0);
	});

	it('FD-04 Superadmin: sama dengan Admin (Pending tersembunyi)', async () => {
		await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);
		await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.SUCCESS);

		const res = await request(app)
			.get('/api/financial-donations')
			.use(as(actors.superadmin));

		expect(res.status).toBe(200);
		expect(res.body.data.rows).toHaveLength(1);
		expect(res.body.data.rows[0].status).toBe(PAYMENT_STATUS.SUCCESS);
	});

	it('FD-05 Admin: filter ?status=Failed -> hanya donasi Gagal semua user', async () => {
		await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.FAILED);
		await seedFinancialDonation(actors.donaturB, PAYMENT_STATUS.FAILED);
		await seedFinancialDonation(actors.donaturB, PAYMENT_STATUS.SUCCESS);

		const res = await request(app)
			.get('/api/financial-donations')
			.query({ status: PAYMENT_STATUS.FAILED })
			.use(as(actors.admin));

		expect(res.status).toBe(200);
		expect(res.body.data.rows).toHaveLength(2);
		for (const row of res.body.data.rows) {
			expect(row.status).toBe(PAYMENT_STATUS.FAILED);
		}
	});
});

describe('FD-SHOW GET /api/financial-donations/:id', () => {
	it('FD-06 pemilik: 200 untuk status apa pun', async () => {
		for (const status of Object.values(PAYMENT_STATUS)) {
			const d = await seedFinancialDonation(actors.donaturA, status);
			const res = await request(app)
				.get('/api/financial-donations/' + d.id)
				.use(as(actors.donaturA));
			expect(res.status).toBe(200);
			expect(res.body.data.id).toBe(d.id);
		}
	});

	it('FD-07 donatur lain: 404', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.SUCCESS);
		const res = await request(app)
			.get('/api/financial-donations/' + d.id)
			.use(as(actors.donaturB));
		expect(res.status).toBe(404);
	});

	it('FD-08 Admin/SA: 200 untuk donasi non-Pending user lain', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.SUCCESS);
		for (const actor of [actors.admin, actors.superadmin]) {
			const res = await request(app)
				.get('/api/financial-donations/' + d.id)
				.use(as(actor));
			expect(res.status).toBe(200);
		}
	});

	it('FD-09 Admin/SA membuka detail donasi Pending via URL: 404 (point 4)', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);

		for (const actor of [actors.admin, actors.superadmin]) {
			const res = await request(app)
				.get('/api/financial-donations/' + d.id)
				.use(as(actor));
			expect(res.status).toBe(404);
		}

		const owner = await request(app)
			.get('/api/financial-donations/' + d.id)
			.use(as(actors.donaturA));
		expect(owner.status).toBe(200);
	});
});

describe('FD-STORE POST /api/financial-donations', () => {
	it('FD-10 Donatur: 200, status Pending, tanpa log sistem', async () => {
		const res = await request(app)
			.post('/api/financial-donations')
			.send({ amount: 75000, notes: 'untuk buku' })
			.use(as(actors.donaturA));

		expect(res.status).toBe(200);
		expect(res.body.data.status).toBe(PAYMENT_STATUS.PENDING);
		expect(res.body.data.user_id).toBe(actors.donaturA.id);
		expect(await countLogs()).toBe(0);
	});

	it('FD-11 Admin: 403', async () => {
		const res = await request(app)
			.post('/api/financial-donations')
			.send({ amount: 75000 })
			.use(as(actors.admin));
		expect(res.status).toBe(403);
	});

	it('FD-12 Superadmin membuat donasi: 403', async () => {
		const res = await request(app)
			.post('/api/financial-donations')
			.send({ amount: 75000 })
			.use(as(actors.superadmin));
		expect(res.status).toBe(403);
	});
});

describe('FD-PAY POST /api/financial-donations/:id/pay', () => {
	it('FD-13 pemilik + Pending + bukti + channel aktif: 200 -> WaitingVerification', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);

		const res = await request(app)
			.post(`/api/financial-donations/${d.id}/pay`)
			.field('payment_channel_id', String(actors.activeChannel.id))
			.attach('payment_proof', PROOF, 'bukti.png')
			.use(as(actors.donaturA));

		expect(res.status).toBe(200);
		expect(res.body.data.status).toBe(PAYMENT_STATUS.WAITING_VERIFICATION);
		expect(res.body.data.payment_channel_id).toBe(actors.activeChannel.id);
		expect(res.body.data.paid_at).toBeTruthy();
		expect(await countLogs()).toBe(0);
	});

	it('FD-14 pemilik + status selain Pending: 400', async () => {
		const d = await seedFinancialDonation(
			actors.donaturA,
			PAYMENT_STATUS.WAITING_VERIFICATION
		);

		const res = await request(app)
			.post(`/api/financial-donations/${d.id}/pay`)
			.field('payment_channel_id', String(actors.activeChannel.id))
			.attach('payment_proof', PROOF, 'bukti.png')
			.use(as(actors.donaturA));

		expect(res.status).toBe(400);
	});

	it('FD-15 tanpa file bukti: 400', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);

		const res = await request(app)
			.post(`/api/financial-donations/${d.id}/pay`)
			.field('payment_channel_id', String(actors.activeChannel.id))
			.use(as(actors.donaturA));

		expect(res.status).toBe(400);
	});

	it('FD-16 channel nonaktif: 400', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);

		const res = await request(app)
			.post(`/api/financial-donations/${d.id}/pay`)
			.field('payment_channel_id', String(actors.inactiveChannel.id))
			.attach('payment_proof', PROOF, 'bukti.png')
			.use(as(actors.donaturA));

		expect(res.status).toBe(400);
	});

	it('FD-17 donatur lain: 404', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);

		const res = await request(app)
			.post(`/api/financial-donations/${d.id}/pay`)
			.field('payment_channel_id', String(actors.activeChannel.id))
			.attach('payment_proof', PROOF, 'bukti.png')
			.use(as(actors.donaturB));

		expect(res.status).toBe(404);
	});

	it('FD-18 Admin: 403', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);

		const res = await request(app)
			.post(`/api/financial-donations/${d.id}/pay`)
			.field('payment_channel_id', String(actors.activeChannel.id))
			.attach('payment_proof', PROOF, 'bukti.png')
			.use(as(actors.admin));

		expect(res.status).toBe(403);
	});

	it(
		'FD-19 Superadmin membayar donasi orang lain: 404',
		async () => {
			const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);

			const res = await request(app)
				.post(`/api/financial-donations/${d.id}/pay`)
				.field('payment_channel_id', String(actors.activeChannel.id))
				.attach('payment_proof', PROOF, 'bukti.png')
				.use(as(actors.superadmin));

			expect(res.status).toBe(404);
		}
	);
});

describe('FD-UPDATE PUT /api/financial-donations/:id (point 2)', () => {
	it('FD-20 pemilik + Pending: 200, amount/notes berubah, tanpa log', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);

		const res = await request(app)
			.put('/api/financial-donations/' + d.id)
			.send({ amount: 99000, notes: 'revisi' })
			.use(as(actors.donaturA));

		expect(res.status).toBe(200);
		expect(res.body.data.amount).toBe(99000);
		expect(res.body.data.notes).toBe('revisi');
		expect(await countLogs()).toBe(0);
	});

	it('FD-21 pemilik menyelipkan status "Success" di body: status tetap Pending (whitelist)', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);

		const res = await request(app)
			.put('/api/financial-donations/' + d.id)
			.send({ amount: 99000, status: PAYMENT_STATUS.SUCCESS, verified_by: 999 })
			.use(as(actors.donaturA));

		expect(res.status).toBe(200);
		const fresh = await FinancialDonation.findByPk(d.id);
		expect(fresh.status).toBe(PAYMENT_STATUS.PENDING);
		expect(fresh.verified_by).toBeNull();
	});

	it('FD-22 pemilik + status selain Pending: 400', async () => {
		for (const status of [
			PAYMENT_STATUS.WAITING_VERIFICATION,
			PAYMENT_STATUS.SUCCESS,
			PAYMENT_STATUS.FAILED,
		]) {
			const d = await seedFinancialDonation(actors.donaturA, status);
			const res = await request(app)
				.put('/api/financial-donations/' + d.id)
				.send({ amount: 99000 })
				.use(as(actors.donaturA));
			expect(res.status).toBe(400);
		}
	});

	it('FD-23 donatur lain: 404', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);
		const res = await request(app)
			.put('/api/financial-donations/' + d.id)
			.send({ amount: 99000 })
			.use(as(actors.donaturB));
		expect(res.status).toBe(404);
	});

	it('FD-24 Admin: 403 (point 2 — admin tidak boleh edit)', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);
		const res = await request(app)
			.put('/api/financial-donations/' + d.id)
			.send({ amount: 99000 })
			.use(as(actors.admin));
		expect(res.status).toBe(403);
	});

	it('FD-25 Superadmin edit donasi orang lain: 404 (owner-where menutup bypass scope)', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);
		const res = await request(app)
			.put('/api/financial-donations/' + d.id)
			.send({ amount: 99000 })
			.use(as(actors.superadmin));
		expect(res.status).toBe(404);
	});
});

describe('FD-DESTROY DELETE /api/financial-donations/:id (point 3)', () => {
	it('FD-26 pemilik + Pending: 200, terhapus, tanpa log', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);

		const res = await request(app)
			.delete('/api/financial-donations/' + d.id)
			.use(as(actors.donaturA));

		expect(res.status).toBe(200);
		expect(await FinancialDonation.findByPk(d.id)).toBeNull();
		expect(await countLogs()).toBe(0);
	});

	it('FD-27 pemilik + WaitingVerification/Success: 400, tidak terhapus', async () => {
		for (const status of [
			PAYMENT_STATUS.WAITING_VERIFICATION,
			PAYMENT_STATUS.SUCCESS,
		]) {
			const d = await seedFinancialDonation(actors.donaturA, status);
			const res = await request(app)
				.delete('/api/financial-donations/' + d.id)
				.use(as(actors.donaturA));
			expect(res.status).toBe(400);
			expect(await FinancialDonation.findByPk(d.id)).not.toBeNull();
		}
	});

	it('FD-28 pemilik hapus donasi Gagal: 400 (jalur hapus Gagal milik admin)', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.FAILED);
		const res = await request(app)
			.delete('/api/financial-donations/' + d.id)
			.use(as(actors.donaturA));
		expect(res.status).toBe(400);
		expect(await FinancialDonation.findByPk(d.id)).not.toBeNull();
	});

	it('FD-28b Admin hapus donasi Gagal: 200, terhapus, log tercatat', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.FAILED);
		const res = await request(app)
			.delete('/api/financial-donations/' + d.id)
			.use(as(actors.admin));
		expect(res.status).toBe(200);
		expect(await FinancialDonation.findByPk(d.id)).toBeNull();
		expect(await countLogs()).toBe(1);
	});

	it('FD-28c Superadmin hapus donasi Gagal orang lain: 200', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.FAILED);
		const res = await request(app)
			.delete('/api/financial-donations/' + d.id)
			.use(as(actors.superadmin));
		expect(res.status).toBe(200);
		expect(await FinancialDonation.findByPk(d.id)).toBeNull();
	});

	it('FD-29 Admin hapus donasi non-Gagal: 400, tidak terhapus', async () => {
		for (const status of [
			PAYMENT_STATUS.PENDING,
			PAYMENT_STATUS.WAITING_VERIFICATION,
			PAYMENT_STATUS.SUCCESS,
		]) {
			const d = await seedFinancialDonation(actors.donaturA, status);
			const res = await request(app)
				.delete('/api/financial-donations/' + d.id)
				.use(as(actors.admin));
			expect(res.status).toBe(400);
			expect(await FinancialDonation.findByPk(d.id)).not.toBeNull();
		}
	});

	it('FD-30 Superadmin hapus donasi Pending orang lain: 400 (bukan Gagal)', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);
		const res = await request(app)
			.delete('/api/financial-donations/' + d.id)
			.use(as(actors.superadmin));
		expect(res.status).toBe(400);
	});

	it('FD-31 donatur lain: 404', async () => {
		const d = await seedFinancialDonation(actors.donaturA, PAYMENT_STATUS.PENDING);
		const res = await request(app)
			.delete('/api/financial-donations/' + d.id)
			.use(as(actors.donaturB));
		expect(res.status).toBe(404);
	});
});

describe('FD-VERIFY POST /api/financial-donations/:id/verify', () => {
	it('FD-32 Admin approve WaitingVerification: 200 -> Success, verified_by terisi, log tercatat', async () => {
		const d = await seedFinancialDonation(
			actors.donaturA,
			PAYMENT_STATUS.WAITING_VERIFICATION
		);

		const res = await request(app)
			.post(`/api/financial-donations/${d.id}/verify`)
			.send({ approve: true, acceptance_notes: 'diterima' })
			.use(as(actors.admin));

		expect(res.status).toBe(200);
		expect(res.body.data.status).toBe(PAYMENT_STATUS.SUCCESS);
		expect(res.body.data.verified_by).toBe(actors.admin.id);
		expect(await countLogs()).toBe(1);
	});

	it('FD-33 Admin reject WaitingVerification: 200 -> Failed, log tercatat', async () => {
		const d = await seedFinancialDonation(
			actors.donaturA,
			PAYMENT_STATUS.WAITING_VERIFICATION
		);

		const res = await request(app)
			.post(`/api/financial-donations/${d.id}/verify`)
			.send({ approve: false })
			.use(as(actors.admin));

		expect(res.status).toBe(200);
		expect(res.body.data.status).toBe(PAYMENT_STATUS.FAILED);
		expect(await countLogs()).toBe(1);
	});

	it('FD-34 Admin verify pada status selain WaitingVerification: 400', async () => {
		for (const status of [
			PAYMENT_STATUS.PENDING,
			PAYMENT_STATUS.SUCCESS,
			PAYMENT_STATUS.FAILED,
		]) {
			const d = await seedFinancialDonation(actors.donaturA, status);
			const res = await request(app)
				.post(`/api/financial-donations/${d.id}/verify`)
				.send({ approve: true })
				.use(as(actors.admin));
			expect(res.status).toBe(400);
		}
	});

	it('FD-35 Donatur verify: 403', async () => {
		const d = await seedFinancialDonation(
			actors.donaturA,
			PAYMENT_STATUS.WAITING_VERIFICATION
		);
		const res = await request(app)
			.post(`/api/financial-donations/${d.id}/verify`)
			.send({ approve: true })
			.use(as(actors.donaturA));
		expect(res.status).toBe(403);
	});
});
