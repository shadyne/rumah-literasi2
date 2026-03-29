import * as React from 'react';
import * as z from 'zod';

import { toast } from 'sonner';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';

const SignUpSchema = z.object({
	name: z.string().min(3),
	email: z.string().email(),
	password: z.string().min(8),
});

const SignUp = () => {
	const { loading, session, signup } = useAuth();
	const navigate = useNavigate();

	React.useEffect(() => {
		if (!loading && session) navigate('/auth/otp');
	}, [session, loading, navigate]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(SignUpSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	});

	const onSubmit = handleSubmit(async (data) => {
		try {
			toast('Registering...', {
				description: 'Checking your credentials and creating your account',
			});

			await signup(data);

			toast('Register successful', {
				description: 'You are now registered',
			});
			navigate('/auth/signin');
		} catch (error) {
			toast.error('Failed to register', {
				description: error.response?.data?.message || error.message,
			});
			console.error(error);
		}
	});

	return (
		<div>
			<h1 className='mb-8 text-4xl font-bold text-primary-500'>Register</h1>

			<form className='grid gap-6' onSubmit={onSubmit}>
				<div>
					<Label> Name</Label>
					<Input
						type='text'
						placeholder='Enter your name'
						{...register('name')}
					/>
					{errors.name && (
						<span className='text-red-500'>{errors.name.message}</span>
					)}
				</div>

				<div>
					<Label> Email</Label>
					<Input
						type='email'
						placeholder='Enter your email'
						{...register('email')}
					/>
					{errors.email && (
						<span className='text-red-500'>{errors.email.message}</span>
					)}
				</div>

				<div>
					<Label> Password</Label>
					<Input
						type='password'
						placeholder='Enter your password'
						{...register('password')}
					/>
					{errors.password && (
						<span className='text-red-500'>{errors.password.message}</span>
					)}
				</div>

				<Button className='w-full'>Register</Button>

				<div className='text-sm text-center text-zinc-500 '>
					Already have an account?{' '}
					<Link
						to='/auth/signin'
						className='font-medium text-primary-600 hover:text-primary-500'>
						Sign In
					</Link>
				</div>
			</form>
		</div>
	);
};

export default SignUp;
