"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface AnimatedCounterProps {
    value: number;
    suffix?: string;
    duration?: number;
}

export default function AnimatedCounter({
    value,
    suffix = "",
    duration = 2
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 50,
        duration: duration * 1000,
    });
    const isInView = useInView(ref, { once: true, margin: "0px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toLocaleString();
            }
        });
    }, [springValue]);

    return (
        <span className="inline-flex items-baseline">
            <span ref={ref} className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-navy to-charcoal bg-clip-text text-transparent">
                0
            </span>
            {suffix && (
                <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-navy to-charcoal bg-clip-text text-transparent ml-1">
                    {suffix}
                </span>
            )}
        </span>
    );
}
