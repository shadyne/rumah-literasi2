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
import MemberForm from '@/components/members/form-member';
import { Loading } from '@/components/loading';
import { Error } from '@/components/error';

const EditMember = () => {
	const { uuid } = useParams();
	const navigate = useNavigate();
	const { mutate } = useSWRConfig();

	const {
		error,
		data: result,
		isLoading: loading,
	} = useSWR('/members/' + uuid);

	const onSubmit = async (data) => {
		try {
			await axios.put('/members/' + result.data.uuid, data, {
				headers: { 'Content-Type': 'application/json' },
			});

			toast('Member updated', {
				description: 'Successfully updated member',
			});

			mutate('/members');
			mutate('/members/' + uuid);
			navigate('/dashboard/members');
		} catch (error) {
			toast.error('Failed to update member', {
				description: error.response?.data?.message || error.message,
			});
			console.error(error);
		}
	};

	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle>Edit Member</HeadingTitle>
				<HeadingDescription>
					Perbarui informasi anggota untuk mendukung kegiatan literasi baca-tulis di Mraen Mimpi
				</HeadingDescription>
			</Heading>

			<Error error={!loading && error} />
			<Loading loading={loading} />

			{result && (
				<MemberForm
					initial={result.data}
					action={onSubmit}
					label='Update Member'
				/>
			)}
		</div>
	);
};

export default EditMember;
