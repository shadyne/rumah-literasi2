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

import GiftForm from '@/components/gifts/form-gift';
import { Loading } from '@/components/loading';
import { Error } from '@/components/error';

const EditGift = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const {
		error,
		mutate,
		data: result,
		isLoading: loading,
	} = useSWR('/gifts/' + id);

	const onSubmit = async (data) => {
		try {
			await axios.put('/gifts/' + result.data.id, data, {
				headers: { 'Content-Type': 'application/json' },
			});

			toast('Gift updated', {
				description: 'Successfully updated gift',
			});

			mutate();
			navigate('/dashboard/gifts');
		} catch (error) {
			toast.error('Failed to update gift', {
				description: error.response.data.message || error.message,
			});
			console.error(error);
		}
	};

	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle>Edit Gift</HeadingTitle>
				<HeadingDescription>
					Perbarui informasi donasi untuk mendukung kegiatan literasi baca-tulis di Taman Mraen Mimpi
				</HeadingDescription>
			</Heading>

			<Error error={!loading && error} />
			<Loading loading={loading} />

			{result && (
				<GiftForm initial={result.data} action={onSubmit} label='Update Gift' />
			)}
		</div>
	);
};

export default EditGift;
