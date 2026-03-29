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
} from '@react-email/components';

const OneTimePasswordEmail = ({ otp = '{{otp}}', name = '{{name}}' }) => {
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

			<Preview>Your verification code for secure access</Preview>

			<Body className='py-10 font-sans bg-gray-100'>
				<Container className='max-w-lg mx-auto bg-white text-zinc-600 rounded-xl'>
					<Section className='p-6'>
						<Heading className='text-2xl font-bold text-center text-gray-800'>
							Verification Code
						</Heading>

						<Text>
							Hello {name}, Please use the verification code below to complete
							your authentication
						</Text>

						<Text className='py-5 font-mono text-3xl font-bold tracking-widest text-center text-pink-500'>
							{otp}
						</Text>

						<Text>
							If you didn't request this code, you can safely ignore this email.
							This is an automated message, please do not reply to this email.
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

OneTimePasswordEmail.PreviewProps = {
	otp: '123456',
	username: 'User',
};

export default OneTimePasswordEmail;
