import React from 'react';
import { PostInputFormProps } from './inputConstants';
import { DesktopPostInput } from './DesktopPostInput';
import { MobilePostInput } from './MobilePostInput';

export const PostInputForm: React.FC<PostInputFormProps> = (props) => {
    // Always render MobilePostInput regardless of screen size
    // Layout and container styling will be handled by the parent (PostGenerator)
    return (
        <div className="h-full w-full">
            <MobilePostInput
                {...props}
                isCalendarOpen={props.isCalendarOpen}
                onCalendarToggle={props.onCalendarToggle}
            />
        </div>
    );
};

export default PostInputForm;
