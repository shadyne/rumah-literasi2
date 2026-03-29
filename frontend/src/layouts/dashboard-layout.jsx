import * as React from 'react';
import { Link, Outlet } from 'react-router';

import { Logo } from '@/components/ui/logo';
import Sidebar from '@/components/sidebar';
import Profile from '@/components/profile';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/use-auth';

const DashboardLayout = () => {
	const { user, loading } = useAuth();
	const navigate = useNavigate();

	React.useEffect(() => {
		if (!loading && !user) navigate('/auth/signin');
	}, [user, loading, navigate]);

	return (
		<div className='relative flex'>
			<div className='absolute z-50 w-full bg-white border-b'>
				<div className='flex h-16'>
					<div className='items-center justify-center flex-none hidden border-r lg:flex w-72'>
						<Link to='/'>
							<Logo />
						</Link>
					</div>

					<div className='flex items-center justify-between w-full gap-2 px-10'>
						<span className='font-medium capitalize'>
							{user && user.role} Dashboard
						</span>
						<Profile />
					</div>
				</div>
			</div>

			<Sidebar className='flex-none hidden h-screen pt-16 overflow-y-auto border-r lg:block w-72' />

			<div className='w-full h-screen pt-16 overflow-y-auto'>
				<div className='container max-w-6xl p-10'>
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default DashboardLayout;
