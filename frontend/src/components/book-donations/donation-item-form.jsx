import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router';
import { itemSchema } from '@/libs/schemas';
import { Hint } from '@/components/ui/hint';

const DonationItemForm = ({ initial, action, label }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(itemSchema),
		defaultValues: initial || {
			isbn: '',
			title: '',
			author: '',
			publisher: '',
			year: new Date().getFullYear(),
			language: '',
			amount: 0,
		},
	});

	return (
		<form onSubmit={handleSubmit(action)} className='grid gap-6 lg:grid-cols-2'>
			<div className='col-span-full'>
				<Label htmlFor='isbn'>ISBN</Label>
				<Input
					type='text'
					placeholder='Enter your ISBN'
					{...register('isbn')}
				/>
				<Hint>
					International Standard Book Number uniquely identifying this
					publication.
				</Hint>
				{errors.isbn && (
					<span className='text-red-500'>{errors.isbn.message}</span>
				)}
			</div>

			<div className='col-span-full'>
				<Label htmlFor='title'>Title</Label>
				<Input
					type='text'
					placeholder='Enter your title'
					{...register('title')}
				/>
				<Hint>Name of the publication you wish to donate.</Hint>
				{errors.title && (
					<span className='text-red-500'>{errors.title.message}</span>
				)}
			</div>

			<div className='col-span-2'>
				<Label htmlFor='author'>Author</Label>
				<Input
					type='text'
					placeholder='Enter your author'
					{...register('author')}
				/>
				<Hint>Writer or creator of this publication.</Hint>
				{errors.author && (
					<span className='text-red-500'>{errors.author.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='publisher'>Publisher</Label>
				<Input
					type='text'
					placeholder='Enter your publisher'
					{...register('publisher')}
				/>
				<Hint>Company responsible for publishing this work.</Hint>
				{errors.publisher && (
					<span className='text-red-500'>{errors.publisher.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='year'>Year</Label>
				<Input
					type='number'
					placeholder='Enter your year'
					{...register('year')}
				/>
				<Hint>Year when this publication was released.</Hint>
				{errors.year && (
					<span className='text-red-500'>{errors.year.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='language'>Language</Label>
				<Input
					type='text'
					placeholder='Enter your language'
					{...register('language')}
				/>
				<Hint>Primary language used in this publication.</Hint>
				{errors.language && (
					<span className='text-red-500'>{errors.language.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='amount'>Amount</Label>
				<Input
					type='number'
					placeholder='Enter your amount'
					{...register('amount')}
				/>
				<Hint>Quantity of books you are contributing to the donation.</Hint>
				{errors.amount && (
					<span className='text-red-500'>{errors.amount.message}</span>
				)}
			</div>

			<div className='col-span-full'>
				<div className='flex items-center gap-2'>
					<Button>{label}</Button>
					<Link to='/dashboard/book-donations/create'>
						<Button variant='outline'>Cancel</Button>
					</Link>
				</div>
			</div>
		</form>
	);
};

export default DonationItemForm;
