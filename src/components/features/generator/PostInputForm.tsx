import React from 'react';
import { PostInputFormProps } from './inputConstants';
import { DesktopPostInput } from './DesktopPostInput';
import { MobilePostInput } from './MobilePostInput';

export const PostInputForm: React.FC<PostInputFormProps> = (props) => {
    return (
        <>
            {/* Desktop View */}
            <div className="hidden sm:block">
                <DesktopPostInput {...props} />
            </div>

            {/* Mobile View */}
            <div className="block sm:hidden">
                <MobilePostInput {...props} />
            </div>
        </>
    );
};

export default PostInputForm;
