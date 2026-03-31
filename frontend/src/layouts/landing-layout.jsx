import * as React from 'react';
import { Outlet, useLocation } from 'react-router';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { MobileHeader } from '@/components/mobile-header';

const LandingLayout = () => {
	const location = useLocation();
	const isHome = location.pathname === '/';

	return (
		<React.Fragment>
			<div className='container max-w-7xl'>
				<Navbar className='py-4' />
			</div>

			{!isHome && <MobileHeader />}

			<main className='overflow-x-hidden'>
				<Outlet />
			</main>

			<div className='w-full py-20 bg-primary-50'>
				<div className='container max-w-7xl'>
					<Footer />
				</div>
			</div>

			<div className='w-full h-6 bg-primary-500' />
		</React.Fragment>
	);
};

export default LandingLayout;
