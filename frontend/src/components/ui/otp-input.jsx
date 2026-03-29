import * as React from 'react';
import { cn } from '@/libs/utils';

const OTPInput = React.forwardRef(
	({ length = 6, autoFocus = false, onChange, className }, ref) => {
		const inputs = React.useRef([]);

		const handleChange = (e, i) => {
			const val = e.target.value;
			if (/^\d$/.test(val)) {
				inputs.current[i].value = val;
				if (i < length - 1) inputs.current[i + 1].focus();
			} else {
				inputs.current[i].value = '';
			}
			triggerChange();
		};

		const handleKeyDown = (e, i) => {
			if (e.key === 'Backspace' && !e.target.value && i > 0) {
				inputs.current[i - 1].focus();
			}
		};

		const handlePaste = (e) => {
			const paste = e.clipboardData
				.getData('text')
				.replace(/\D/g, '')
				.slice(0, length);
			paste.split('').forEach((char, i) => {
				if (inputs.current[i]) {
					inputs.current[i].value = char;
				}
			});
			if (inputs.current[paste.length - 1]) {
				inputs.current[paste.length - 1].focus();
			}
			triggerChange();
		};

		const triggerChange = () => {
			const code = inputs.current.map((el) => el?.value || '').join('');
			onChange(code);
		};

		React.useImperativeHandle(ref, () => ({
			focus: () => inputs.current[0]?.focus(),
			clear: () => {
				inputs.current.forEach((i) => (i.value = ''));
				inputs.current[0]?.focus();
			},
		}));

		return (
			<div className={cn('flex gap-3 justify-center', className)}>
				{Array.from({ length }).map((_, i) => (
					<input
						key={i}
						type='text'
						inputMode='numeric'
						maxLength={1}
						autoFocus={autoFocus && i === 0}
						className='text-lg text-center border size-14 aspect-square border-zinc-200 rounded-xl focus:ring-primary-500 focus:border-primary-500'
						onChange={(e) => handleChange(e, i)}
						onKeyDown={(e) => handleKeyDown(e, i)}
						ref={(el) => (inputs.current[i] = el)}
						onPaste={handlePaste}
					/>
				))}
			</div>
		);
	}
);

OTPInput.displayName = 'OTPInput';

export { OTPInput };
