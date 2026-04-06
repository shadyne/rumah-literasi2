import * as React from 'react';
import { cn } from '@/libs/utils';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
const FadeIn = React.forwardRef(
	(
		{
			className,
			children,
			direction = 'up',
			delay = 0,
			duration = 600,
			threshold = 0.1,
			as: Tag = 'div',
			...props
		},
		forwardedRef
	) => {
		const { ref, isVisible } = useIntersectionObserver({
			threshold,
			once: true,
		});

		const translateMap = {
			up: 'translateY(30px)',
			down: 'translateY(-30px)',
			left: 'translateX(30px)',
			right: 'translateX(-30px)',
			none: 'none',
		};

		const style = {
			opacity: isVisible ? 1 : 0,
			transform: isVisible ? 'none' : translateMap[direction],
			transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`,
			willChange: 'opacity, transform',
		};

		const setRef = (node) => {
			ref.current = node;
			if (typeof forwardedRef === 'function') forwardedRef(node);
			else if (forwardedRef) forwardedRef.current = node;
		};

		return (
			<Tag ref={setRef} style={style} className={cn(className)} {...props}>
				{children}
			</Tag>
		);
	}
);

FadeIn.displayName = 'FadeIn';

export { FadeIn };
