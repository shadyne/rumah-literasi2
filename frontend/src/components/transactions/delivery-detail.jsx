import * as React from 'react';

import { cn } from '@/libs/utils';

const DeliveryDetail = ({ delivery, className }) => {
	const details = [
		{
			label: 'Company code',
			value: delivery.courier.company,
		},
		{
			label: 'Delivery ID',
			value: delivery.waybill_id,
		},
		{
			label: 'Recipient',
			value: delivery.destination.contact_name,
		},
		{
			label: 'Recipient Address',
			value: delivery.destination.address,
		},
		{
			label: 'Origin',
			value: delivery.origin.contact_name,
		},
		{
			label: 'Origin Address',
			value: delivery.origin.address,
		},
		{
			label: 'Status',
			value: delivery.status,
		},
	];

	return (
		<div className='border border-zinc-200 rounded-2xl'>
			<div className='p-4 text-lg font-semibold '>
				<h3>Delivery Detail</h3>
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

export default DeliveryDetail;
