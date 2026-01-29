import React from 'react';
import { PostInputFormProps } from './inputConstants';
import { DesktopPostInput } from './DesktopPostInput';
import { MobilePostInput } from './MobilePostInput';

export const PostInputForm: React.FC<PostInputFormProps> = (props) => {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <>
            {/* Desktop View */}
            {!isMobile && (
                <div className="hidden sm:block">
                    <DesktopPostInput {...props} />
                </div>
            )}

            {/* Mobile View */}
            {isMobile && (
                <div className="block sm:hidden">
                    <MobilePostInput {...props} />
                </div>
            )}
        </>
    );
};

export default PostInputForm;
