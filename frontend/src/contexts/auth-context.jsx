import useSWR from 'swr';
import * as React from 'react';

import axios, { onUnautenticated } from '@/libs/axios';
import useLocalStorage from '@/hooks/use-localstorage';

const AuthContext = React.createContext({
	user: null,
	session: null,
	loading: true,
	signin: async () => {},
	signup: async () => {},
	validate: async () => {},
	signout: async () => {},
});

export function AuthProvider({ children }) {
	const [session, setSession] = useLocalStorage('session', null);
	const { data: result, isLoading: loading, mutate } = useSWR('/auth/profile');

	onUnautenticated(() => {
		mutate(null, {
			revalidate: false,
		});
	});

	const user = React.useMemo(() => {
		if (result) return result.data;
		return null;
	}, [result]);

	const signin = async ({ email, password }) => {
		const { data } = await axios.post('/auth/signin', {
			email,
			password,
		});
		setSession(data.data);
	};

	const signup = async ({ name, email, password }) => {
		await axios.post('/auth/signup', {
			name,
			email,
			password,
		});
	};

	const validate = async ({ otp }) => {
		const { data } = await axios.post('/auth/validate', {
			otp,
		});
		setSession(null);
		mutate(data, {
			revalidate: false,
		});
	};

	const signout = async () => {
		await axios.post('/auth/signout');
		setSession(null);
		mutate(null, {
			revalidate: false,
		});
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				session,
				loading,
				signin,
				signup,
				validate,
				signout,
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export default AuthContext;
