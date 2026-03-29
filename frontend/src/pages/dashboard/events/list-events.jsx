import * as React from 'react';

import useSWR from 'swr';
import { toast } from 'sonner';
import { Link } from 'react-router';
import { usePagination } from '@/hooks/use-pagination';
import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';
import { useConfirm } from '@/hooks/use-confirm';
import axios from '@/libs/axios';

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

import { Loading } from '@/components/loading';
import { Empty } from '@/components/empty';
import { Error } from '@/components/error';
import { useResultState } from '@/hooks/use-result-state';
import { Pagination } from '@/components/pagination';

const ListEvents = () => {
	const { confirm } = useConfirm();
	const { page, limit, search, setSearch, debounced } = usePagination();

	const {
		error,
		mutate,
		data,
		isLoading: loading,
	} = useSWR([
		'events',
		{
			params: {
				page: page,
				limit: limit,
				search: debounced,
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
					await axios.delete('/events/' + id);
					mutate();
					toast('Event deleted', {
						description: 'Successfully deleted event',
					});
				} catch (error) {
					toast.error('Failed to delete event', {
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
				<HeadingTitle>Events List</HeadingTitle>
				<HeadingDescription>
					Manage all events with pagination and search functionality.
				</HeadingDescription>
			</Heading>

			<div className='flex items-center justify-between'>
				<Input
					value={search}
					type='search'
					placeholder='Search by title, description...'
					onChange={(e) => setSearch(e.target.value)}
				/>

				<Link to='/dashboard/events/create' className='flex-none'>
					<Button>Create Event</Button>
				</Link>
			</div>

			<div className='w-full overflow-x-auto border rounded-xl border-zinc-200'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Location</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{result.map((event) => (
							<TableRow key={event.id}>
								<TableCell className='font-medium'>{event.title}</TableCell>
								<TableCell>{event.description}</TableCell>
								<TableCell>{event.date}</TableCell>
								<TableCell>{event.location}</TableCell>
								<TableCell>
									<div className='flex items-center gap-2'>
										<Link to={'/dashboard/events/' + event.id}>
											<button className='bg-transparent hover:text-amber-500'>
												Detail
											</button>
										</Link>
										<button
											onClick={() => handleDelete(event.id)}
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

export default ListEvents;
