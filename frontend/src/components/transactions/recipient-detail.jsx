import * as React from 'react';

import { cn } from '@/libs/utils';
import { parse, addDays, format } from 'date-fns';

const RecipientDetail = ({ recipient, className }) => {
	const deadline = React.useMemo(() => {
		const formatted = parse(recipient.borrowed_date, 'yyyy-MM-dd', new Date());
		const date = addDays(formatted, 14);
		return format(date, 'yyyy-MM-dd');
	}, [recipient.borrowed_date]);

	const details = [
		{
			label: 'Name',
			value: recipient.name,
		},
		{
			label: 'Phone',
			value: recipient.phone,
		},
		{
			label: 'Address',
			value: recipient.address,
		},
		{
			label: 'Borrowed Date',
			value: recipient.borrowed_date,
		},
		{
			label: 'Deadline Date',
			value: recipient.deadline_date || deadline,
		},
		{
			muted: true,
			label: 'Notes',
			value: recipient.note,
		},
	];

	return (
		<div className='border border-zinc-200 rounded-2xl'>
			<div className='p-4 text-lg font-semibold '>
				<h3>Recipient Detail</h3>
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

export default RecipientDetail;
