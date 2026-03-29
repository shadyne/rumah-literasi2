import { usePagination } from '@/hooks/use-pagination';
import { cn } from '@/libs/utils';

const Pagination = ({ pagination }) => {
	const { page, goto, next, prev } = usePagination();

	if (!pagination.total) return null;
	return (
		<div className='flex items-center justify-between'>
			<span>
				Page {page} of {pagination.pages}
			</span>

			<div className='flex items-center justify-end gap-2'>
				<button
					variant='secondary'
					disabled={page <= 1}
					onClick={() => prev()}
					className='h-10 px-4 text-sm border rounded-xl disabled:opacity-50'>
					Previous
				</button>

				{Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
					let num;

					if (pagination.pages <= 5) num = i + 1;
					else if (page <= 3) num = i + 1;
					else if (page >= pagination.pages - 2) num = pagination.pages - 4 + i;
					else num = page - 2 + i;

					return (
						<button
							key={num}
							onClick={() => goto(num)}
							className={cn(
								'text-sm border rounded-xl disabled:opacity-50 size-10',
								{ 'ring-2 ring-primary-500 ring-offset-1': num === page }
							)}>
							{num}
						</button>
					);
				})}

				<button
					variant='secondary'
					onClick={() => next()}
					disabled={page >= pagination.pages}
					className='h-10 px-4 text-sm border rounded-xl disabled:opacity-50'>
					Next
				</button>
			</div>
		</div>
	);
};

export { Pagination };
