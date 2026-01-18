import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export const AutoResizingTextarea = forwardRef<
    HTMLTextAreaElement,
    {
        value: string;
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
        className?: string;
        placeholder?: string;
        trigger?: any;
    }
>(({
    value,
    onChange,
    className,
    placeholder,
    trigger
}, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);

    // Merge forwarded ref and internal ref
    useImperativeHandle(ref, () => internalRef.current!);

    useEffect(() => {
        const textarea = internalRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [value, trigger]);

    return (
        <textarea
            ref={internalRef}
            value={value}
            onChange={onChange}
            className={className}
            placeholder={placeholder}
            rows={1}
        />
    );
});

AutoResizingTextarea.displayName = 'AutoResizingTextarea';
