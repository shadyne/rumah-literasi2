import * as React from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { STEPS, useTransactionStore } from '@/store/use-transactions';

import { Map } from '@/components/map';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useConfirm } from '@/hooks/use-confirm';

const TransactionSchema = z.object({
	name: z.string().min(3),
	phone: z.string().min(11),
	address: z.string().min(3),
	note: z.string().optional(),
	latitude: z.coerce.number(),
	longitude: z.coerce.number(),
});

const StepRecipient = () => {
	const { confirm } = useConfirm();
	const { recipient, setRecipient, route } = useTransactionStore();

	const {
		watch,
		setValue,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(TransactionSchema),
		defaultValues: recipient,
	});

	const onSubmit = async (data) => {
		setRecipient({
			...data,
			borrowed_date: new Date().toISOString().split('T')[0],
		});
		route(STEPS.COURIER);
	};

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
							alert('Unable to retrieve your location.');
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
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='grid gap-6 lg:grid-cols-2'>
			<div>
				<Label htmlFor='name'>name</Label>
				<Input
					type='text'
					placeholder='Enter your name'
					{...register('name')}
				/>
				{errors.name && (
					<span className='text-red-500'>{errors.name.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='phone'>Phone</Label>
				<Input
					type='text'
					placeholder='Enter your phone'
					{...register('phone')}
				/>
				{errors.phone && (
					<span className='text-red-500'>{errors.phone.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='address'>Address</Label>
				<Textarea placeholder='Enter your address' {...register('address')} />
				{errors.address && (
					<span className='text-red-500'>{errors.address.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='note'>Notes</Label>
				<Textarea placeholder='Enter your notes' {...register('note')} />
				{errors.note && (
					<span className='text-red-500'>{errors.note.message}</span>
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

			<div className='flex items-center justify-end gap-2 col-span-full'>
				<Button variant='outline' onClick={() => route(STEPS.BOOKS)}>
					Back
				</Button>
				<Button variant='outline' type='button' onClick={handleUseMyLocation}>
					Use my location
				</Button>
				<Button>Next</Button>
			</div>
		</form>
	);
};

export default StepRecipient;
