import * as React from 'react';

import { cn } from '@/libs/utils';

const Hint = React.forwardRef(({ className, children, ...props }, ref) => {
	return (
		<p
			className={cn('mt-1 text-sm text-zinc-500', className)}
			ref={ref}
			{...props}>
			{children}
		</p>
	);
});

Hint.displayName = 'Hint';

export { Hint };
