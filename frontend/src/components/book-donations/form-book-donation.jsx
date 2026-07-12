import * as React from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { currency } from '@/libs/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Map } from '@/components/map';
import { DonationItem } from '@/components/book-donations/donation-item-card';
import { HeadingSubtitle } from '@/components/ui/heading';
import { Hint } from '@/components/ui/hint';

const BookDonationSchema = z.object({
	estimated_value: z.coerce
		.number()
		.min(0, 'Perkiraan nilai tidak boleh negatif'),
	pickup_note: z.string().optional(),
});

const displayWeight = (weight) => {
	if (!weight && weight !== 0) return '—';
	return `${Number(weight)} gram`;
};

const BookDonationForm = ({ initial, action, label }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(BookDonationSchema),
		defaultValues: {
			estimated_value: initial.estimated_value,
			pickup_note: initial.pickup_note || '',
		},
	});

	return (
		<form onSubmit={handleSubmit(action)} className='space-y-8'>
			<HeadingSubtitle>Item Donasi</HeadingSubtitle>

			<div className='grid items-start grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
				{initial.book_donation_items.map((item) => (
					<div key={item.id} className='relative group'>
						<DonationItem item={item} />
					</div>
				))}
			</div>

			<div className='border border-zinc-200 rounded-xl overflow-hidden'>
				<div className='p-3 bg-zinc-50 border-b border-zinc-100'>
					<p className='text-sm font-semibold'>Detail Lengkap Item Buku</p>
				</div>
				<div className='overflow-x-auto'>
					<table className='w-full text-sm'>
						<thead className='bg-zinc-100'>
							<tr>
								<th className='text-left px-4 py-2 font-semibold'>Judul</th>
								<th className='text-left px-4 py-2 font-semibold'>Penulis</th>
								<th className='text-left px-4 py-2 font-semibold'>Penerbit</th>
								<th className='text-left px-4 py-2 font-semibold'>Tahun</th>
								<th className='text-left px-4 py-2 font-semibold'>Jumlah</th>
							</tr>
						</thead>
						<tbody>
							{initial.book_donation_items.map((item, idx) => (
								<tr key={item.id} className={idx % 2 === 0 ? '' : 'bg-zinc-50'}>
									<td className='px-4 py-2 max-w-xs'>
										<p className='whitespace-normal break-words'>
											{item.title}
										</p>
									</td>
									<td className='px-4 py-2 whitespace-nowrap'>{item.author}</td>
									<td className='px-4 py-2 whitespace-nowrap'>
										{item.publisher}
									</td>
									<td className='px-4 py-2 whitespace-nowrap'>{item.year}</td>
									<td className='px-4 py-2 whitespace-nowrap'>{item.amount}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<HeadingSubtitle>Detail Donasi</HeadingSubtitle>

			<div className='grid gap-6 lg:grid-cols-2'>
				<div>
					<Label htmlFor='member'>Anggota</Label>
					<Input disabled type='text' defaultValue={initial.user.name} />
				</div>
				<div>
					<Label htmlFor='estimated_value'>Perkiraan Nilai (Rp)</Label>
					<Input
						type='text'
						inputMode='numeric'
						placeholder='Masukkan perkiraan nilai donasi'
						{...register('estimated_value')}
					/>
					{errors.estimated_value && (
						<span className='text-red-500'>
							{errors.estimated_value.message}
						</span>
					)}
				</div>

				<div>
					<Label htmlFor='weight'>Berat</Label>
					<Input
						disabled
						type='text'
						defaultValue={displayWeight(initial.weight)}
					/>
				</div>

				<div>
					<Label htmlFor='length'>Panjang (cm)</Label>
					<Input disabled type='text' defaultValue={initial.length + ' cm'} />
				</div>

				<div>
					<Label htmlFor='width'>Lebar (cm)</Label>
					<Input disabled type='text' defaultValue={initial.width + ' cm'} />
				</div>

				<div>
					<Label htmlFor='height'>Tinggi (cm)</Label>
					<Input disabled type='text' defaultValue={initial.height + ' cm'} />
				</div>

				<div className='col-span-full'>
					<Label htmlFor='delivery_address'>Alamat Pengiriman</Label>
					<Input disabled type='text' defaultValue={initial.address.name} />
				</div>

				<div className='col-span-full'>
					<Label htmlFor='street_address'>Alamat Jalan</Label>
					<Input
						disabled
						type='text'
						defaultValue={initial.address.street_address}
					/>
				</div>

				<div className='col-span-full'>
					<Label htmlFor='location'>Lokasi</Label>
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

			<HeadingSubtitle>Informasi Kurir</HeadingSubtitle>

			<div className='grid gap-6 lg:grid-cols-2'>
				<div>
					<Label htmlFor='courier_code'>Perusahaan Kurir</Label>
					<Input
						disabled
						type='text'
						className='uppercase'
						defaultValue={initial.courier_code}
					/>
				</div>

				<div>
					<Label htmlFor='courier_service_code'>Jenis Layanan Kurir</Label>
					<Input
						disabled
						type='text'
						className='uppercase'
						defaultValue={initial.courier_service_code}
					/>
				</div>

				<div>
					<Label htmlFor='shipping_fee'>Biaya Pengiriman</Label>
					<Input
						disabled
						type='text'
						defaultValue={currency(initial.shipping_fee)}
					/>
				</div>

				<div>
					<Label htmlFor='shipping_eta'>Estimasi Pengiriman</Label>
					<Input disabled type='text' defaultValue={initial.shipping_eta} />
				</div>
			</div>

			<HeadingSubtitle>Informasi Pelacakan</HeadingSubtitle>

			<div className='grid gap-6 lg:grid-cols-2'>
				<div>
					<Label htmlFor='order-id'>ID Pesanan</Label>
					<Input
						disabled
						type='text'
						defaultValue={initial.order_id || 'Tidak tersedia'}
					/>
				</div>
				<div>
					<Label htmlFor='tracking-id'>ID Pelacakan</Label>
					<Input
						disabled
						type='text'
						defaultValue={initial.tracking_id || 'Tidak tersedia'}
					/>
				</div>
			</div>

			{initial.method === 'pickup' && (
				<React.Fragment>
					<HeadingSubtitle>Catatan Penjemputan</HeadingSubtitle>

					<div className='col-span-full'>
						<Label htmlFor='pickup_note'>Catatan untuk Kurir</Label>
						<Textarea
							type='text'
							placeholder='Masukkan catatan penjemputan'
							{...register('pickup_note')}
						/>
						<Hint>Catatan tambahan untuk kurir saat penjemputan.</Hint>
						{errors.pickup_note && (
							<span className='text-red-500'>{errors.pickup_note.message}</span>
						)}
					</div>
				</React.Fragment>
			)}

			<div className='col-span-full'>
				<Button type='submit'>{label}</Button>
			</div>
		</form>
	);
};

export default BookDonationForm;
