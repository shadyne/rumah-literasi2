import * as React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { MobileHeader } from '@/components/mobile-back';

const LandingLayout = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const isHome = location.pathname === '/';
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	return (
		<React.Fragment>
			<div className='container max-w-7xl relative'>
				<div className='flex items-center justify-between py-4'>
					{!isHome && !isMenuOpen && (
						<button
							onClick={() => navigate(-1)}
							className='lg:hidden p-1 rounded hover:bg-gray-100'>
							<ArrowLeft className='w-5 h-5' />
						</button>
					)}

					<Navbar className='flex-1' onMenuToggle={setIsMenuOpen} />
				</div>
			</div>

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
