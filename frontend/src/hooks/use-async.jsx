import * as React from 'react';

const useAsync = (callback, dependencies = [], option) => {
	const { initial, onSuccess, onError } = option;

	const [state, setState] = React.useState({
		loading: true,
		error: null,
		data: initial,
	});

	const memoized = React.useCallback(() => {
		setState((prev) => ({
			...prev,
			loading: true,
		}));

		callback()
			.then((data) => {
				setState((prev) => ({
					...prev,
					loading: false,
					data: onSuccess(data),
				}));
			})
			.catch((error) => {
				setState((prev) => ({
					...prev,
					loading: false,
					error: error,
				}));

				onError(error);
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);

	React.useEffect(() => {
		memoized();
	}, [memoized]);

	return {
		...state,
		mutate: (callback) => {
			setState((prev) => ({
				...prev,
				data: callback(prev.data),
			}));
		},
	};
};

export { useAsync };
