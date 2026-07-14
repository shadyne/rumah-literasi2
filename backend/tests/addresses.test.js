const request = require('supertest');

const { buildApp } = require('./helpers/app');
const { installBiteshipMock } = require('./helpers/biteship-mock');
const { resetAndSeed, seedAddress } = require('./helpers/db');
const { Address } = require('../models');

const app = buildApp();

let actors;
let biteship;

const as = (user) => (req) => req.set('x-actor-uuid', user.uuid);

const storeBody = {
	name: 'Rumah Baru',
	contact_name: 'Kontak Test',
	contact_phone: '081234567890',
	street_address: 'Jl. Baru No. 2',
	note: 'pagar hijau',
	zipcode: '60111',
	latitude: -7.25,
	longitude: 112.75,
	province_id: '1',
	city_id: '1',
};

beforeEach(async () => {
	actors = await resetAndSeed();
	biteship = installBiteshipMock();
});

describe('AD-INDEX GET /api/addresses', () => {
	it('AD-01 Donatur: hanya alamat miliknya; AD-02 Admin/SA: semua', async () => {
		await seedAddress(actors.donaturA);
		await seedAddress(actors.donaturB);

		const donatur = await request(app)
			.get('/api/addresses')
			.use(as(actors.donaturA));
		expect(donatur.status).toBe(200);
		expect(donatur.body.data.rows).toHaveLength(1);
		expect(donatur.body.data.rows[0].user_id).toBe(actors.donaturA.id);

		for (const actor of [actors.admin, actors.superadmin]) {
			const res = await request(app).get('/api/addresses').use(as(actor));
			expect(res.status).toBe(200);
			expect(res.body.data.rows).toHaveLength(2);
		}
	});
});

describe('AD-STORE POST /api/addresses', () => {
	it('AD-03 Donatur: 200, milik sendiri, alamat pertama otomatis default, lokasi Biteship dibuat', async () => {
		const res = await request(app)
			.post('/api/addresses')
			.send(storeBody)
			.use(as(actors.donaturA));

		expect(res.status).toBe(200);
		expect(res.body.data.user_id).toBe(actors.donaturA.id);
		expect(res.body.data.is_default).toBe(true);
		expect(res.body.data.area_id).toBe('LOC-NEW');
		expect(biteship.post).toHaveBeenCalledWith(
			'/locations',
			expect.any(Object)
		);
	});

	it('AD-03b Admin membuat alamat: 403', async () => {
		const res = await request(app)
			.post('/api/addresses')
			.send(storeBody)
			.use(as(actors.admin));
		expect(res.status).toBe(403);
	});

	it('AD-03c Superadmin membuat alamat: 403', async () => {
		const res = await request(app)
			.post('/api/addresses')
			.send(storeBody)
			.use(as(actors.superadmin));
		expect(res.status).toBe(403);
	});

	it('AD-04 alamat ke-11: 400 (limit 10)', async () => {
		for (let i = 0; i < 10; i++) {
			await seedAddress(actors.donaturA, {
				area_id: 'AREA-' + i,
				is_default: i === 0,
			});
		}

		const res = await request(app)
			.post('/api/addresses')
			.send(storeBody)
			.use(as(actors.donaturA));

		expect(res.status).toBe(400);
		expect(await Address.count()).toBe(10);
	});

	it('AD-05 kode pos tak terdaftar: 400, tanpa row & tanpa lokasi Biteship yatim', async () => {
		biteship.get.mockResolvedValueOnce({ data: { areas: [] } });

		const res = await request(app)
			.post('/api/addresses')
			.send({ ...storeBody, zipcode: '99999' })
			.use(as(actors.donaturA));

		expect(res.status).toBe(400);
		expect(await Address.count()).toBe(0);
		expect(biteship.post).not.toHaveBeenCalled();
		expect(biteship.del).not.toHaveBeenCalled();
	});
});

describe('AD-SHOW GET /api/addresses/:id', () => {
	it('AD-06 pemilik: 200; AD-07 donatur lain: 404; AD-08 Admin/SA: 200', async () => {
		const a = await seedAddress(actors.donaturA);

		const owner = await request(app)
			.get('/api/addresses/' + a.id)
			.use(as(actors.donaturA));
		expect(owner.status).toBe(200);

		const other = await request(app)
			.get('/api/addresses/' + a.id)
			.use(as(actors.donaturB));
		expect(other.status).toBe(404);

		for (const actor of [actors.admin, actors.superadmin]) {
			const res = await request(app)
				.get('/api/addresses/' + a.id)
				.use(as(actor));
			expect(res.status).toBe(200);
		}
	});
});

