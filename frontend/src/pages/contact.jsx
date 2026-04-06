import * as React from 'react';

import {
	Heading,
	HeadingDescription,
	Supertitle,
} from '@/components/ui/heading';
import { FadeIn } from '@/components/fade-in';

const Contact = () => {
	return (
		<React.Fragment>
			<div className='container grid gap-6 py-24 max-w-7xl'>
				<FadeIn direction='up' duration={600}>
					<Heading>
						<Supertitle>Kontak</Supertitle>
						<div className='p-6 overflow-hidden border bg-zinc-50 rounded-xl'>
							<iframe
								className='w-full rounded-xl aspect-banner bg-zinc-100'
								src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.3830028208763!2d110.35682907501909!3d-7.749138176830932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59cd16b50811%3A0xbb55d2ffb26d108d!2sMraen%20Mimpi!5e0!3m2!1sen!2sid!4v1774780543910!5m2!1sen!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
							/>
						</div>
						<HeadingDescription>
							Gg. Mawar Jl. Tegal Mraen No.101, RT.03/RW.10, Dukuh, Sendangadi,
							Kec. Mlati, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55285
						</HeadingDescription>
					</Heading>
				</FadeIn>
			</div>
		</React.Fragment>
	);
};

export default Contact;
