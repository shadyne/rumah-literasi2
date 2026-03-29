import * as React from 'react';
import { cn } from '@/libs/utils';
import { CircleAlert } from 'lucide-react';

const Empty = React.forwardRef(({ empty, className, ...props }, ref) => {
	if (!empty) return null;

	return (
		<div
			ref={ref}
			className={cn(
				'flex flex-col col-span-full items-center justify-center w-full gap-2 text-sm text-center text-zinc-500 h-32 rounded-xl',
				className
			)}
			{...props}>
			<div className='flex items-center gap-2'>
				<CircleAlert className='text-amber-500 size-6 animate-pulse' />
				<span className='font-medium'>No records found</span>
			</div>
		</div>
	);
});

Empty.displayName = 'Empty';

export { Empty };
