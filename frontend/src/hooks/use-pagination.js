import { debounce } from 'nuqs';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { useDebounce } from '@/hooks/use-debounced';

export const useInteger = (key, defaultValue) => {
	const parser = parseAsInteger.withDefault(defaultValue);
	return useQueryState(key, parser);
};

export const useString = (key, defaultValue, options) => {
	const parser = parseAsString.withDefault(defaultValue);
	return useQueryState(key, {
		...parser,
		...options,
	});
};

const DEFAULT = {
	page: 1,
	limit: 5,
	debounce: 500,
};

export const usePagination = (initial = DEFAULT) => {
	const [page, setPage] = useInteger('page', initial.page);
	const [limit, setLimit] = useInteger('limit', initial.limit);
	const [search, setSearch] = useString('search', '', {
		shallow: false,
		limitUrlUpdates: debounce(initial.debounce),
	});

	const debounced = useDebounce({
		initial: search,
		delay: initial.debounce,
	});

	const goto = (go) => setPage(Math.max(1, go));
	const next = () => setPage((prev) => prev + 1);
	const prev = () => setPage((prev) => Math.max(1, prev - 1));
	const reset = () => {
		setPage(initial.page);
		setSearch('');
	};

	return {
		page,
		limit,
		search,
		setLimit,
		setSearch,
		debounced,
		goto,
		next,
		prev,
		reset,
	};
};
