import useSWR from 'swr';
import { Link } from 'react-router';

import {
	Heading,
	HeadingDescription,
	Supertitle,
} from '@/components/ui/heading';

import { Loading } from '@/components/loading';
import { Error } from '@/components/error';
import { Empty } from '@/components/empty';
import { EventCard } from '@/components/events/event-card';
import { useResultState } from '@/hooks/use-result-state';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/pagination';
import { FadeIn } from '@/components/fade-in';

const ListEvents = () => {
	const { page, limit } = usePagination();

	const {
		error,
		data,
		isLoading: loading,
	} = useSWR([
		'public/events',
		{
			params: {
				page: page,
				limit: limit,
			},
		},
	]);

	const { result, pagination, empty } = useResultState(error, loading, data);

	return (
		<div className='container flex flex-col min-h-screen gap-8 py-24 max-w-7xl'>
			<FadeIn direction='up' duration={600}>
				<Heading>
					<Supertitle>Daftar Acara</Supertitle>
					<HeadingDescription>
						Temukan acara kami yang akan datang maupun yang telah berlalu.
					</HeadingDescription>
				</Heading>
			</FadeIn>

			<Error error={!loading && error} />
			<Empty empty={!loading && empty} />
			<Loading loading={loading} />

			<div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
				{result.map((event, i) => (
					<FadeIn key={event.id} direction='up' delay={i * 80} duration={600}>
						<Link to={'/events/' + event.id}>
							<EventCard event={event} />
						</Link>
					</FadeIn>
				))}
			</div>

			{pagination && <Pagination pagination={pagination} />}
		</div>
	);
};

export default ListEvents;
