import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/libs/utils';

const Loading = React.forwardRef(({ loading, className, ...props }, ref) => {
	if (!loading) return null;

	return (
		<div
			ref={ref}
			className={cn(
				'flex flex-col col-span-full items-center justify-center w-full gap-2 text-sm text-center text-zinc-500 h-32 rounded-xl',
				className
			)}
			{...props}>
			<div className='flex items-center gap-2'>
				<Loader2 className='text-primary-500 size-6 animate-spin' />
				<span className='font-medium'>Loading...</span>
			</div>
		</div>
	);
});

Loading.displayName = 'Loading';

export { Loading };
