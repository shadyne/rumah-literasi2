import { Toaster as Sonner } from 'sonner';

const Toaster = ({ ...props }) => {
	return (
		<Sonner
			toastOptions={{
				classNames: {
					toast:
						'font-sans !items-start !border-zinc-200 !rounded-xl !shadow-none',
					description: 'text-zinc-500',
					actionButton: 'bg-primary-500 text-white',
					cancelButton: 'bg-zinc-500 text-white',
					icon: '!size-4 !text-primary-500',
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
