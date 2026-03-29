import { formatDate } from '@/libs/utils';
import { Calendar } from 'lucide-react';
import { User2 } from 'lucide-react';

const EventCard = ({ event }) => {
	return (
		<div className='overflow-hidden transition-colors duration-500 bg-white border rounded-xl group'>
			<div className='aspect-[4/3] overflow-hidden'>
				<img
					src={event.media}
					alt={event.title}
					className='object-cover size-full bg-zinc-100'
				/>
			</div>

			<div className='flex flex-col gap-3 p-4'>
				<h3 className='text-lg font-semibold group-hover:text-primary-500 text-zinc-900 line-clamp-1'>
					{event.title}
				</h3>
				<div className='flex items-center gap-2 text-sm'>
					<Calendar className='size-4 text-primary-500' />
					<span>{formatDate(event.date)}</span>
				</div>
				<p className='line-clamp-2 text-zinc-500'>{event.description}</p>
			</div>

			<div className='flex items-center gap-2 px-4 py-3 text-sm border-t text-zinc-500 border-zinc-200'>
				<User2 className='size-4' />
				<span>{event.user.name}</span>
			</div>
		</div>
	);
};

export { EventCard };
