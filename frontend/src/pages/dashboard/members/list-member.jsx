import useSWR from 'swr';
import { toast } from 'sonner';
import { Link } from 'react-router';
import { usePagination, useString } from '@/hooks/use-pagination';

import axios from '@/libs/axios';
import { useConfirm } from '@/hooks/use-confirm';
import { Input } from '@/components/ui/input';

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
import { Avatar, AvatarGroup } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/loading';
import { Empty } from '@/components/empty';
import { Error } from '@/components/error';
import { useResultState } from '@/hooks/use-result-state';
import { Pagination } from '@/components/pagination';
import { ROLES } from '@/libs/constant';
import { Select } from '@/components/ui/select';

const ListMembers = () => {
	const { confirm } = useConfirm();
	const { page, limit, search, setSearch, debounced } = usePagination();
	const [role, setRole] = useString('role');

	const {
		error,
		mutate,
		data,
		isLoading: loading,
	} = useSWR([
		'members',
		{
			params: {
				page: page,
				limit: limit,
				search: debounced,
				role: role,
			},
		},
	]);

	const { result, pagination, empty } = useResultState(error, loading, data);

	const handleDelete = async (uuid) => {
		confirm({
			title: 'Confirm Action',
			variant: 'destructive',
			description: 'Are you sure you want to delete this record?',
		})
			.then(async () => {
				try {
					await axios.delete('/members/' + uuid);
					mutate();
					toast('Member deleted', {
						description: 'Successfully deleted member',
					});
				} catch (error) {
					toast.error('Failed to delete member', {
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
				<HeadingTitle>Member List</HeadingTitle>
				<HeadingDescription>
					Manage all members with pagination and search functionality.
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
						onChange={(e) => setRole(e.target.value)}>
						<option value=''>Select a status</option>
						{Object.values(ROLES).map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</Select>
				</div>
				<Link to='/dashboard/members/create' className='flex-none'>
					<Button>Create Member</Button>
				</Link>
			</div>

			<div className='w-full overflow-x-auto border rounded-xl border-zinc-200'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Verified</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{result.map((member) => (
							<TableRow key={member.uuid}>
								<TableCell>
									<AvatarGroup user={member} />
								</TableCell>
								<TableCell>{member.role}</TableCell>
								<TableCell>
									<Badge>{member.is_verified ? 'Yes' : 'No'}</Badge>
								</TableCell>
								<TableCell>
									<div className='flex items-center gap-2'>
										<Link to={'/dashboard/members/' + member.uuid + '/edit'}>
											<button className='bg-transparent hover:text-amber-500'>
												Edit
											</button>
										</Link>
										<button
											onClick={() => handleDelete(member.uuid)}
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

export default ListMembers;
