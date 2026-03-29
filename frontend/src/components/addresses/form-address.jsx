import * as React from 'react';
import * as z from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Map } from '@/components/map';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Hint } from '@/components/ui/hint';
import { DEFAULT_LOCATION } from '@/libs/constant';
import { useConfirm } from '@/hooks/use-confirm';
import { useLocation } from '@/hooks/use-location';

const AddressSchema = z.object({
	name: z.string().min(1),
	contact_name: z.string().min(1),
	contact_phone: z.string().min(1),
	street_address: z.string().min(3),
	province_id: z.string().min(1),
	city_id: z.string().min(1),
	district_id: z.string().min(1),
	latitude: z.coerce.number(),
	longitude: z.coerce.number(),
	zipcode: z
		.string()
		.min(5, 'Zipcode must be 5 digits')
		.max(5, 'Zipcode must be 5 digits'),
	note: z.string().optional(),
});

const EditSchema = AddressSchema;

const AddressForm = ({ initial, action, label }) => {
	const { confirm } = useConfirm();
	const {
		province,
		city,
		provinces,
		districts,
		cities,
		loading,
		handleCityChange,
		handleProvinceChange,
	} = useLocation(
		initial && {
			province_id: initial.province_id,
			city_id: initial.city_id,
		}
	);

	const {
		control,
		watch,
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(initial ? EditSchema : AddressSchema),
		defaultValues: initial || {
			name: '',
			street_address: '',
			province_id: '',
			city_id: '',
			district_id: '',
			zipcode: '',
			note: '',
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
		<form onSubmit={handleSubmit(action)} className='grid gap-6 lg:grid-cols-2'>
			<div>
				<Label htmlFor='contact_name'>Contact Name</Label>
				<Input
					placeholder='Enter your contact name'
					{...register('contact_name')}
				/>
				<Hint>Name of the person who will be contacted at this address.</Hint>
				{errors.contact_name && (
					<span className='text-red-500'>{errors.contact_name.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='contact_phone'>Contact Phone</Label>
				<Input
					placeholder='Enter your contact phone'
					{...register('contact_phone')}
				/>
				<Hint>Phone number of the contact person at this address.</Hint>
				{errors.contact_phone && (
					<span className='text-red-500'>{errors.contact_phone.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='name'>Address Name</Label>
				<Input placeholder='Enter your address name' {...register('name')} />
				<Hint>Descriptive name for this location (e.g., Home, Office, etc.).</Hint>
				{errors.name && (
					<span className='text-red-500'>{errors.name.message}</span>
				)}
			</div>

			<div className='col-span-full'>
				<Label htmlFor='street_address'>Street Address</Label>
				<Textarea
					placeholder='Enter your street address'
					{...register('street_address')}
				/>
				<Hint>Complete street address including building number, street name, and any apartment/unit numbers.</Hint>
				{errors.street_address && (
					<span className='text-red-500'>{errors.street_address.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='province_id'>Province</Label>
				<Controller
					name='province_id'
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							onChange={(event) => {
								field.onChange(event);
								handleProvinceChange(event.target.value);
							}}
							disabled={loading.provinces}>
							<option value=''>Select a province</option>
							{provinces.map((province) => (
								<option key={province.id} value={province.id}>
									{province.name}
								</option>
							))}
						</Select>
					)}
				/>
				<Hint>Select the province where this address is located.</Hint>
				{errors.province_id && (
					<span className='text-red-500'>{errors.province_id.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='city_id'>City</Label>
				<Controller
					name='city_id'
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							onChange={(event) => {
								field.onChange(event);
								handleCityChange(event.target.value);
							}}
							disabled={loading.cities || !province}>
							<option value=''>Select a city</option>
							{cities.map((city) => (
								<option key={city.id} value={city.id}>
									{city.name}
								</option>
							))}
						</Select>
					)}
				/>
				<Hint>Select the city where this address is located.</Hint>
				{errors.city_id && (
					<span className='text-red-500'>{errors.city_id.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='district_id'>District</Label>
				<Controller
					name='district_id'
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							onChange={(event) => {
								field.onChange(event);
							}}
							disabled={loading.districts || !city}>
							<option value=''>Select a district</option>
							{districts.map((district) => (
								<option key={district.id} value={district.id}>
									{district.name}
								</option>
							))}
						</Select>
					)}
				/>
				<Hint>Select the district where this address is located.</Hint>
				{errors.district_id && (
					<span className='text-red-500'>{errors.district_id.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='zipcode'>Zipcode</Label>
				<Input
					type='text'
					placeholder='Enter zipcode'
					maxLength={5}
					pattern='[0-9]*'
					{...register('zipcode')}
				/>
				<Hint>5-digit postal code for this address.</Hint>
				{errors.zipcode && (
					<span className='text-red-500'>{errors.zipcode.message}</span>
				)}
			</div>

			<div className='col-span-full'>
				<Label htmlFor='note'>Note</Label>
				<Textarea
					placeholder='Add a note for this address'
					{...register('note')}
				/>
				<Hint>This note will help the driver navigate to your destination correctly.</Hint>
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

			<div className='flex items-center gap-2 col-span-full'>
				<Button>{label}</Button>
				<Button variant='outline' type='button' onClick={handleUseMyLocation}>
					Use my location
				</Button>
			</div>
		</form>
	);
};

export default AddressForm;
