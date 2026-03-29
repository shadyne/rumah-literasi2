import React from 'react';
import {
	Tailwind,
	Body,
	Container,
	Heading,
	Preview,
	Section,
	Text,
	Hr,
	Head,
	Font,
	Button,
	Link,
} from '@react-email/components';

const ForgotPassword = ({ href = '{{href}}', name = '{{name}}' }) => {
	return (
		<Tailwind>
			<Head>
				<Font
					fontFamily='Brickolage Grotesque'
					fallbackFontFamily='Verdana'
					webFont={{
						url: 'https://cdn.jsdelivr.net/fontsource/fonts/bricolage-grotesque:vf@latest/latin-wght-normal.woff2',
						format: 'woff2',
					}}
					fontWeight='400 800'
					fontStyle='normal'
				/>
			</Head>

			<Preview>Password reset link</Preview>

			<Body className='py-10 font-sans bg-gray-100'>
				<Container className='max-w-lg mx-auto bg-white text-zinc-600 rounded-xl'>
					<Section className='p-6'>
						<Heading className='text-2xl font-bold text-center text-gray-800'>
							Password reset link
						</Heading>

						<Text>
							Hello {name}, you have requested a password reset link. Please
							click the button below to reset your password.
						</Text>

						<Section className='text-center'>
							<Button
								href={href}
								className='px-6 py-3 text-white bg-pink-500 rounded-xl'>
								Reset Password
							</Button>
						</Section>

						<Text>Or click the link below</Text>
						<Link href={href}>{href}</Link>

						<Text>
							If you are not trying to reset your password, you can safely
							ignore this email. This is an automated message, please do not
							reply to this email.
						</Text>
					</Section>

					<Hr />

					<Section className='text-center'>
						<Text>Rumah Literasi</Text>
					</Section>
				</Container>
			</Body>
		</Tailwind>
	);
};

ForgotPassword.PreviewProps = {
	href: 'https://example.com',
	username: 'User',
};

export default ForgotPassword;
