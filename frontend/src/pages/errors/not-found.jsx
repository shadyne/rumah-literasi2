import ErrorTemplate from '@/pages/errors/template';

const NotFound = () => {
	return (
		<ErrorTemplate
			title='404'
			description='The page you are looking for does not exist or has been moved, updated, or deleted. Please check the URL and try again. If you think this is an error, please contact the website administrator.'
		/>
	);
};

export default NotFound;
