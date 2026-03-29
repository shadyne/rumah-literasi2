import { cn } from '@/libs/utils';
import * as React from 'react';

const Badge = React.forwardRef(
	({ variant = 'primary', children, className, ...props }, ref) => {
		const variants = {
			'border-transparent bg-primary-500 text-white': variant === 'primary',
			'border-zinc-200 text-primary-500': variant === 'outline',
			'border-transparent bg-red-500 text-white': variant === 'destructive',
			'border-transparent bg-amber-500 text-white': variant === 'warning',
			'border-transparent bg-green-500 text-white': variant === 'success',
			'border-transparent bg-blue-500 text-white': variant === 'info',
		};

		return (
			<span
				ref={ref}
				className={cn(
					'border cursor-pointer flex-none whitespace-nowrap items-center rounded-full px-3 py-1 text-xs font-medium capitalize',
					variants,
					className
				)}
				{...props}>
				{children}
			</span>
		);
	}
);

Badge.displayName = 'Badge';

export { Badge };
