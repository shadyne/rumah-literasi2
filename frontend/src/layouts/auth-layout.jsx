import * as React from 'react';
import { Link, Outlet } from 'react-router';

import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router';

const AuthLayout = () => {
	const { user, session, loading } = useAuth();
	const navigate = useNavigate();

	React.useEffect(() => {
		if (!loading && user) navigate('/dashboard');
	}, [user, session, loading, navigate]);

	return (
		<main className='relative grid w-full h-screen lg:grid-cols-2'>
			<Link to='/' className='absolute top-0 left-0 m-6'>
				<Logo />
			</Link>

			<div className='hidden w-full h-screen lg:block'>
				<img
					src='/backdrop.jpg'
					alt='logo'
					className='hidden object-cover size-full lg:block'
				/>
			</div>

			<div className='flex flex-col items-center justify-center p-10 lg:p-20'>
				<div className='w-full max-w-md mx-auto'>
					<Outlet />
				</div>
			</div>
		</main>
	);
};

export default AuthLayout;
