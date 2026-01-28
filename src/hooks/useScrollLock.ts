import { useEffect } from 'react';

/**
 * A hook to lock the body scroll.
 * @param isLocked Whether the scroll should be locked. Defaults to true.
 */
export const useScrollLock = (isLocked: boolean = true) => {
  useEffect(() => {
    if (!isLocked) return;

    // Save original style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      // Revert style
      document.body.style.overflow = originalStyle;
    };
  }, [isLocked]);
};
