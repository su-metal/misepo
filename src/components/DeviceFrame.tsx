import React from 'react';

interface DeviceFrameProps {
    children?: React.ReactNode;
    className?: string;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, className = "" }) => {
    return (
        <div className={`relative w-[375px] h-[812px] mx-auto ${className}`}>
            {/* Outer styling for the phone body */}
            <div className="w-full h-full bg-slate-900 rounded-[3.5rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden ring-4 ring-slate-900/10 relative">

                {/* The Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-36 bg-slate-900 rounded-b-2xl z-50 pointer-events-none" />

                {/* Screen Area */}
                <div className="w-full h-full bg-white relative flex flex-col overflow-hidden">
                    {children}
                </div>
            </div>

            {/* Side buttons (Volume/Power) - purely cosmetic */}
            <div className="absolute top-32 -left-[10px] w-[2px] h-8 bg-slate-800 rounded-l-md" />
            <div className="absolute top-44 -left-[10px] w-[2px] h-12 bg-slate-800 rounded-l-md" />
            <div className="absolute top-40 -right-[10px] w-[2px] h-16 bg-slate-800 rounded-r-md" />
        </div>
    );
};