describe('AD-UPDATE PUT /api/addresses/:id (point 2)', () => {
	it('AD-09 pemilik: 200, lokasi Biteship ikut diperbarui', async () => {
		const a = await seedAddress(actors.donaturA);

		const res = await request(app)
			.put('/api/addresses/' + a.id)
			.send({ ...storeBody, name: 'Rumah Direnovasi' })
			.use(as(actors.donaturA));

		expect(res.status).toBe(200);
		expect(res.body.data.name).toBe('Rumah Direnovasi');
		expect(biteship.post).toHaveBeenCalledWith(
			'/locations/' + a.area_id,
			expect.any(Object)
		);
	});

	it('AD-10 donatur lain: 404; Admin/SA: 403 (update eksklusif Donatur)', async () => {
		const a = await seedAddress(actors.donaturA);

		const other = await request(app)
			.put('/api/addresses/' + a.id)
			.send({ ...storeBody, name: 'Dibajak' })
			.use(as(actors.donaturB));
		expect(other.status).toBe(404);

		for (const actor of [actors.admin, actors.superadmin]) {
			const res = await request(app)
				.put('/api/addresses/' + a.id)
				.send({ ...storeBody, name: 'Dibajak' })
				.use(as(actor));
			expect(res.status).toBe(403);
		}
	});
});

describe('AD-DESTROY DELETE /api/addresses/:id', () => {
	it('AD-11 pemilik: 200, lokasi Biteship ikut dihapus', async () => {
		const a = await seedAddress(actors.donaturA);

		const res = await request(app)
			.delete('/api/addresses/' + a.id)
			.use(as(actors.donaturA));

		expect(res.status).toBe(200);
		expect(await Address.findByPk(a.id)).toBeNull();
		expect(biteship.del).toHaveBeenCalledWith('/locations/' + a.area_id);
	});

	it('AD-12 donatur lain: 404', async () => {
		const a = await seedAddress(actors.donaturA);
		const res = await request(app)
			.delete('/api/addresses/' + a.id)
			.use(as(actors.donaturB));
		expect(res.status).toBe(404);
	});

	it('AD-13 Admin hapus alamat user lain: 403', async () => {
		const a = await seedAddress(actors.donaturA);
		const res = await request(app)
			.delete('/api/addresses/' + a.id)
			.use(as(actors.admin));
		expect(res.status).toBe(403);
		expect(await Address.findByPk(a.id)).not.toBeNull();
	});

	it('AD-14 Superadmin hapus alamat user lain: 403 (anomali ditutup)', async () => {
		const a = await seedAddress(actors.donaturA);
		const res = await request(app)
			.delete('/api/addresses/' + a.id)
			.use(as(actors.superadmin));
		expect(res.status).toBe(403);
		expect(await Address.findByPk(a.id)).not.toBeNull();
	});
});

describe('AD-DEFAULT PATCH /api/addresses/:id/default', () => {
	it('AD-15 pemilik: 200, default lama tergeser', async () => {
		const a1 = await seedAddress(actors.donaturA, { is_default: true });
		const a2 = await seedAddress(actors.donaturA, {
			area_id: 'AREA-2',
			is_default: false,
		});

		const res = await request(app)
			.patch(`/api/addresses/${a2.id}/default`)
			.use(as(actors.donaturA));

		expect(res.status).toBe(200);
		expect((await Address.findByPk(a2.id)).is_default).toBe(true);
		expect((await Address.findByPk(a1.id)).is_default).toBe(false);
	});

	it('AD-16 donatur lain: 404; Admin/SA: 403 (set default eksklusif Donatur)', async () => {
		const a = await seedAddress(actors.donaturA, { is_default: false });

		const other = await request(app)
			.patch(`/api/addresses/${a.id}/default`)
			.use(as(actors.donaturB));
		expect(other.status).toBe(404);

		for (const actor of [actors.admin, actors.superadmin]) {
			const res = await request(app)
				.patch(`/api/addresses/${a.id}/default`)
				.use(as(actor));
			expect(res.status).toBe(403);
		}
	});
});
