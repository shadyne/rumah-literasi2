import * as React from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';

import { cn } from '@/libs/utils';
import { useAuth } from '@/hooks/use-auth';

import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';

const Navbar = ({ className }) => {
	const { user, signout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await signout();
			toast('Logout successful', {
				description: 'You are now logged out',
			});
			navigate('/auth/signin');
		} catch (error) {
			toast.error('Failed to logout', {
				description: error.response?.data?.message || error.message,
			});
		}
	};

	return (
		<nav className={cn('w-full', className)}>
			<div className='flex items-center justify-between'>
				<Link to='/'>
					<Logo />
				</Link>

				<ul className='items-center hidden gap-8 font-medium lg:flex'>
					<li>
						<Link to='/' className='hover:text-primary-500'>
							Home
						</Link>
					</li>
					<li>
						<Link to='/about' className='hover:text-primary-500'>
							About
						</Link>
					</li>
					<li>
						<Link to='/events' className='hover:text-primary-500'>
							Events
						</Link>
					</li>
					<li>
						<Link to='/contact' className='hover:text-primary-500'>
							Contact
						</Link>
					</li>
				</ul>

				<div className='flex items-center gap-2'>
					{user ? (
						<React.Fragment>
							<Button variant='outline' onClick={handleLogout}>
								Logout
							</Button>
							<Link to='/dashboard'>
								<Button>Dashboard</Button>
							</Link>
						</React.Fragment>
					) : (
						<Link to='/auth/signin'>
							<Button>Login</Button>
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
