import * as React from 'react';

import { cn } from '@/libs/utils';

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
	return (
		<select
			className={cn(
				'block w-full p-3 border bg-zinc-100 border-zinc-200 rounded-xl focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
				className
			)}
			ref={ref}
			{...props}>
			{children}
		</select>
	);
});
Select.displayName = 'Select';

export { Select };
