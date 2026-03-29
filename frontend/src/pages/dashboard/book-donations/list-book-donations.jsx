import useSWR from 'swr';
import { toast } from 'sonner';
import { Link } from 'react-router';
import { usePagination, useString } from '@/hooks/use-pagination';

import axios from '@/libs/axios';
import { useConfirm } from '@/hooks/use-confirm';

import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from '@/components/ui/heading';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Loading } from '@/components/loading';
import { Badge } from '@/components/ui/badge';
import { Empty } from '@/components/empty';
import { Error } from '@/components/error';
import { Avatar, AvatarGroup } from '@/components/ui/avatar';
import { currency, formatDate } from '@/libs/utils';
import { PAYMENT_STATUS } from '@/libs/constant';
import { useResultState } from '@/hooks/use-result-state';
import { Pagination } from '@/components/pagination';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const ListBookDonations = () => {
	const { confirm } = useConfirm();
	const { page, limit, search, setSearch, debounced } = usePagination();
	const [status, setStatus] = useString('status');

	const {
		error,
		mutate,
		data,
		isLoading: loading,
	} = useSWR([
		'book-donations',
		{
			params: {
				page: page,
				limit: limit,
				search: debounced,
				status: status,
			},
		},
	]);

	const { result, pagination, empty } = useResultState(error, loading, data);

	const handleDelete = async (id) => {
		confirm({
			title: 'Confirm Action',
			variant: 'destructive',
			description: 'Are you sure you want to delete this record?',
		})
			.then(async () => {
				try {
					await axios.delete('/book-donations/' + id);
					mutate();
					toast('Book donation deleted', {
						description: 'Successfully deleted book donation',
					});
				} catch (error) {
					toast.error('Failed to delete book donation', {
						description: error.response?.data?.message || error.message,
					});
					console.error(error);
				}
			})
			.catch(() => {
				// pass
			});
	};

	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle>Book Donations List</HeadingTitle>
				<HeadingDescription>
					Manage all book donations with pagination and search functionality.
				</HeadingDescription>
			</Heading>

			<div className='flex items-center justify-between'>
				<div className='flex items-center w-full gap-2'>
					<Input
						value={search}
						type='search'
						placeholder='Search by member name, address...'
						onChange={(e) => setSearch(e.target.value)}
					/>
					<Select
						value={status}
						className='max-w-40'
						onChange={(e) => setStatus(e.target.value)}>
						<option value=''>Select a status</option>
						{Object.values(PAYMENT_STATUS).map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</Select>
				</div>

				<Link to='/dashboard/book-donations/create' className='flex-none'>
					<Button>Create Book Donation</Button>
				</Link>
			</div>

			<div className='w-full overflow-x-auto border rounded-xl border-zinc-200'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Member</TableHead>
							<TableHead>Shipping Fee</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{result.map((bookDonation) => (
							<TableRow key={bookDonation.id}>
								<TableCell>
									<AvatarGroup user={bookDonation.user} />
								</TableCell>
								<TableCell>{currency(bookDonation.shipping_fee)}</TableCell>
								<TableCell>
									<Badge>{bookDonation.status}</Badge>
								</TableCell>
								<TableCell>{formatDate(bookDonation.createdAt)}</TableCell>
								<TableCell>
									<div className='flex items-center gap-2'>
										{bookDonation.status === PAYMENT_STATUS.PENDING && (
											<a
												href={bookDonation.payment_url}
												target='_blank'
												rel='noreferrer'>
												<button className='bg-transparent hover:text-blue-500'>
													Complete Payment
												</button>
											</a>
										)}
										<Link to={'/dashboard/book-donations/' + bookDonation.id}>
											<button className='bg-transparent hover:text-amber-500'>
												Detail
											</button>
										</Link>
										<button
											onClick={() => handleDelete(bookDonation.id)}
											className='bg-transparent hover:text-red-500'>
											Delete
										</button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<Error error={!loading && error} />
				<Empty empty={!loading && empty} />
				<Loading loading={loading} />
			</div>

			{pagination && <Pagination pagination={pagination} />}
		</div>
	);
};

export default ListBookDonations;
