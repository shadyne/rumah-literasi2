import * as React from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { currency } from '@/libs/utils';
import { PAYMENT_STATUS } from '@/libs/constant';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Map } from '@/components/map';
import { DonationItem } from '@/components/book-donations/donation-item-card';
import { HeadingSubtitle } from '@/components/ui/heading';
import { Hint } from '@/components/ui/hint';
import { Select } from '@/components/ui/select';

const STATUS_LIST = Object.values(PAYMENT_STATUS);

const BookDonationSchema = z.object({
	status: z.enum(STATUS_LIST),
	acceptance_notes: z.string().optional(),
});

const BookDonationForm = ({ initial, action, label }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(BookDonationSchema),
		defaultValues: initial,
	});

	return (
		<form onSubmit={handleSubmit(action)} className='space-y-8'>
			<HeadingSubtitle>Donation Items</HeadingSubtitle>

			<div className='grid items-start grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
				{initial.book_donation_items.map((item) => (
					<div key={item.id} className='relative group'>
						<DonationItem item={item} />
					</div>
				))}
			</div>

			<HeadingSubtitle>Donation Details</HeadingSubtitle>

			<div className='grid gap-6 lg:grid-cols-2'>
				<div>
					<Label htmlFor='member'>Member</Label>
					<Input disabled type='text' defaultValue={initial.user.name} />
				</div>
				<div>
					<Label htmlFor='estimated_value'>Estimated Value (Rp)</Label>
					<Input
						disabled
						type='text'
						defaultValue={currency(initial.estimated_value)}
					/>
				</div>

				<div>
					<Label htmlFor='weight'>Total Weight (kg)</Label>
					<Input disabled type='text' defaultValue={initial.weight + ' kg'} />
				</div>

				<div>
					<Label htmlFor='length'>Length (cm)</Label>
					<Input disabled type='text' defaultValue={initial.length + ' cm'} />
				</div>

				<div>
					<Label htmlFor='width'>Width (cm)</Label>
					<Input disabled type='text' defaultValue={initial.width + ' cm'} />
				</div>

				<div>
					<Label htmlFor='height'>Height (cm)</Label>
					<Input disabled type='text' defaultValue={initial.height + ' cm'} />
				</div>

				<div className='col-span-full'>
					<Label htmlFor='delivery_address'>Delivery Address</Label>
					<Input disabled type='text' defaultValue={initial.address.name} />
				</div>

				<div className='col-span-full'>
					<Label htmlFor='street_address'>Street Address</Label>
					<Input
						disabled
						type='text'
						defaultValue={initial.address.street_address}
					/>
				</div>

				<div className='col-span-full'>
					<Label htmlFor='location'>Location</Label>
					<Map
						location={{
							latitude: initial.address.latitude,
							longitude: initial.address.longitude,
						}}
						className='w-full aspect-banner'
						readonly
					/>
				</div>
			</div>

			<HeadingSubtitle>Courier Information</HeadingSubtitle>

			<div className='grid gap-6 lg:grid-cols-2'>
				<div>
					<Label htmlFor='courier_code'>Courier Company</Label>
					<Input
						disabled
						type='text'
						className='uppercase'
						defaultValue={initial.courier_code}
					/>
				</div>

				<div>
					<Label htmlFor='courier_service_code'>Courier Type</Label>
					<Input
						disabled
						type='text'
						className='uppercase'
						defaultValue={initial.courier_service_code}
					/>
				</div>

				<div>
					<Label htmlFor='shipping_fee'>Shipping Fee</Label>
					<Input
						disabled
						type='text'
						defaultValue={currency(initial.shipping_fee)}
					/>
				</div>

				<div>
					<Label htmlFor='shipping_eta'>Shipping Duration</Label>
					<Input disabled type='text' defaultValue={initial.shipping_eta} />
				</div>
			</div>

			<HeadingSubtitle>Tracking Information</HeadingSubtitle>

			<div className='grid gap-6 lg:grid-cols-2'>
				<div>
					<Label htmlFor='order-id'>Order ID</Label>
					<Input
						disabled
						type='text'
						defaultValue={initial.order_id || 'Not available'}
					/>
				</div>
				<div>
					<Label htmlFor='tracking-id'>Tracking ID</Label>
					<Input
						disabled
						type='text'
						defaultValue={initial.tracking_id || 'Not available'}
					/>
				</div>
			</div>

			<HeadingSubtitle>Status Management</HeadingSubtitle>

			<div>
				<Label htmlFor='status'>Update Status</Label>
				<Select {...register('status')}>
					{STATUS_LIST.map((status) => (
						<option key={status} value={status}>
							{status}
						</option>
					))}
				</Select>
				<Hint>Status of the book donation process.</Hint>
				{errors.status && (
					<span className='text-red-500'>{errors.status.message}</span>
				)}
			</div>

			<div className='col-span-full'>
				<Label htmlFor='acceptance-notes'>Acceptance Notes</Label>
				<Textarea
					type='text'
					placeholder='Enter acceptance notes'
					{...register('acceptance_notes')}
				/>
				<Hint>Notes about the acceptance of this donation.</Hint>
				{errors.acceptance_notes && (
					<span className='text-red-500'>
						{errors.acceptance_notes.message}
					</span>
				)}
			</div>

			<div className='col-span-full'>
				<Button type='submit'>{label}</Button>
			</div>
		</form>
	);
};

export default BookDonationForm;
