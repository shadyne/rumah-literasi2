'use client';

import useSWR from 'swr';
import { toast } from 'sonner';
import { Link } from 'react-router';

import axios from '@/libs/axios';
import { useConfirm } from '@/hooks/use-confirm';
import { useResultState } from '@/hooks/use-result-state';

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
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/loading';
import { Empty } from '@/components/empty';
import { Error } from '@/components/error';
import { currency } from '@/libs/utils';
import { Avatar } from '@/components/ui/avatar';

const ListTransactions = () => {
	const { confirm } = useConfirm();

	const { error, mutate, data, isLoading: loading } = useSWR('/transactions');
	const { result, empty } = useResultState(error, loading, data);

	const handleDelete = async (uuid) => {
		confirm({
			title: 'Confirm Action',
			variant: 'destructive',
			description: 'Are you sure you want to delete this record?',
		})
			.then(async () => {
				try {
					await axios.delete('/transactions/' + uuid);
					mutate();
					toast('Transaction deleted', {
						description: 'Successfully deleted transaction',
					});
				} catch (error) {
					toast.error('Failed to delete transaction', {
						description: error.response.data.message || error.message,
					});
					console.log(error);
				}
			})
			.catch(() => {
				// pass
			});
	};

	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle>Transaction List</HeadingTitle>
				<HeadingDescription>
					Manage all borrowing transactions in the system. View customer
					details, track delivery status, and manage return dates.
				</HeadingDescription>

				<div className='flex items-center justify-end'>
					<Link to='/dashboard/transactions/create'>
						<Button>Create Transaction</Button>
					</Link>
				</div>
			</Heading>

			<div className='w-full overflow-x-auto border rounded-lg border-zinc-200'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Member</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Borrowed Date</TableHead>
							<TableHead>Deadline</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Courier</TableHead>
							<TableHead>Delivery Fee</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{result.map((transaction) => {
							let variant = null;

							switch (transaction.status) {
								case 'pending':
									variant = 'outline';
									break;
								case 'approved':
									variant = 'success';
									break;
								case 'rejected':
									variant = 'destructive';
									break;
								case 'completed':
									variant = 'primary';
									break;
								default:
									variant = 'outline';
									break;
							}

							return (
								<TableRow key={transaction.uuid}>
									<TableCell>
										<div className='flex items-center gap-4'>
											<Avatar
												name={transaction.user.name}
												className='flex-none'
											/>
											<span className='font-medium'>
												{transaction.user.name}
											</span>
										</div>
									</TableCell>
									<TableCell>{transaction.name}</TableCell>
									<TableCell>{transaction.borrowed_date}</TableCell>
									<TableCell>{transaction.deadline_date}</TableCell>
									<TableCell>
										<Badge variant={variant}>{transaction.status}</Badge>
									</TableCell>
									<TableCell className='uppercase'>
										{transaction.courier_company} - {transaction.courier_type}
									</TableCell>
									<TableCell>
										{transaction.delivery_fee ? (
											<span>{currency(transaction.delivery_fee)}</span>
										) : (
											<span>-</span>
										)}
									</TableCell>
									<TableCell>
										<div className='flex items-center gap-2'>
											<Link to={transaction.uuid + '/detail'} relative='path'>
												<button className='bg-transparent hover:text-primary-500'>
													Detail
												</button>
											</Link>

											<button
												onClick={() => handleDelete(transaction.uuid)}
												className='bg-transparent hover:text-red-500'>
												Delete
											</button>
										</div>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>

				<Error error={!loading && error} />
				<Empty empty={!loading && empty} />
				<Loading loading={loading} />
			</div>
		</div>
	);
};

export default ListTransactions;
