import { Card } from '@/components/card';
import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from '@/components/ui/heading';
import { HeartHandshake, Gift } from 'lucide-react';
import { Link } from 'react-router';

const Dashboard = () => {
	const menus = [
		{
			href: '/dashboard/financial-donations',
			title: 'Financial Donations',
			icon: HeartHandshake,
			description:
				'Track and manage financial donation, processed via our payment gateway.',
		},
		{
			href: '/dashboard/book-donations',
			title: 'Book Donations',
			icon: Gift,
			description:
				'Oversee book donations, verify records, and manage distributions.',
		},
	];

	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle>Dashboard</HeadingTitle>
				<HeadingDescription>
					Welcome to the dashboard! Here you can manage your donations and track their impact on our literacy programs at Taman Mraen Mimpi.
				</HeadingDescription>
			</Heading>

			<div className='grid gap-6 lg:grid-cols-2'>
				{menus.map((menu) => {
					return (
						<Link key={menu.href} to={menu.href}>
							<Card
								content={{
									icon: menu.icon,
									title: menu.title,
									description: menu.description,
								}}
							/>
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default Dashboard;
