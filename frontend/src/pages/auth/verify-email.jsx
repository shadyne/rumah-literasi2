import * as React from 'react';
import * as z from 'zod';

import { toast } from 'sonner';
import { Link } from 'react-router';
import { useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import axios from '@/libs/axios';
import { useAuth } from '@/hooks/use-auth';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const VerifyEmailSchema = z.object({
	otp: z.string().min(6, 'OTP must be at least 6 characters'),
});

const SignUpVerify = () => {
	const location = useLocation();
	const emailSent = location.state?.emailSent || false;
	const registeredEmail = location.state?.email || '';
	const { loading, session, user } = useAuth();
	const navigate = useNavigate();

	React.useEffect(() => {
		if (!loading && session) navigate('/dashboard');
	}, [session, loading, navigate]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(VerifyEmailSchema),
		defaultValues: {
			otp: '',
		},
	});

	const handleResendEmail = async () => {
		try {
			await axios.post('/auth/resend-verification');
			toast.success('Verification code sent', {
				description: 'Please check your email inbox',
			});
			setSent(true);
		} catch (error) {
			toast.error('Failed to send verification code', {
				description: error.response?.data?.message || error.message,
			});
		}
	};

	return (
		<div>
			<h1 className='mb-8 text-4xl font-bold text-primary-500'>
				Verify Your Email
			</h1>

			<form className='grid gap-6' onSubmit={handleResendEmail}>
				{emailSent ? (
					<React.Fragment>
						<div className='text-sm text-zinc-500 '>
							We've sent you an email to <strong>{registeredEmail}</strong> with
							the link verification, please check your inbox. If you don't
							receive the email, please check your spam folder.
						</div>
					</React.Fragment>
				) : (
					<React.Fragment>
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
					</React.Fragment>
				)}
				<Button type='submit' onClick={handleResendEmail} disabled={emailSent}>
					Resend Verification
				</Button>

				<div className='text-sm text-center text-zinc-500'>
					Back to{' '}
					<Link
						to='/auth/signin'
						className='font-medium text-primary-600 hover:text-primary-500'>
						Sign in
					</Link>
				</div>
			</form>
		</div>
	);
};

export default SignUpVerify;
