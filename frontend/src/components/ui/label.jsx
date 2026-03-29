import * as React from 'react';
import { cn } from '@/libs/utils';

const Label = React.forwardRef(({ className, ...props }, ref) => {
	return (
		<label
			ref={ref}
			className={cn('block mb-2 text-sm font-medium text-zinc-900', className)}
			{...props}>
			{props.children}
		</label>
	);
});

Label.displayName = 'Label';

export { Label };
