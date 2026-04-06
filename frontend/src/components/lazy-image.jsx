import * as React from 'react';
import { cn } from '@/libs/utils';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

const LazyImage = React.forwardRef(
	({ src, alt, className, placeholderClassName, ...props }, forwardedRef) => {
		const { ref, isVisible } = useIntersectionObserver({
			threshold: 0,
			rootMargin: '200px 0px',
			once: true,
		});
		const [loaded, setLoaded] = React.useState(false);

		const setRef = (node) => {
			ref.current = node;
			if (typeof forwardedRef === 'function') forwardedRef(node);
			else if (forwardedRef) forwardedRef.current = node;
		};

		return (
			<div ref={setRef} className={cn('relative overflow-hidden', className)}>
				{!loaded && (
					<div
						className={cn(
							'absolute inset-0 bg-zinc-100 animate-pulse',
							placeholderClassName
						)}
					/>
				)}
				{isVisible && (
					<img
						src={src}
						alt={alt}
						onLoad={() => setLoaded(true)}
						className={cn(
							'w-full h-full object-cover transition-opacity duration-500',
							loaded ? 'opacity-100' : 'opacity-0',
							className
						)}
						{...props}
					/>
				)}
			</div>
		);
	}
);

LazyImage.displayName = 'LazyImage';

export { LazyImage };
