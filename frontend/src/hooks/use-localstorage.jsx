import * as React from 'react';

export default function useLocalStorage(key, initialValue) {
	const [storedValue, setStoredValue] = React.useState(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(error);
			return initialValue;
		}
	});

	React.useEffect(() => {
		try {
			const value = JSON.stringify(storedValue);
			window.localStorage.setItem(key, value);
		} catch (error) {
			console.error(error);
		}
	}, [storedValue, key]);

	return [storedValue, setStoredValue];
}
