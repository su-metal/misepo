import React from 'react';
import { PostInputFormProps } from './inputConstants';
import { PostInputProvider } from './PostInputContext';
import { MobilePostInput } from './MobilePostInput';

export const PostInputForm: React.FC<PostInputFormProps> = (props) => {
    return (
        <div className="h-full w-full">
            <PostInputProvider value={props}>
                <MobilePostInput />
            </PostInputProvider>
        </div>
    );
};

export default PostInputForm;
