import * as React from 'react';

import useSWR from 'swr';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router';

import axios from '@/libs/axios';

import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from '@/components/ui/heading';

import { Loading } from '@/components/loading';
import { Error } from '@/components/error';

const EditTransaction = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const {
		error,
		mutate,
		data: result,
		isLoading: loading,
	} = useSWR('/transactions/' + id);

	const onSubmit = async (data) => {
		try {
			await axios.put('/transactions/' + result.data.id, data, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});

			toast('Transaction updated', {
				description: 'Successfully updated transaction',
			});

			mutate();
			navigate('/dashboard/transactions');
		} catch (error) {
			toast.error('Failed to update transaction', {
				description: error.response.data.message || error.message,
			});
			console.error(error);
		}
	};

	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle>Edit Transaction</HeadingTitle>
				<HeadingDescription>
					Perbarui informasi donasi untuk mendukung kegiatan literasi baca-tulis di Mraen Mimpi
				</HeadingDescription>
			</Heading>

			<Error error={!loading && error} />
			<Loading loading={loading} />
		</div>
	);
};

export default EditTransaction;
