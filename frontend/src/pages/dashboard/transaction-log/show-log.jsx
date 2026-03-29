import { Link, useParams } from 'react-router';
import useSWR from 'swr';

import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from '@/components/ui/heading';

import { Button } from '@/components/ui/button';
import { Loading } from '@/components/loading';
import { Error } from '@/components/error';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CodeBlock } from '@/components/codeblock';

const ShowLog = () => {
	const { uuid } = useParams();
	const { error, data: result, isLoading: fetching } = useSWR('/logs/' + uuid);

	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle>Log Details</HeadingTitle>
				<HeadingDescription>
					View detailed information about this log entry.
				</HeadingDescription>
			</Heading>

			<Error error={!fetching && error} />
			<Loading loading={fetching} />

			{result && (
				<div className='grid gap-6 lg:grid-cols-2'>
					<div className='col-span-full'>
						<Label htmlFor='action'>Action</Label>
						<Input disabled type='text' defaultValue={result.data.action} />
					</div>

					<div className='col-span-full'>
						<Label htmlFor='message'>Message</Label>
						<Textarea disabled defaultValue={result.data.message} />
					</div>

					<div>
						<Label htmlFor='resourceType'>Resource Type</Label>
						<Input
							disabled
							type='text'
							defaultValue={result.data.resource_type}
						/>
					</div>

					<div>
						<Label htmlFor='resourceId'>Resource ID</Label>
						<Input
							disabled
							type='text'
							defaultValue={result.data.resource_id}
						/>
					</div>

					<div>
						<Label htmlFor='ipAddress'>IP Address</Label>
						<Input disabled type='text' defaultValue={result.data.ip_address} />
					</div>

					<div>
						<Label htmlFor='userAgent'>User Agent</Label>
						<Input disabled type='text' defaultValue={result.data.user_agent} />
					</div>

					<div className='col-span-full'>
						<Label htmlFor='metadata'>Metadata</Label>
						<CodeBlock>
							{JSON.stringify(result.data.metadata, null, 2)}
						</CodeBlock>
					</div>

					<div className='col-span-full'>
						<div className='flex items-center gap-2'>
							<Link to='/dashboard/logs'>
								<Button variant='outline'>Back</Button>
							</Link>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ShowLog;
