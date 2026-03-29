import * as React from 'react';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import { useNavigate } from 'react-router';

import axios from '@/libs/axios';

import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from '@/components/ui/heading';

import GiftForm from '@/components/gifts/form-gift';

const CreateGift = () => {
	const navigate = useNavigate();
	const { mutate } = useSWRConfig();

	const onSubmit = async (data) => {
		try {
			await axios.post('/gifts', data, {
				headers: { 'Content-Type': 'application/json' },
			});

			toast('Gift created', {
				description: 'Successfully created gift',
			});

			mutate('/gifts');
			navigate('/dashboard/gifts');
		} catch (error) {
			toast.error('Failed to create gift', {
				description: error.response.data.message || error.message,
			});
			console.error(error);
		}
	};

	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle>Create Gift</HeadingTitle>
				<HeadingDescription>
					Buat donasi untuk mendukung kegiatan literasi baca-tulis di Taman Mraen Mimpi
				</HeadingDescription>
			</Heading>

			<GiftForm action={onSubmit} label='Create Gift' />
		</div>
	);
};

export default CreateGift;
