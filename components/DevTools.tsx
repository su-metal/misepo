
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface DevToolsProps {
  isPro: boolean;
  togglePro: () => void;
  resetUsage: () => void;
  resetProfile: () => void;
  simulateRegisteredUser: () => void;
}

const DevTools: React.FC<DevToolsProps> = ({ isPro, togglePro, resetUsage, resetProfile, simulateRegisteredUser }) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isMinRef = useRef(isMinimized);
  
  const offset = useRef({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const hasMoved = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Prevent drag start if clicking buttons inside the maximized view
    // We allow dragging the minimized view (which acts as a button)
    if (!isMinimized && (e.target as HTMLElement).closest('button')) return;

    if (!isMinimized) {
      e.preventDefault();
    }
    setIsDragging(true);
    hasMoved.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };

    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      offset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    isMinRef.current = isMinimized;
  }, [isMinimized]);

  useEffect(() => {
    const clampPosition = () => {
      if (!ref.current) return;
      const width = ref.current.offsetWidth;
      const height = ref.current.offsetHeight;
      setPosition((prev) => {
        const maxX = Math.max(0, window.innerWidth - width);
        const maxY = Math.max(0, window.innerHeight - height);
        return {
          x: Math.min(Math.max(0, prev.x), maxX),
          y: Math.min(Math.max(0, prev.y), maxY),
        };
      });
    };

    clampPosition();
    window.addEventListener('resize', clampPosition);
    window.addEventListener('orientationchange', clampPosition);

    return () => {
      window.removeEventListener('resize', clampPosition);
      window.removeEventListener('orientationchange', clampPosition);
    };
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging) {
        e.preventDefault(); // Prevent text selection

        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;
        const threshold = isMinRef.current ? 8 : 3;
        if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
          hasMoved.current = true;
        }

        setPosition({
          x: e.clientX - offset.current.x,
          y: e.clientY - offset.current.y
        });
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      setIsDragging(false);
      if (isMinRef.current && !hasMoved.current) {
        setIsMinimized(false);
      }
      if (ref.current && ref.current.hasPointerCapture(e.pointerId)) {
        ref.current.releasePointerCapture(e.pointerId);
      }
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging, isMinimized]);

  const handleMinimizeClick = () => {
    // Always allow expanding from the minimized pill even if the pointer slightly moved
    setIsMinimized(false);
  };

  if (!isMounted) return null;

  return createPortal(
    <div
      ref={ref}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        position: 'fixed',
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none'
      }}
      onPointerDown={handlePointerDown}
      className={`bg-gray-900 text-white shadow-xl border border-gray-700 ${
        // Disable transitions during drag to prevent lag/rubber-banding
        isDragging ? '' : 'transition-all duration-300'
      } ${
        isMinimized ? 'w-12 h-12 rounded-full overflow-hidden' : 'w-48 p-3 rounded-lg opacity-90 hover:opacity-100'
      }`}
    >
      {isMinimized ? (
        <div 
          onClick={handleMinimizeClick}
          className="w-full h-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          title="Expand DevTools (Drag to move)"
          role="button"
        >
          <span className="text-[10px] font-bold select-none">DEV</span>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-700 select-none">
            <span className="text-xs font-bold text-gray-400 tracking-wider">DEV TOOLS</span>
            <button 
              onClick={() => setIsMinimized(true)}
              className="text-gray-500 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors"
              title="Minimize"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Plan Status</span>
              <button
                onClick={togglePro}
                className={`text-xs px-2 py-1 rounded font-bold transition-colors ${
                  isPro 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-[0_0_10px_rgba(251,191,36,0.5)]' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {isPro ? 'PRO' : 'FREE'}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              <span className="text-sm font-medium">Usage Limit</span>
              <button
                onClick={resetUsage}
                className="text-xs px-2 py-1 rounded font-bold bg-gray-700 text-gray-300 hover:bg-white hover:text-black transition-colors"
              >
                RESET
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              <span className="text-sm font-medium">Demo Data</span>
              <button
                onClick={simulateRegisteredUser}
                className="text-xs px-2 py-1 rounded font-bold bg-blue-900/40 text-blue-300 hover:bg-blue-600 hover:text-white transition-colors border border-blue-900/50"
              >
                SET
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              <span className="text-sm font-medium">App Data</span>
              <button
                onClick={resetProfile}
                className="text-xs px-2 py-1 rounded font-bold bg-red-900/40 text-red-300 hover:bg-red-600 hover:text-white transition-colors border border-red-900/50"
                title="Reset to Guest Mode (Clear Profile)"
              >
                CLEAR
              </button>
            </div>
          </div>
          
          <div className="mt-2 text-[10px] text-gray-500 leading-tight select-none pt-2 border-t border-gray-800">
            Drag to move.
          </div>
        </>
      )}
    </div>,
    document.body
  );
};

export default DevTools;
