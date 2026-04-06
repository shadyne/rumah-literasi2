import * as React from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';

import { cn } from '@/libs/utils';
import { useAuth } from '@/hooks/use-auth';

import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router';

const Navbar = ({ className, onMenuToggle }) => {
	const { user, signout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [open, setOpen] = React.useState(false);

	const handleLogout = async () => {
		try {
			await signout();
			toast('Berhasil keluar', {
				description: 'Anda telah berhasil keluar dari akun',
			});
			navigate('/auth/signin');
		} catch (error) {
			toast.error('Gagal keluar', {
				description: error.response?.data?.message || error.message,
			});
		}
	};

	React.useEffect(() => {
		if (typeof onMenuToggle === 'function') {
			onMenuToggle(open);
		}
	}, [open, onMenuToggle]);

	return (
		<nav className={cn('w-full', className)}>
			<div className='flex items-center justify-between'>
				<Link to='/'>
					<Logo />
				</Link>

				<ul className='items-center hidden gap-8 font-medium lg:flex'>
					<li>
						<Link
							to='/'
							className={cn(
								'hover:text-primary-500',
								location.pathname === '/' && 'text-primary-500'
							)}>
							Beranda
						</Link>
					</li>
					<li>
						<Link
							to='/about'
							className={cn(
								'hover:text-primary-500',
								location.pathname === '/about' && 'text-primary-500'
							)}>
							Tentang
						</Link>
					</li>
					<li>
						<Link
							to='/events'
							className={cn(
								'hover:text-primary-500',
								location.pathname === '/events' && 'text-primary-500'
							)}>
							Acara
						</Link>
					</li>
					<li>
						<Link
							to='/contact'
							className={cn(
								'hover:text-primary-500',
								location.pathname === '/contact' && 'text-primary-500'
							)}>
							Kontak
						</Link>
					</li>
				</ul>

				<div className='items-center hidden gap-2 lg:flex'>
					{user ? (
						<React.Fragment>
							<Button variant='outline' onClick={handleLogout}>
								Keluar
							</Button>
							<Link to='/dashboard'>
								<Button>Dasbor</Button>
							</Link>
						</React.Fragment>
					) : (
						<Link to='/auth/signin'>
							<Button>Masuk</Button>
						</Link>
					)}
				</div>

				<button
					className='flex items-center justify-center lg:hidden'
					onClick={() => setOpen((prev) => !prev)}
					aria-label='Buka menu'>
					{open ? <X className='size-6' /> : <Menu className='size-6' />}
				</button>
			</div>

			{open && (
				<div className='flex flex-col gap-4 pt-4 pb-2 border-t mt-4 lg:hidden'>
					<ul className='flex flex-col gap-4 font-medium'>
						<li>
							<Link
								to='/'
								className={cn(
									'hover:text-primary-500',
									location.pathname === '/' && 'text-primary-500'
								)}
								onClick={() => setOpen(false)}>
								Beranda
							</Link>
						</li>
						<li>
							<Link
								to='/about'
								className={cn(
									'hover:text-primary-500',
									location.pathname === '/about' && 'text-primary-500'
								)}
								onClick={() => setOpen(false)}>
								Tentang
							</Link>
						</li>
						<li>
							<Link
								to='/events'
								className={cn(
									'hover:text-primary-500',
									location.pathname === '/events' && 'text-primary-500'
								)}
								onClick={() => setOpen(false)}>
								Acara
							</Link>
						</li>
						<li>
							<Link
								to='/contact'
								className={cn(
									'hover:text-primary-500',
									location.pathname === '/contact' && 'text-primary-500'
								)}
								onClick={() => setOpen(false)}>
								Kontak
							</Link>
						</li>
					</ul>

					<div className='flex flex-col gap-2'>
						{user ? (
							<React.Fragment>
								<Link to='/dashboard' onClick={() => setOpen(false)}>
									<Button className='w-full'>Dasbor</Button>
								</Link>
								<Button
									variant='outline'
									onClick={handleLogout}
									className='w-full'>
									Keluar
								</Button>
							</React.Fragment>
						) : (
							<Link to='/auth/signin' onClick={() => setOpen(false)}>
								<Button className='w-full'>Masuk</Button>
							</Link>
						)}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
