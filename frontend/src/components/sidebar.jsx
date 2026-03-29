import * as React from 'react';
import { toast } from 'sonner';
import { User2, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';

import { cn } from '@/libs/utils';
import { useAuth } from '@/hooks/use-auth';
import { SIDEBAR_MENUS } from '@/libs/constant';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

import SidebarCard from '@/components/sidebar-card';
import { useConfirm } from '@/hooks/use-confirm';

const Sidebar = ({ className }) => {
	const { confirm } = useConfirm();
	const { user, loading, signout } = useAuth();

	const navigate = useNavigate();
	const location = useLocation();

	const MENUS = React.useMemo(() => {
		if (loading || !user) return [];
		return SIDEBAR_MENUS.map((menu) => {
			return {
				...menu,
				submenus: menu.submenus.filter((submenu) => {
					if (submenu.roles === null) return true;
					else return submenu.roles.includes(user.role);
				}),
			};
		});
	}, [loading, user]);

	const handleLogout = async () => {
		confirm({
			title: 'Confirm Action',
			variant: 'destructive',
			description: 'Are you sure you want to logout?',
		})
			.then(async () => {
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
			})
			.catch(() => {
				// pass
			});
	};

	return (
		<aside className={cn('bg-zinc-100', className)}>
			<div className='flex flex-col justify-between h-full p-6 pt-10'>
				<div className='flex flex-col gap-6'>
					{MENUS.map((menu) => (
						<Accordion type='multiple' defaultValue={[menu.id]} key={menu.id}>
							<AccordionItem value={menu.id}>
								<AccordionTrigger>{menu.label}</AccordionTrigger>
								<AccordionContent className='ml-2'>
									<ul className='flex flex-col gap-6 text-sm'>
										{menu.submenus.map((menu) => {
											const Icon = menu.icon;
											const active = location.pathname === menu.href;

											return (
												<li key={menu.href}>
													<Link
														to={menu.href}
														className={cn(
															'flex items-center gap-4 font-medium rounded-xl hover:text-primary-500',
															{ 'text-primary-500': active }
														)}>
														<Icon className='size-5' />
														<span>{menu.label}</span>
													</Link>
												</li>
											);
										})}
									</ul>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					))}

					<Accordion type='multiple' defaultValue={['account']} key='account'>
						<AccordionItem value='account'>
							<AccordionTrigger>Account</AccordionTrigger>
							<AccordionContent className='ml-2'>
								<ul className='flex flex-col gap-6 text-sm'>
									<Link
										to='/dashboard/profile'
										className='flex items-center gap-4 font-medium rounded-xl hover:text-primary-500'>
										<User2 className='size-5' />
										<span>Profile</span>
									</Link>

									<button
										onClick={handleLogout}
										className='flex items-center gap-4 font-medium rounded-xl hover:text-red-500'>
										<LogOut className='size-5' />
										<span>Logout</span>
									</button>
								</ul>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>

				<SidebarCard />
			</div>
		</aside>
	);
};

export default Sidebar;
