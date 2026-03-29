import * as React from 'react';

import { cn } from '@/libs/utils';

const CourierDetail = ({ courier, className }) => {
	const details = [
		{
			label: 'Company code',
			value: courier.courier_company.toUpperCase(),
		},
		{
			label: 'Type code',
			value: courier.courier_type.toUpperCase(),
		},
		{
			label: 'Delivery Fee',
			value: courier.delivery_fee,
		},
		{
			label: 'Delivery Estimated Time',
			value: courier.delivery_eta,
		},
	];

	return (
		<div className='border border-zinc-200 rounded-2xl'>
			<div className='p-4 text-lg font-semibold '>
				<h3>Courier Detail</h3>
			</div>

			<div
				className={cn(
					'grid gap-2 p-4 border-t text-zinc-600 border-zinc-200',
					className
				)}>
				{details.map((detail) => (
					<dl key={detail.label} className='text-sm font-medium'>
						<dt className='text-black'>{detail.label}</dt>
						<dd
							className={cn('text-primary-500', {
								'text-zinc-500': detail.muted,
							})}>
							{detail.value}
						</dd>
					</dl>
				))}
			</div>
		</div>
	);
};

export default CourierDetail;
