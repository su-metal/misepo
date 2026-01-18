import React, { useEffect, useRef } from 'react';

export function AutoResizingTextarea({
    value,
    onChange,
    className,
    placeholder,
    trigger
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
    placeholder?: string;
    trigger?: any;
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [value, trigger]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            className={className}
            placeholder={placeholder}
            rows={1}
        />
    );
}
