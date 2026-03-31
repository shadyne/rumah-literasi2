import * as React from 'react';
import { cn } from '@/libs/utils';

const Logo = React.forwardRef(({ className, ...props }, ref) => {
	return (
		<div ref={ref} className={cn('flex items-center', className)} {...props}>
			<img
				src='https://api.mraenmimpi.com/uploads/logo.png'
				width={40}
				height={42}
				alt=''
			/>
			<span className='flex-none text-lg font-bold'>Mraen Mimpi</span>
		</div>
	);
});

Logo.displayName = 'Logo';

export { Logo };
