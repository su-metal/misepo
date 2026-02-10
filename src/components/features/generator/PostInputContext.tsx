import React from 'react';
import { PostInputFormProps } from './inputConstants';

const PostInputContext = React.createContext<PostInputFormProps | null>(null);

export const PostInputProvider: React.FC<{ value: PostInputFormProps; children: React.ReactNode }> = ({
    value,
    children
}) => {
    return (
        <PostInputContext.Provider value={value}>
            {children}
        </PostInputContext.Provider>
    );
};

export const usePostInput = (): PostInputFormProps => {
    const ctx = React.useContext(PostInputContext);
    if (!ctx) {
        throw new Error('usePostInput must be used within a PostInputProvider');
    }
    return ctx;
};
