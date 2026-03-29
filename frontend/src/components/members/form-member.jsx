import * as React from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Hint } from '@/components/ui/hint';
import { ROLES } from '@/libs/constant';
import { Select } from '@/components/ui/select';

const ROLE_LIST = Object.values(ROLES);

const MemberSchema = z.object({
	name: z.string().min(3),
	email: z.string().min(3),
	password: z.string().optional(),
	role: z.enum(ROLE_LIST),
	is_verified: z.coerce.boolean(),
});

const MemberForm = ({ initial, action, label }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(MemberSchema),
		defaultValues: initial || {
			name: '',
			email: '',
			password: '',
			role: ROLES.GUEST,
			is_verified: 'true',
		},
	});

	return (
		<form onSubmit={handleSubmit(action)} className='grid gap-6 lg:grid-cols-2'>
			<div className='col-span-full'>
				<Label htmlFor='name'>Name</Label>
				<Input
					type='text'
					placeholder='Enter your name'
					{...register('name')}
				/>
				<Hint>Full name of the member.</Hint>
				{errors.name && (
					<span className='text-red-500'>{errors.name.message}</span>
				)}
			</div>

			<div className='col-span-full'>
				<Label htmlFor='email'>Email</Label>
				<Input
					type='email'
					placeholder='Enter your email'
					{...register('email')}
				/>
				<Hint>Email address for the member account.</Hint>
				{errors.email && (
					<span className='text-red-500'>{errors.email.message}</span>
				)}
			</div>

			<div className='col-span-full'>
				<Label htmlFor='password'>Password</Label>
				<Input
					type='password'
					placeholder='Enter your password'
					{...register('password')}
				/>
				<Hint>
					Password for the member account (leave empty to keep current
					password).
				</Hint>
				{errors.password && (
					<span className='text-red-500'>{errors.password.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='role'>Role</Label>
				<Select {...register('role')}>
					{ROLE_LIST.map((role) => (
						<option key={role} value={role}>
							{role}
						</option>
					))}
				</Select>
				<Hint>Role assigned to the member in the system.</Hint>
				{errors.role && (
					<span className='text-red-500'>{errors.role.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='is_verified'>Verified</Label>
				<Select {...register('is_verified')}>
					<option value='true'>Yes</option>
					<option value='false'>No</option>
				</Select>
				<Hint>Indicates whether the member's account has been verified.</Hint>
				{errors.is_verified && (
					<span className='text-red-500'>{errors.is_verified.message}</span>
				)}
			</div>

			<div className='col-span-full'>
				<Button>{label}</Button>
			</div>
		</form>
	);
};

export default MemberForm;
