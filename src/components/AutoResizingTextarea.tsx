import React, { useRef, useEffect } from 'react';

interface AutoResizingTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    value: string;
    onChange: (value: string) => void;
}

export const AutoResizingTextarea: React.FC<AutoResizingTextareaProps> = ({
    value,
    onChange,
    className = '',
    ...props
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
                adjustHeight();
            }}
            className={className}
            {...props}
        />
    );
};

// Exported inline
