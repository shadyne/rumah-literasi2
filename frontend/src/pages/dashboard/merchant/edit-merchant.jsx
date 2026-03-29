import * as React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

import axios from '@/libs/axios';

import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from '@/components/ui/heading';
import { Loading } from '@/components/loading';
import { Error } from '@/components/error';
import MerchantForm from '@/components/merchant/form-merchant';

const EditMerchant = () => {
	const { mutate } = useSWRConfig();
	const navigate = useNavigate();

	const { error, data: result, isLoading: fetching } = useSWR('/merchant');

	const onSubmit = async (data) => {
		try {
			await axios.put('/merchant', data);
			toast('Merchant updated', {
				description: 'Successfully updated merchant details',
			});

			mutate('/merchant');
			navigate('/dashboard/merchant');
		} catch (error) {
			toast.error('Failed to update merchant', {
				description: error.response?.data?.message || error.message,
			});
			console.error(error);
		}
	};

	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle>Edit Merchant</HeadingTitle>
				<HeadingDescription>
					Update merchant information and details
				</HeadingDescription>
			</Heading>

			<Loading loading={fetching} />
			<Error error={!fetching && error} />

			{result && (
				<MerchantForm
					initial={result.data}
					action={onSubmit}
					label='Update Merchant'
				/>
			)}
		</div>
	);
};

export default EditMerchant;
