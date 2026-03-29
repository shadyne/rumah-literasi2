import * as React from 'react';

export const useDebounce = ({ initial, delay }) => {
	const [state, setState] = React.useState(initial);

	React.useEffect(() => {
		const handler = setTimeout(() => {
			setState(initial);
		}, delay);

		return () => clearTimeout(handler);
	}, [initial, delay]);

	return state;
};
