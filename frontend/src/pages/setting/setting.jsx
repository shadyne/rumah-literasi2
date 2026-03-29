import * as React from 'react';

import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from '@/components/ui/heading';

const Setting = () => {
	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle>Application Setting</HeadingTitle>
				<HeadingDescription>
					Manage your application settings to support literacy activities at Mraen Mimpi
				</HeadingDescription>
			</Heading>
		</div>
	);
};

export default Setting;
