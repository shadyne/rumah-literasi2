import * as React from 'react';
import * as z from 'zod';

import { toast } from 'sonner';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuth } from '@/hooks/use-auth';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
	Checkbox,
	CheckboxGroup,
	CheckboxLabel,
} from '@/components/ui/checkbox';

const SignInSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

const SignIn = () => {
	const { loading, session, signin } = useAuth();
	const navigate = useNavigate();

	React.useEffect(() => {
		if (!loading && session) navigate('/auth/otp');
	}, [session, loading, navigate]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = handleSubmit(async (data) => {
		try {
			toast('Logging in...', {
				description: 'We are verifying your credentials',
			});

			await signin(data);

			toast('Login successful', {
				description: 'Please verify your account',
			});
			navigate('/dashboard');
		} catch (error) {
			toast.error('Failed to login', {
				description: error.response?.data?.message || error.message,
			});
			console.error(error);
		}
	});

	return (
		<div>
			<h1 className='mb-8 text-4xl font-bold text-primary-500'>Login</h1>

			<form className='grid gap-6' onSubmit={onSubmit}>
				<div>
					<Label htmlFor='email'>Email</Label>
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
					<Label htmlFor='password'>Password</Label>
					<Input
						type='password'
						placeholder='Enter your password'
						{...register('password')}
					/>
					{errors.password && (
						<span className='text-red-500'>{errors.password.message}</span>
					)}
				</div>

				<div className='flex items-center justify-between'>
					<CheckboxGroup>
						<Checkbox id='remember-me' name='remember-me' type='checkbox' />
						<CheckboxLabel htmlFor='remember-me'>Remember me</CheckboxLabel>
					</CheckboxGroup>

					<Link
						to='/auth/forgot-password'
						className='text-sm font-medium text-primary-600 hover:text-primary-500'>
						Forgot your password?
					</Link>
				</div>

				<Button className='w-full'>Login</Button>

				<div className='text-sm text-center text-zinc-500 '>
					Don't have an account?{' '}
					<Link
						to='/auth/signup'
						className='font-medium text-primary-600 hover:text-primary-500'>
						Sign up
					</Link>
				</div>
			</form>
		</div>
	);
};

export default SignIn;
