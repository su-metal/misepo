"use client";
import React, { useState, useEffect, useRef } from 'react';

export const CountUp = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
    const [count, setCount] = useState(0);
    const nodeRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    let startTime: number;
                    let animationFrame: number;

                    const animate = (timestamp: number) => {
                        if (!startTime) startTime = timestamp;
                        const progress = timestamp - startTime;
                        const percentage = Math.min(progress / duration, 1);

                        // Ease out quart
                        const easeOut = 1 - Math.pow(1 - percentage, 4);

                        setCount(Math.floor(end * easeOut));

                        if (progress < duration) {
                            animationFrame = requestAnimationFrame(animate);
                        } else {
                            setCount(end);
                        }
                    };

                    animationFrame = requestAnimationFrame(animate);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (nodeRef.current) {
            observer.observe(nodeRef.current);
        }

        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={nodeRef}>{count}</span>;
}
