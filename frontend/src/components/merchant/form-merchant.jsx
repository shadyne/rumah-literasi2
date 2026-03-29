import * as React from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Map } from '@/components/map';
import { Hint } from '@/components/ui/hint';
import { useConfirm } from '@/hooks/use-confirm';

const MerchantSchema = z.object({
	name: z.string().min(3),
	phone: z.string().min(10),
	email: z.string().email(),
	address: z.string().min(10),
	zipcode: z.string().min(4),
	area_id: z.string().min(1),
	latitude: z.coerce.number(),
	longitude: z.coerce.number(),
});

const MerchantForm = ({ initial, action, label }) => {
	const { confirm } = useConfirm();

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = useForm({
		resolver: zodResolver(MerchantSchema),
		defaultValues: initial || {
			name: '',
			phone: '',
			email: '',
			address: '',
			zipcode: '',
			area_id: '',
			latitude: '',
			longitude: '',
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
		<form onSubmit={handleSubmit(action)} className='grid gap-6 lg:grid-cols-2'>
			<div className='col-span-full'>
				<Label htmlFor='name'>Name</Label>
				<Input
					type='text'
					placeholder='Enter merchant name'
					{...register('name')}
				/>
				<Hint>Name of the merchant or business.</Hint>
				{errors.name && (
					<span className='text-red-500'>{errors.name.message}</span>
				)}
			</div>

			<div className='col-span-full'>
				<Label htmlFor='phone'>Phone</Label>
				<Input
					type='text'
					placeholder='Enter phone number'
					{...register('phone')}
				/>
				<Hint>Contact phone number for the merchant.</Hint>
				{errors.phone && (
					<span className='text-red-500'>{errors.phone.message}</span>
				)}
			</div>

			<div className='col-span-full'>
				<Label htmlFor='email'>Email</Label>
				<Input
					type='email'
					placeholder='Enter email address'
					{...register('email')}
				/>
				<Hint>Email address for the merchant.</Hint>
				{errors.email && (
					<span className='text-red-500'>{errors.email.message}</span>
				)}
			</div>

			<div className='col-span-full'>
				<Label htmlFor='address'>Address</Label>
				<Textarea
					placeholder='Enter merchant address'
					{...register('address')}
				/>
				<Hint>Complete address of the merchant location.</Hint>
				{errors.address && (
					<span className='text-red-500'>{errors.address.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='zipcode'>Zipcode</Label>
				<Input
					type='text'
					placeholder='Enter zipcode'
					{...register('zipcode')}
				/>
				<Hint>Postal code for the merchant's location.</Hint>
				{errors.zipcode && (
					<span className='text-red-500'>{errors.zipcode.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='area_id'>Area ID</Label>
				<Input
					type='text'
					placeholder='Enter area ID'
					{...register('area_id')}
				/>
				<Hint>Do not edit this field unless you change the area ID.</Hint>
				{errors.area_id && (
					<span className='text-red-500'>{errors.area_id.message}</span>
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

			<div className='flex items-center gap-2 col-span-full'>
				<Button>{label}</Button>
				<Button variant='outline' type='button' onClick={handleUseMyLocation}>
					Use my location
				</Button>
			</div>
		</form>
	);
};

export default MerchantForm;
