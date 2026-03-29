import * as React from 'react';

const useResultState = (error, loading, data) => {
	const { result, pagination, empty } = React.useMemo(() => {
		if (error || loading) {
			return {
				result: [],
				empty: false,
			};
		}
		return {
			result: data.data.rows,
			pagination: data.data.pagination,
			empty: data.data.rows.length === 0,
		};
	}, [error, loading, data]);

	return { result, pagination, empty };
};

export { useResultState };
