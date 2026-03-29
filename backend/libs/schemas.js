const { z } = require('zod');

const itemSchema = z.object({
	isbn: z.string().nonempty(),
	title: z.string().nonempty(),
	author: z.string().nonempty(),
	publisher: z.string().nonempty(),
	year: z.coerce.number(),
	language: z.string().nonempty(),
	amount: z.coerce.number().min(1),
});

const detailSchema = z.object({
	address_id: z.string().nonempty(),
	package_size: z.enum(['small', 'medium', 'large']),
	estimated_value: z.coerce.number().min(1),
	length: z.coerce.number().min(1),
	width: z.coerce.number().min(1),
	height: z.coerce.number().min(1),
	weight: z.coerce.number().min(1),
});

const courierSchema = z.object({
	company: z.string().nonempty(),
	courier_code: z.string().nonempty(),
	courier_service_code: z.string().nonempty(),
	shipping_fee: z.number(),
	duration: z.string().nonempty(),
	type: z.string().nonempty(),
});

const bookDonationSchema = z.object({
	items: z.array(itemSchema),
	detail: detailSchema,
	courier: courierSchema,
});

module.exports = {
	itemSchema,
	detailSchema,
	courierSchema,
	bookDonationSchema,
};
