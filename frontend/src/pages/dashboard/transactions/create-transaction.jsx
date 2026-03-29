import * as React from 'react';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import { useNavigate } from 'react-router';

import axios from '@/libs/axios';
import { STEPS, useTransactionStore } from '@/store/use-transactions';

import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from '@/components/ui/heading';

import StepBook from '@/components/transactions/steps/step-book';
import StepRecipient from '@/components/transactions/steps/step-recipient';
import StepCourier from '@/components/transactions/steps/step-courier';
import { animate } from '@/libs/utils';

const CreateTransaction = () => {
	const navigate = useNavigate();
	const { mutate } = useSWRConfig();
	const { step, validate, reset } = useTransactionStore();

	const onSubmit = async () => {
		try {
			const result = await validate();

			if (!result.success) {
				toast.error('Failed to create transaction', {
					description: result.error.message,
				});
				return;
			}

			toast('Creating transaction', {
				description: 'Creating transaction...',
			});

			await axios.post('/transactions', result.data);

			toast('Transaction created', {
				description: 'Successfully created transaction',
			});

			reset();
			mutate('/transactions');
			navigate('/dashboard/transactions');
			animate();
		} catch (error) {
			toast.error('Failed to create transaction', {
				description: error.response.data.message || error.message,
			});
			console.error(error);
		}
	};

	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle>Create Transaction</HeadingTitle>
				<HeadingDescription>
					Buat donasi untuk mendukung kegiatan literasi baca-tulis di Mraen Mimpi
				</HeadingDescription>
			</Heading>

			{step === STEPS.BOOKS && <StepBook />}
			{step === STEPS.RECIPIENT && <StepRecipient />}
			{step === STEPS.COURIER && <StepCourier onSubmit={onSubmit} />}
		</div>
	);
};

export default CreateTransaction;
