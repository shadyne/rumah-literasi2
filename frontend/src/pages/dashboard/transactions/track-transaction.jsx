import * as React from 'react';

import useSWR from 'swr';
import { useParams } from 'react-router';

import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from '@/components/ui/heading';

import { Error } from '@/components/error';
import { Loading } from '@/components/loading';
import DeliveryDetail from '@/components/transactions/delivery-detail';
import DeliveryHistory from '@/components/transactions/delivery-history';

const ShowTransaction = () => {
	const { uuid } = useParams();

	const {
		data,
		error,
		isLoading: loading,
	} = useSWR('/transactions/' + uuid + '/track');

	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle>Transaction Tracking</HeadingTitle>
				<HeadingDescription>
					Detail informasi pelacakan donasi untuk mendukung kegiatan literasi baca-tulis di Mraen Mimpi
				</HeadingDescription>
			</Heading>

			{data && (
				<React.Fragment>
					<DeliveryDetail delivery={data.data} />
					<DeliveryHistory histories={data.data.history} />
				</React.Fragment>
			)}

			<Error error={!loading && error} />
			<Loading loading={loading} />
		</div>
	);
};

export default ShowTransaction;
