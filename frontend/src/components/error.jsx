import * as React from 'react';
import { TriangleAlert } from 'lucide-react';
import { cn } from '@/libs/utils';

const Error = React.forwardRef(({ error, className, ...props }, ref) => {
	if (!error) return null;

	return (
		<div
			ref={ref}
			className={cn(
				'flex flex-col col-span-full items-center justify-center w-full gap-2 text-sm text-center text-zinc-500 h-32 rounded-xl',
				className
			)}
			{...props}>
			<div className='flex items-center gap-2'>
				<TriangleAlert className='text-red-500 size-6 animate-pulse' />
				<span className='font-medium'>Error to load data</span>
			</div>
			{error.message && <p>{error.message}</p>}
		</div>
	);
});

Error.displayName = 'Error';

export { Error };
