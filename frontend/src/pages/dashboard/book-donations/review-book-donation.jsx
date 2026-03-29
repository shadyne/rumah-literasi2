import * as React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

import axios from '@/libs/axios';
import { animate, currency } from '@/libs/utils';
import { bookDonationSchema } from '@/libs/schemas';
import { useDonation } from '@/stores/use-donation';
import { useConfirm } from '@/hooks/use-confirm';

import {
	Heading,
	HeadingDescription,
	HeadingSubtitle,
	HeadingTitle,
} from '@/components/ui/heading';
import { DonationItem } from '@/components/book-donations/donation-item-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Map } from '@/components/map';
import { Loading } from '@/components/loading';
import { Error } from '@/components/error';

const ReviewBookDonation = () => {
	const navigate = useNavigate();
	const { confirm } = useConfirm();
	const { mutate } = useSWRConfig();
	const [loading, setLoading] = React.useState(false);
	const { items, detail, courier, reset } = useDonation();

	const {
		data: selected,
		error: selectedError,
		isLoading: selectedLoading,
	} = useSWR('/addresses/' + detail.address_id);

	const onSubmit = async () => {
		try {
			bookDonationSchema.parse({
				items,
				detail,
				courier,
			});
		} catch (error) {
			toast.error('Validation Error', {
				description: 'Some information is invalid. Please check all fields.',
			});
			console.error(error);
			return;
		}

		confirm({
			title: 'Confirm Book Donation',
			description:
				'Are you sure you want to submit this book donation? This action cannot be undone.',
		})
			.then(async () => {
				setLoading(true);
				try {
					const { data: result } = await axios.post('/book-donations', {
						transaction: {
							items,
							detail,
							courier,
						},
					});
					toast.success('Book donation submitted successfully', {
						description: 'Your book donation has been successfully submitted',
					});

					reset();
					window.open(result.data.payment_url, '_blank');
					animate();
					mutate('/book-donations');
					navigate('/dashboard/book-donations');
				} catch (error) {
					toast.error('Failed to submit book donation', {
						description: error.response?.data?.message || error.message,
					});
					console.error(error);
				} finally {
					setLoading(false);
				}
			})
			.catch(() => {
				// pass
			});
	};

	const onPrevious = () => {
		navigate('/dashboard/book-donations/create/courier');
	};

	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle>Review Your Book Donation</HeadingTitle>
				<HeadingDescription>
					Please review all the information below before submitting your book
					donation.
				</HeadingDescription>
			</Heading>

			<HeadingSubtitle>Donation Items</HeadingSubtitle>

			<div className='grid items-start grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
				{items.map((item) => (
					<div key={item.id} className='relative group'>
						<DonationItem item={item} />
					</div>
				))}
			</div>

			<HeadingSubtitle>Donation Details</HeadingSubtitle>

			<Error error={!selectedLoading && selectedError} />
			<Loading loading={selectedLoading} />

			{!selectedLoading && !selectedError && (
				<div className='grid gap-6 lg:grid-cols-2'>
					<div>
						<Label htmlFor='address'>Delivery Address</Label>
						<Input
							disabled
							type='text'
							defaultValue={selected && selected.data.name}
						/>
					</div>
					<div>
						<Label htmlFor='estimated_value'>Estimated Value</Label>
						<Input
							disabled
							type='text'
							defaultValue={currency(detail.estimated_value)}
						/>
					</div>

					<div>
						<Label htmlFor='weight'>Total Weight</Label>
						<Input disabled type='text' defaultValue={detail.weight} />
					</div>

					<div className='col-span-full'>
						<Label htmlFor='street_address'>Street Address</Label>
						<Textarea
							disabled
							defaultValue={selected && selected.data.street_address}
						/>
					</div>

					<div className='grid grid-cols-3 gap-6 col-span-full'>
						<div>
							<Label htmlFor='dimensions'>Length</Label>
							<Input disabled type='text' defaultValue={detail.length + 'cm'} />
						</div>
						<div>
							<Label htmlFor='dimensions'>Width</Label>
							<Input disabled type='text' defaultValue={detail.width + 'cm'} />
						</div>
						<div>
							<Label htmlFor='dimensions'>Height</Label>
							<Input disabled type='text' defaultValue={detail.height + 'cm'} />
						</div>
					</div>

					<div className='col-span-full'>
						<Label htmlFor='location'>Location</Label>
						{selected && (
							<Map
								location={{
									latitude: selected.data.latitude,
									longitude: selected.data.longitude,
								}}
								className='w-full aspect-banner'
								readonly
							/>
						)}
					</div>
				</div>
			)}

			<HeadingSubtitle>Courier Information</HeadingSubtitle>

			<div className='grid gap-6 lg:grid-cols-2'>
				<div>
					<Label htmlFor='company'>Courier Company</Label>
					<Input
						disabled
						type='text'
						className='uppercase'
						defaultValue={courier.company}
					/>
				</div>

				<div>
					<Label htmlFor='type'>Courier Type</Label>
					<Input
						disabled
						type='text'
						className='uppercase'
						defaultValue={courier.type}
					/>
				</div>

				<div>
					<Label htmlFor='shipping_fee'>Shipping Fee</Label>
					<Input
						disabled
						type='text'
						defaultValue={currency(courier.shipping_fee)}
					/>
				</div>

				<div>
					<Label htmlFor='duration'>Shipping Duration</Label>
					<Input disabled type='text' defaultValue={courier.duration} />
				</div>
			</div>

			<div className='col-span-full'>
				<div className='flex items-center gap-2'>
					<Button onClick={onSubmit} disabled={loading}>
						{loading ? 'Submitting...' : 'Confirm and Submit Donation'}
					</Button>
					<Button variant='outline' onClick={onPrevious}>
						Back
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ReviewBookDonation;
