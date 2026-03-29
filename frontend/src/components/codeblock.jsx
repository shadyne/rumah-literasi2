import * as React from 'react';

import { cn } from '@/libs/utils';

const CodeBlock = React.forwardRef(({ className, ...props }, ref) => {
	return (
		<pre
			ref={ref}
			className={cn(
				'block p-3 w-full border border-zinc-200 rounded-xl focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-zinc-100',
				className
			)}
			{...props}></pre>
	);
});

CodeBlock.displayName = 'CodeBlock';

export { CodeBlock };
