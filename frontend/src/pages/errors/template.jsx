import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

const ErrorTemplate = ({ title, description }) => {
	return (
		<div className='container relative h-screen max-w-7xl'>
			<Link to='/' className='absolute top-0 left-0 m-6'>
				<Logo />
			</Link>
			<div className='flex flex-col items-center justify-center h-full gap-4 text-center '>
				<h1 className='font-bold text-7xl text-primary-500'>{title}</h1>
				<p className='w-full max-w-2xl mx-auto'>{description}</p>
				<Link to='/'>
					<Button>Back to Home Page</Button>
				</Link>
			</div>
		</div>
	);
};

export default ErrorTemplate;
