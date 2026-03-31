import * as React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router';
import { ArrowLeft } from 'lucide-react';

import { Logo } from '@/components/ui/logo';
import Sidebar from '@/components/sidebar';
import Profile from '@/components/profile';
import { MobileHeader } from '@/components/mobile-back';
import { useAuth } from '@/hooks/use-auth';

const DashboardLayout = () => {
	const { user, loading } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const isHome = location.pathname === '/dashboard';
	const [isMenuOpen] = React.useState(false);

	React.useEffect(() => {
		if (!loading && !user) navigate('/auth/signin');
	}, [user, loading, navigate]);

	return (
		<div className='relative flex'>
			<div className='absolute z-50 w-full bg-white border-b'>
				<div className='flex h-16 items-center'>
					<div className='items-center justify-center flex-none hidden border-r lg:flex w-72'>
						<Link to='/'>
							<Logo />
						</Link>
					</div>

					<div className='flex items-center justify-between w-full gap-2 px-10'>
						<div className='flex items-center gap-2'>
							{!isHome && !isMenuOpen && (
								<button
									onClick={() => navigate(-1)}
									className='lg:hidden p-1 rounded hover:bg-gray-100'>
									<ArrowLeft className='w-5 h-5' />
								</button>
							)}

							<span className='font-medium capitalize'>
								{user && user.role} Dashboard
							</span>
						</div>

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
