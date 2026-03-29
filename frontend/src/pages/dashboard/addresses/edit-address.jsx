import * as React from 'react';
import { toast } from 'sonner';
import useSWR, { useSWRConfig } from 'swr';
import { useParams, useNavigate } from 'react-router';

import axios from '@/libs/axios';

import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from '@/components/ui/heading';
import AddressForm from '@/components/addresses/form-address';
import { Loading } from '@/components/loading';
import { Error } from '@/components/error';
import { Badge } from '@/components/ui/badge';

const EditAddress = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { mutate } = useSWRConfig();

	const {
		error,
		data: result,
		isLoading: loading,
	} = useSWR('/addresses/' + id);

	const onSubmit = async (data) => {
		try {
			await axios.put('/addresses/' + id, data, {
				headers: { 'Content-Type': 'application/json' },
			});
			toast('Address updated', {
				description: 'Successfully updated address',
			});

			mutate('/addresses');
			mutate('/addresses/' + id);
			navigate('/dashboard/addresses/');
		} catch (error) {
			toast.error('Failed to update address', {
				description: error.response?.data?.message || error.message,
			});
			console.error(error);
		}
	};

	if (loading) return <Loading loading={loading} />;
	if (error) return <Error error={!loading && error} />;

	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle className='flex items-center justify-between'>
					<span>Edit Address</span>
					{result && result.data.is_default && <Badge>default</Badge>}
				</HeadingTitle>
				<HeadingDescription>
					Update your address information.
				</HeadingDescription>
			</Heading>

			{result && (
				<AddressForm
					initial={result.data}
					action={onSubmit}
					label='Update Address'
				/>
			)}
		</div>
	);
};

export default EditAddress;
