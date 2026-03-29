import * as React from 'react';

import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from '@/components/ui/heading';

import { useAuth } from '@/hooks/use-auth';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ProfileDetail = () => {
	const { user, loading } = useAuth();

	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle>Member Profile</HeadingTitle>
				<HeadingDescription>
					Detail informasi anggota di Mraen Mimpi
				</HeadingDescription>
			</Heading>

			{loading && (
				<div className='w-full h-96 rounded-xl bg-zinc-100'>
					<span>Loading...</span>
				</div>
			)}

			{user && (
				<div className='grid gap-6 lg:grid-cols-2'>
					<div className='col-span-full'>
						<Label htmlFor='name'>Name</Label>
						<Input type='text' value={user.name} disabled />
					</div>

					<div className='col-span-full'>
						<Label htmlFor='email'>Email</Label>
						<Input type='email' value={user.email} disabled />
					</div>

					<div>
						<Label htmlFor='password'>Role</Label>
						<Input type='text' value={user.role} disabled />
					</div>

					<div>
						<Label htmlFor='is_verified'>Verified</Label>
						<Input
							type='text'
							value={user.is_verified ? 'Yes' : 'No'}
							disabled
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProfileDetail;
