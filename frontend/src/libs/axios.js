import base from 'axios';
export const { isAxiosError } = base;

const axios = base.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	withCredentials: true,
	withXSRFToken: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

export const fetcher = async (args) => {
	const [url, config] = Array.isArray(args) ? args : [args];
	const res = await axios.get(url, {
		...config,
	});
	return res.data;
};

let handleSignout = () => {};

axios.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) handleSignout();
		return Promise.reject(error);
	}
);

export const onUnautenticated = (callback) => {
	handleSignout = callback;
};

export default axios;
