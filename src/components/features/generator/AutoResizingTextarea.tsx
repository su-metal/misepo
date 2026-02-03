import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export const AutoResizingTextarea = forwardRef<
    HTMLTextAreaElement,
    {
        value: string;
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
        className?: string;
        placeholder?: string;
        onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
        onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
        trigger?: any;
    }
>(({
    value,
    onChange,
    className,
    placeholder,
    onFocus,
    onBlur,
    trigger
}, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);

    // Merge forwarded ref and internal ref
    useImperativeHandle(ref, () => internalRef.current!);

    useEffect(() => {
        const textarea = internalRef.current;
        if (!textarea) return;

        const adjustHeight = () => {
            // We must reset height to 'auto' to correctly detect the needed height (shrink if possible)
            // '0px' can cause issues, 'auto' is the standard way to shrink-wrap 
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight + 4}px`;
        };

        // Initial adjustment 
        // Use RAF to ensure valid DOM state even on first render or quick updates
        window.requestAnimationFrame(adjustHeight);

        // Use ResizeObserver to detect width changes (window resize/container resize)
        const observer = new ResizeObserver(() => {
            // Use requestAnimationFrame to ensure we measure *after* the browser has finished
            // the layout update for the new width.
            window.requestAnimationFrame(adjustHeight);
        });

        observer.observe(textarea);

        // Fallback for window resize events which might not trigger observer in some edge cases
        const handleResize = () => window.requestAnimationFrame(adjustHeight);
        window.addEventListener('resize', handleResize);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, [value, trigger]); // Trigger re-run if value changes explicitly

    return (
        <textarea
            ref={internalRef}
            value={value}
            onChange={onChange}
            className={className}
            placeholder={placeholder}
            onFocus={onFocus}
            onBlur={onBlur}
            rows={1}
        />
    );
});

AutoResizingTextarea.displayName = 'AutoResizingTextarea';
