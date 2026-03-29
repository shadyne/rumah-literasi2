import ErrorTemplate from '@/pages/errors/template';

const ExpiredLink = () => {
	return (
		<ErrorTemplate
			title='Link Expired'
			description='The page you are looking for is no longer available or has been moved, updated, or deleted. Please check the URL and try again.'
		/>
	);
};

export default ExpiredLink;
