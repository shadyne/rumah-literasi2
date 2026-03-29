import ErrorTemplate from '@/pages/errors/template';

const Unauhtorized = () => {
	return (
		<ErrorTemplate
			title='Unauthorized'
			description='You are not authorized to access this resource. Please contact the website administrator if you believe this is an error.'
		/>
	);
};

export default Unauhtorized;
