import * as React from 'react';

import { Link } from 'react-router';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';

const Profile = () => {
	const { user, loading } = useAuth();

	return (
		<Link to='/dashboard/profile' className='flex items-center gap-2'>
			{loading && (
				<React.Fragment>
					<div className='rounded-full size-10 bg-zinc-100 animate-pulse' />
					<div className='flex-col flex-none hidden gap-1 lg:flex'>
						<div className='w-32 h-5 rounded-xl bg-zinc-100 animate-pulse' />
						<div className='w-40 h-5 rounded-xl bg-zinc-100 animate-pulse' />
					</div>
				</React.Fragment>
			)}

			{user && (
				<React.Fragment>
					<Avatar name={user.name} />
					<div className='flex-col flex-none hidden gap-1 text-sm leading-none lg:flex'>
						<span className='font-medium'>{user.name}</span>
						<span className='text-zinc-500'>{user.email}</span>
					</div>
				</React.Fragment>
			)}
		</Link>
	);
};

export default Profile;
