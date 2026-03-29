import * as React from 'react';

import { cn } from '@/libs/utils';

const Checkbox = React.forwardRef(({ className, ...props }, ref) => {
	return (
		<input
			type='checkbox'
			className={cn(
				'w-4 h-4 border-zinc-200 rounded text-primary-600 focus:ring-primary-500',
				className
			)}
			ref={ref}
			{...props}
		/>
	);
});

Checkbox.displayName = 'Checkbox';

const CheckboxLabel = React.forwardRef(
	({ className, children, ...props }, ref) => {
		return (
			<label
				ref={ref}
				className={cn('block text-sm font-medium text-zinc-900', className)}
				{...props}>
				{children}
			</label>
		);
	}
);

CheckboxLabel.displayName = 'CheckboxLabel';

const CheckboxGroup = React.forwardRef(
	({ className, children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn('flex items-center gap-2', className)}
				{...props}>
				{children}
			</div>
		);
	}
);

CheckboxGroup.displayName = 'CheckboxGroup';

export { Checkbox, CheckboxLabel, CheckboxGroup };
