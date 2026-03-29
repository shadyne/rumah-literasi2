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

import AddressForm from '@/components/addresses/form-address';

const CreateAddress = () => {
	const navigate = useNavigate();
	const { mutate } = useSWRConfig();

	const onSubmit = async (data) => {
		try {
			await axios.post('/addresses', data, {
				headers: { 'Content-Type': 'application/json' },
			});
			toast('Address created', {
				description: 'Successfully created address',
			});

			mutate('/addresses');
			navigate('/dashboard/addresses');
		} catch (error) {
			toast.error('Failed to create address', {
				description: error.response?.data?.message || error.message,
			});
			console.error(error);
		}
	};

	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle>Create Address</HeadingTitle>
				<HeadingDescription>
					Add a new address to your profile with a name (like Home, Office,
					etc.) for book donations and other activities.
				</HeadingDescription>
			</Heading>

			<AddressForm action={onSubmit} label='Create Address' />
		</div>
	);
};

export default CreateAddress;
