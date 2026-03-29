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

import EventForm from '@/components/events/form-event';

const CreateEvent = () => {
	const navigate = useNavigate();
	const { mutate } = useSWRConfig();

	const onSubmit = async (data) => {
		try {
			await axios.post('/events', data, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			toast('Event created', {
				description: 'Successfully created event',
			});

			mutate('/events');
			navigate('/dashboard/events');
		} catch (error) {
			toast.error('Failed to create event', {
				description: error.response?.data?.message || error.message,
			});
			console.error(error);
		}
	};

	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle>Create Event</HeadingTitle>
				<HeadingDescription>
					Buat acara untuk mendukung kegiatan literasi baca-tulis di Taman Mraen Mimpi
				</HeadingDescription>
			</Heading>

			<EventForm action={onSubmit} label='Create Event' />
		</div>
	);
};

export default CreateEvent;
