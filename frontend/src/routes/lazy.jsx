import * as React from 'react';

const Fallback = () => {
	return (
		<div className='flex flex-col gap-4'>
			<div className='w-full h-10 max-w-56 rounded-xl bg-zinc-100 animate-pulse'></div>

			<div className='flex flex-col gap-2'>
				<div className='w-full h-4 rounded-xl bg-zinc-100 animate-pulse'></div>
				<div className='w-full h-4 max-w-lg rounded-xl bg-zinc-100 animate-pulse'></div>
			</div>
		</div>
	);
};

const LazyRoute = ({ component, ...props }) => {
	const Component = component;

	return (
		<React.Suspense fallback={<Fallback />}>
			<Component {...props} />
		</React.Suspense>
	);
};

export default LazyRoute;
