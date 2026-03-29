import useSWR from 'swr';
import { Link } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { detailSchema } from '@/libs/schemas';
import { Select } from '@/components/ui/select';
import { useResultState } from '@/hooks/use-result-state';
import { Hint } from '@/components/ui/hint';

const DonationDetailForm = ({ initial, action, previous, label }) => {
	const { error, data, isLoading: loading } = useSWR('/addresses');
	const { result } = useResultState(error, loading, data);

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(detailSchema),
		defaultValues: initial || {
			address_id: '',
			package_size: 'small',
			estimated_value: 0,
			weight: 0,
			height: 0,
			width: 0,
			depth: 0,
		},
	});

	return (
		<form onSubmit={handleSubmit(action)} className='grid gap-6 lg:grid-cols-2'>
			<div className='col-span-full'>
				<Label htmlFor='address_id'>Address</Label>
				<Controller
					name='address_id'
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							value={field.value}
							onChange={(event) => field.onChange(event.target.value)}
							disabled={loading.addresses}>
							<option value=''>Select an address</option>
							{result.map((address) => (
								<option key={address.id} value={address.id}>
									{address.name}
								</option>
							))}
						</Select>
					)}
				/>
				<Hint>
					The address where the book donation will be delivered, if you don't
					have an address, you can create one in{' '}
					<Link className='text-primary-500' to='/dashboard/addresses'>
						addresses page
					</Link>
					.
				</Hint>
				{errors.address_id && (
					<span className='text-red-500'>{errors.address_id.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='package_size'>Package Size</Label>
				<Select {...register('package_size')}>
					<option value='small'>Small (1-2 kg)</option>
					<option value='medium'>Medium (2-4 kg)</option>
					<option value='large'>Large (4-8 kg)</option>
				</Select>
				<Hint>The size of the book donation package.</Hint>
				{errors.package_size && (
					<span className='text-red-500'>{errors.package_size.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='estimated_value'>Estimated Value</Label>
				<Input
					type='number'
					placeholder='Enter your estimated value'
					{...register('estimated_value')}
				/>
				<Hint>Estimated value of the book donation in rupiah.</Hint>
				{errors.estimated_value && (
					<span className='text-red-500'>{errors.estimated_value.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='weight'>Weight</Label>
				<Input
					type='number'
					placeholder='Enter your weight'
					{...register('weight')}
				/>
				<Hint>Total weight of the book donation in kilograms.</Hint>
				{errors.weight && (
					<span className='text-red-500'>{errors.weight.message}</span>
				)}
			</div>

			<div className='grid grid-cols-3 gap-6 col-span-full'>
				<div>
					<Label htmlFor='depth'>Length</Label>
					<Input
						type='number'
						placeholder='Enter the package length'
						{...register('length')}
					/>
					<Hint>Length of the book donation in centimeters.</Hint>
					{errors.length && (
						<span className='text-red-500'>{errors['length'].message}</span>
					)}
				</div>

				<div>
					<Label htmlFor='width'>Width</Label>
					<Input
						type='number'
						placeholder='Enter the package width'
						{...register('width')}
					/>
					<Hint>Width of the book donation in centimeters.</Hint>
					{errors.width && (
						<span className='text-red-500'>{errors.width.message}</span>
					)}
				</div>

				<div>
					<Label htmlFor='height'>Height</Label>
					<Input
						type='number'
						placeholder='Enter the package height'
						{...register('height')}
					/>
					<Hint>Height of the book donation in centimeters.</Hint>
					{errors.height && (
						<span className='text-red-500'>{errors.height.message}</span>
					)}
				</div>
			</div>

			<div className='col-span-full'>
				<div className='flex items-center gap-2'>
					<Button>{label}</Button>
					<Button type='button' variant='outline' onClick={() => previous()}>
						Back
					</Button>
				</div>
			</div>
		</form>
	);
};

export default DonationDetailForm;
