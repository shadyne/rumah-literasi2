import * as React from 'react';

import { cn } from '@/libs/utils';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
	return (
		<textarea
			ref={ref}
			rows={4}
			className={cn(
				'block p-3 w-full border border-zinc-200 rounded-xl focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-zinc-100',
				className
			)}
			{...props}></textarea>
	);
});

Textarea.displayName = 'Textarea';

export { Textarea };
