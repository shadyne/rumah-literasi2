import * as React from 'react';
import { X, Camera } from 'lucide-react';
import { cn } from '@/libs/utils';

const ImageUpload = React.forwardRef(
	(
		{ name, accept = 'image/*', defaultValue = null, onChange, ...props },
		ref
	) => {
		const fileInputRef = React.useRef(null);
		const [preview, setPreview] = React.useState(defaultValue);

		const handleImageChange = (e) => {
			const file = e.target.files[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result);
				onChange && onChange(e);
			};
			reader.readAsDataURL(file);
		};

		const handleRemoveImage = (e) => {
			e.stopPropagation();
			setPreview(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
			const event = {
				target: {
					name: name,
					value: null,
					files: null,
				},
			};
			onChange && onChange(event);
		};

		const handleContainerClick = () => {
			fileInputRef.current?.click();
		};

		React.useImperativeHandle(ref, () => fileInputRef.current);

		return (
			<div className={cn('w-full', props.className)}>
				<div
					className={cn(
						'relative overflow-hidden border rounded-xl border-zinc-200 bg-zinc-100 cursor-pointer aspect-[2/1]'
					)}
					onClick={handleContainerClick}>
					{preview ? (
						<React.Fragment>
							<img
								src={preview}
								alt='Preview'
								className='object-contain w-full h-full'
							/>
							<button
								type='button'
								onClick={handleRemoveImage}
								className='absolute z-10 p-2 bg-white border rounded-full top-4 right-4 border-zinc-200'>
								<X size={16} />
							</button>
						</React.Fragment>
					) : (
						<div className='flex flex-col items-center justify-center h-full p-4 text-center text-zinc-500'>
							<Camera className='mx-auto mb-2' />
							<p className='text-sm'>Click to upload image</p>
						</div>
					)}
				</div>

				<input
					type='file'
					name={name}
					accept={accept}
					className='hidden'
					ref={fileInputRef}
					onChange={handleImageChange}
					{...props}
				/>
			</div>
		);
	}
);

ImageUpload.displayName = 'ImageUpload';

export { ImageUpload };
