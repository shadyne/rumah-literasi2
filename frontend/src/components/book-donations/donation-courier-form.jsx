import * as React from 'react';

import { Button } from '@/components/ui/button';
import axios from '@/libs/axios';
import { cn, currency } from '@/libs/utils';
import { Empty } from '@/components/empty';
import { Error } from '@/components/error';
import { Loading } from '@/components/loading';
import { toast } from 'sonner';
import { useAsync } from '@/hooks/use-async';

const DonationCourierForm = ({ detail, action, previous, label }) => {
	const [selected, setSelected] = React.useState(false);

	const { data, error, loading } = useAsync(
		() => {
			return axios.post('/deliveries/couriers', {
				detail,
			});
		},
		[detail],
		{
			initial: [],
			onSuccess: ({ data: result }) => result.data,
			onError: (error) => {
				toast.error('Failed to fetch couriers', {
					description: error.response?.data?.message || error.message,
				});
			},
		}
	);

	return (
		<React.Fragment>
			<div className='grid grid-cols-2 gap-6 lg:grid-cols-3'>
				<Empty empty={!loading && !error && data.length === 0} />
				<Error error={!loading && error} />
				<Loading loading={loading} />

				{data.map((courier) => (
					<div
						key={courier.id}
						onClick={() => setSelected(courier)}
						className={cn('border border-zinc-200 rounded-2xl cursor-pointer', {
							'ring-offset-2 ring-primary-500 ring-2':
								courier.id === selected.id,
						})}>
						<div className='flex items-center justify-between p-4 font-semibold '>
							<h3>{courier.courier_name}</h3>
							<h4 className='text-primary-500'>
								{courier.courier_service_name}
							</h4>
						</div>
						<div className='flex flex-col p-4 border-t text-zinc-600 border-zinc-200'>
							<div className='flex text-nowrap'>
								<span>Estimasi Durasi</span>
								<div className='w-full mb-1 border-b border-dotted'></div>
								<span>{courier.duration}</span>
							</div>
							<div className='flex text-nowrap'>
								<span>Harga</span>
								<div className='w-full mb-1 border-b border-dotted'></div>
								<span className='font-medium text-black'>
									{currency(courier.price)}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className='col-span-full'>
				<div className='flex items-center gap-2'>
					<Button disabled={!selected} onClick={() => action(selected)}>
						{label}
					</Button>

					<Button variant='outline' onClick={() => previous()}>
						Back
					</Button>
				</div>
			</div>
		</React.Fragment>
	);
};

export default DonationCourierForm;
