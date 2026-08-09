const biteship = require('../../libs/biteship');

const installBiteshipMock = () => {
	vi.clearAllMocks();

	const get = vi.spyOn(biteship, 'get').mockImplementation(async (url) => {
		const u = String(url);
		if (String(url).includes('maps/areas')) {
			return { data: { areas: [{ id: 'AREA-VALID' }] } };
		}
		if (u.includes('trackings/')) {
			return { data: { status: 'on_progress' } };
		}
		if (u.includes('/rates')) {
			return {
				data: {
					pricing: [
						{
							courier_code: 'jne',
							courier_service_code: 'reg',
							price: 15000,
						},
					],
				},
			};
		}
		if (u.includes('draft_orders/')) {
			return {
				data: {
					id: 'DRAFT-NEW',
					status: 'ready',
					price: 15000,
					courier: { company: 'jne', type: 'reg' },
				},
			};
		}
		return { data: {} };
	});

	const post = vi.spyOn(biteship, 'post').mockImplementation(async (url) => {
		const u = String(url);
		if (u.includes('/confirm')) {
			return {
				data: {
					id: 'ORDER-CONFIRMED',
					price: 15000,
					courier: { tracking_id: 'TRACK-123' },
				},
			};
		}
		if (u === 'draft_orders') {
			return { data: { id: 'DRAFT-NEW', status: 'placed', price: null } };
		}
		if (u.includes('draft_orders/')) {
			return {
				data: {
					id: 'DRAFT-NEW',
					status: 'ready',
					price: 15000,
					courier: { company: 'jne', type: 'reg' },
				},
			};
		}
		if (u.includes('locations')) {
			return { data: { id: 'LOC-NEW' } };
		}
		return { data: {} };
	});

	const del = vi
		.spyOn(biteship, 'delete')
		.mockImplementation(async () => ({ data: { success: true } }));

	return { get, post, del };
};

module.exports = { installBiteshipMock };
