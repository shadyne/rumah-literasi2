import * as React from 'react';
import { cn } from '@/libs/utils';

const Supertitle = React.forwardRef(
	({ className, children, ...props }, ref) => {
		return (
			<h1 className={cn('text-6xl font-bold', className)} ref={ref} {...props}>
				{children}
			</h1>
		);
	}
);

Supertitle.displayName = 'Supertitle';

const HeadingTitle = React.forwardRef(
	({ className, children, ...props }, ref) => {
		return (
			<h1 className={cn('text-4xl font-bold', className)} ref={ref} {...props}>
				{children}
			</h1>
		);
	}
);

HeadingTitle.displayName = 'HeadingTitle';

const HeadingSubtitle = React.forwardRef(
	({ className, children, ...props }, ref) => {
		return (
			<h2 className={cn('text-2xl font-bold', className)} ref={ref} {...props}>
				{children}
			</h2>
		);
	}
);

HeadingSubtitle.displayName = 'HeadingSubtitle';

const HeadingDescription = React.forwardRef(
	({ className, children, ...props }, ref) => {
		return (
			<p className={cn('text-zinc-600', className)} ref={ref} {...props}>
				{children}
			</p>
		);
	}
);

HeadingDescription.displayName = 'HeadingDescription';

const Heading = React.forwardRef(({ className, children, ...props }, ref) => {
	return (
		<div className={cn('flex flex-col gap-2', className)} ref={ref} {...props}>
			{children}
		</div>
	);
});

Heading.displayName = 'Heading';

export {
	Supertitle,
	HeadingTitle,
	HeadingSubtitle,
	HeadingDescription,
	Heading,
};
