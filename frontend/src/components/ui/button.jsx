import * as React from 'react';

import { cn } from '@/libs/utils';

const Button = React.forwardRef(
	({ variant = 'primary', className, children, ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={cn(
					'px-5 py-2.5 text-sm font-medium',
					'flex items-center justify-center',
					'rounded-xl border transition-colors duration-200 ease-in-out',
					'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50',
					{
						'bg-primary-500 text-white hover:bg-primary-600 focus:bg-primary-600 border-transparent focus:ring-primary-500':
							variant === 'primary',
						'bg-transparent text-primary-500 hover:bg-primary-500 hover:text-white focus:bg-primary-500 focus:text-white border-zinc-200 focus:ring-primary-500':
							variant === 'outline',
						'bg-red-500 text-white hover:bg-red-600 focus:bg-red-600 border-transparent focus:ring-red-500':
							variant === 'destructive',
						'bg-white text-zinc-800 hover:bg-zinc-50 focus:bg-zinc-100 border-zinc-200 focus:ring-transparent':
							variant === 'secondary',
					},
					className
				)}
				{...props}>
				{children}
			</button>
		);
	}
);

Button.displayName = 'Button';

export { Button };
