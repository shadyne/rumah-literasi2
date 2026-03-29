import * as React from 'react';
import { Outlet } from 'react-router';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const LandingLayout = () => {
	return (
		<React.Fragment>
			<div className='container max-w-7xl'>
				<Navbar className='py-4' />
			</div>

			<main>
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
