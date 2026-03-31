import * as React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

const ROUTE_TITLES = {
	'/dashboard': 'Dashboard',
	'/dashboard/members': 'Members',
	'/dashboard/members/create': 'Create Member',
	'/dashboard/events': 'Events',
	'/dashboard/events/create': 'Create Event',
	'/dashboard/book-donations': 'Book Donations',
	'/dashboard/book-donations/create': 'Create Donation',
	'/dashboard/book-donations/create/append': 'Add Item',
	'/dashboard/book-donations/create/detail': 'Donation Detail',
	'/dashboard/book-donations/create/courier': 'Choose Courier',
	'/dashboard/book-donations/create/review': 'Review Donation',
	'/dashboard/financial-donations': 'Financial Donations',
	'/dashboard/financial-donations/create': 'Create Donation',
	'/dashboard/addresses': 'Addresses',
	'/dashboard/addresses/create': 'Create Address',
	'/dashboard/merchant': 'Merchant',
	'/dashboard/merchant/edit': 'Edit Merchant',
	'/dashboard/logs': 'Logs',
	'/dashboard/profile': 'Profile',
	'/dashboard/gifts': 'Gifts',
	'/dashboard/gifts/create': 'Create Gift',
	'/about': 'About Us',
	'/contact': 'Contact',
	'/events': 'Events',
	'/auth/signin': 'Sign In',
	'/auth/signup': 'Register',
	'/auth/otp': 'Verification',
	'/auth/forgot-password': 'Forgot Password',
	'/auth/reset-password': 'Reset Password',
};

const DYNAMIC_PATTERNS = [
	{ pattern: /^\/dashboard\/members\/[^/]+\/edit$/, title: 'Edit Member' },
	{ pattern: /^\/dashboard\/events\/[^/]+\/edit$/, title: 'Edit Event' },
	{ pattern: /^\/dashboard\/events\/[^/]+$/, title: 'Event Detail' },
	{
		pattern: /^\/dashboard\/book-donations\/[^/]+\/edit$/,
		title: 'Edit Donation',
	},
	{
		pattern: /^\/dashboard\/book-donations\/create\/[^/]+\/edit$/,
		title: 'Edit Item',
	},
	{ pattern: /^\/dashboard\/book-donations\/[^/]+$/, title: 'Donation Detail' },
	{
		pattern: /^\/dashboard\/financial-donations\/[^/]+\/edit$/,
		title: 'Edit Donation',
	},
	{
		pattern: /^\/dashboard\/financial-donations\/[^/]+$/,
		title: 'Donation Detail',
	},
	{ pattern: /^\/dashboard\/addresses\/[^/]+\/edit$/, title: 'Edit Address' },
	{ pattern: /^\/dashboard\/addresses\/[^/]+$/, title: 'Address Detail' },
	{ pattern: /^\/dashboard\/logs\/[^/]+$/, title: 'Log Detail' },
	{ pattern: /^\/dashboard\/gifts\/[^/]+\/edit$/, title: 'Edit Gift' },
	{ pattern: /^\/dashboard\/gifts\/[^/]+$/, title: 'Gift Detail' },
	{ pattern: /^\/events\/[^/]+$/, title: 'Event Detail' },
];

const getTitle = (pathname) => {
	if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
	for (const { pattern, title } of DYNAMIC_PATTERNS) {
		if (pattern.test(pathname)) return title;
	}
	return null;
};

const HIDE_BACK = [
	'/dashboard',
	'/dashboard/book-donations',
	'/dashboard/financial-donations',
	'/dashboard/addresses',
	'/dashboard/members',
	'/dashboard/events',
	'/dashboard/logs',
	'/dashboard/gifts',
	'/dashboard/merchant',
	'/dashboard/profile',
	'/events',
	'/about',
	'/contact',
];

const MobileHeader = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const pathname = location.pathname;
	const title = getTitle(pathname);

	if (!title) return null;

	const showBack = !HIDE_BACK.includes(pathname);

	return (
		<div className='sticky top-16 z-40 flex items-center justify-center px-4 py-3 bg-white border-b sm:hidden'>
			{showBack && (
				<button
					onClick={() => navigate(-1)}
					className='absolute left-4 flex items-center justify-center size-8 rounded-full hover:bg-zinc-100 transition-colors'>
					<ArrowLeft className='size-5' />
				</button>
			)}
			<span className='font-semibold text-sm'>{title}</span>
		</div>
	);
};

export { MobileHeader };
