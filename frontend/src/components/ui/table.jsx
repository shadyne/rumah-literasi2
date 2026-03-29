import * as React from 'react';

import { cn } from '@/libs/utils';

const Table = React.forwardRef(({ className, ...props }, ref) => (
	<div className='relative w-full overflow-auto'>
		<table
			className={cn('w-full caption-bottom text-sm', className)}
			ref={ref}
			{...props}
		/>
	</div>
));

Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
	<thead
		className={cn('[&_tr]:border-b bg-zinc-100', className)}
		ref={ref}
		{...props}
	/>
));

TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
	<tbody
		className={cn('[&_tr:last-child]:border-0', className)}
		ref={ref}
		{...props}
	/>
));

TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
	<tfoot
		className={cn(
			'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
			className
		)}
		ref={ref}
		{...props}
	/>
));

TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
	<tr
		ref={ref}
		className={cn(
			'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
			className
		)}
		{...props}
	/>
));

TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
	<th
		ref={ref}
		className={cn(
			'h-14 px-6 whitespace-nowrap text-left align-middle font-semibold text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
			className
		)}
		{...props}
	/>
));

TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
	<td
		className={cn(
			'truncate px-6 py-4 max-w-80 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
			className
		)}
		ref={ref}
		{...props}
	/>
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
	<caption
		className={cn('mt-4 text-sm text-muted-foreground', className)}
		ref={ref}
		{...props}
	/>
));

TableCaption.displayName = 'TableCaption';

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
};
