import * as React from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Map } from '@/components/map';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DEFAULT_LOCATION } from '@/libs/constant';
import { useConfirm } from '@/hooks/use-confirm';

const GiftSchema = z.object({
	title: z.string().min(3),
	genre: z.string().min(3),
	amount: z.coerce.number().min(1),
	address: z.string().min(3),
	latitude: z.coerce.number(),
	longitude: z.coerce.number(),
});

const EditSchema = GiftSchema.merge(
	z.object({
		status: z.enum(['pending', 'ongoing', 'accepted', 'rejected']),
	})
);

const GiftForm = ({ initial, action, label }) => {
	const { confirm } = useConfirm();

	const {
		watch,
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(initial ? EditSchema : GiftSchema),
		defaultValues: initial || {
			title: '',
			genre: '',
			amount: 1,
			address: '',
			...DEFAULT_LOCATION,
		},
	});

	const handleUseMyLocation = async () => {
		confirm({
			title: 'Use my location',
			description: 'Are you sure you want to use your location?',
		})
			.then(async () => {
				if ('geolocation' in navigator) {
					navigator.geolocation.getCurrentPosition(
						(position) => {
							const { latitude, longitude } = position.coords;
							setValue('latitude', latitude);
							setValue('longitude', longitude);
						},
						(error) => {
							console.error('Error getting location:', error);
							alert(
								'Unable to retrieve your location. Please check your browser permissions.'
							);
						},
						{ enableHighAccuracy: true }
					);
				}
			})
			.catch(() => {
				// pass
			});
	};

	return (
		<form onSubmit={handleSubmit(action)} className='grid lg:grid-cols-2 gap-6'>
			<div className='col-span-full'>
				<Label htmlFor='title'>Title</Label>
				<Input
					type='text'
					placeholder='Enter the title of the book'
					{...register('title')}
				/>
				{errors.title && (
					<span className='text-red-500'>{errors.title.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='genre'>Genre</Label>
				<Input
					type='text'
					placeholder='Enter the genre of the book'
					{...register('genre')}
				/>
				{errors.genre && (
					<span className='text-red-500'>{errors.genre.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='amount'>Amount</Label>
				<Input
					type='number'
					placeholder='Enter the amount of books'
					{...register('amount')}
				/>
				{errors.amount && (
					<span className='text-red-500'>{errors.amount.message}</span>
				)}
			</div>

			<div className='col-span-full'>
				<Label htmlFor='address'>Address</Label>
				<Textarea placeholder='Enter your address' {...register('address')} />
				{errors.address && (
					<span className='text-red-500'>{errors.address.message}</span>
				)}
			</div>

			<div className='col-span-full'>
				<Label htmlFor='location'>Location</Label>
				<Map
					location={{
						latitude: watch('latitude'),
						longitude: watch('longitude'),
					}}
					className='aspect-banner'
					setLocation={(location) => {
						setValue('latitude', location.latitude);
						setValue('longitude', location.longitude);
					}}
				/>
			</div>

			{initial && (
				<div>
					<Label htmlFor='status'>Status</Label>
					<select
						className='block w-full p-3 border shadow-sm border-zinc-300 rounded-xl focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-zinc-100'
						{...register('status')}>
						<option value='pending'>Pending</option>
						<option value='ongoing'>Ongoing</option>
						<option value='accepted'>Accepted</option>
						<option value='rejected'>Rejected</option>
					</select>
					{errors.status && (
						<span className='text-red-500'>{errors.status.message}</span>
					)}
				</div>
			)}

			<div className='flex items-center gap-2 col-span-full'>
				<Button>{label}</Button>
				<Button variant='outline' type='button' onClick={handleUseMyLocation}>
					Use my location
				</Button>
			</div>
		</form>
	);
};

export default GiftForm;
