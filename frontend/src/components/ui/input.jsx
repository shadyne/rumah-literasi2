import * as React from 'react';

import { cn } from '@/libs/utils';
import { EyeOff } from 'lucide-react';
import { Eye } from 'lucide-react';
import { Search } from 'lucide-react';

const Input = React.forwardRef(({ type, className, ...props }, ref) => {
	const [show, setShow] = React.useState(false);
	const Icon = show ? EyeOff : Eye;

	return (
		<div
			className={cn('relative w-full', {
				'max-w-sm': type === 'search',
			})}>
			<input
				type={type == 'password' && show ? 'text' : type}
				ref={ref}
				className={cn(
					'block p-3 text-sm w-full rounded-xl',
					'border border-zinc-200 bg-zinc-100',
					'focus:border-primary-500 focus:ring-primary-500',
					{
						'pl-12': type === 'search',
						'pr-12': type === 'password',
					},
					className
				)}
				{...props}
			/>
			{type === 'password' && (
				<div className='absolute -translate-y-1/2 cursor-pointer top-1/2 right-4'>
					<Icon
						className='size-5 text-zinc-500 hover:text-primary-500'
						onClick={() => setShow(!show)}
					/>
				</div>
			)}
			{type === 'search' && (
				<div className='absolute -translate-y-1/2 cursor-pointer top-1/2 left-4'>
					<Search className='size-5 text-zinc-500 hover:text-primary-500' />
				</div>
			)}
		</div>
	);
});

Input.displayName = 'Input';

export { Input };
