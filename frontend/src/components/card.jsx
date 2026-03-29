import * as React from 'react';
import { cn } from '@/libs/utils';

const Card = ({ content, className }) => {
	return (
		<div
			className={cn(
				'flex items-start gap-4 p-6 border border-zinc-200 rounded-xl hover:border-primary-500',
				className
			)}>
			<div className='relative flex-none text-white rounded-full bg-primary-500 size-10'>
				<content.icon className='size-5 absolute-center' />
			</div>
			<div className='space-y-1'>
				<h3 className='font-semibold'>{content.title}</h3>
				<p className='text-zinc-600'>{content.description}</p>
			</div>
		</div>
	);
};

export { Card };
