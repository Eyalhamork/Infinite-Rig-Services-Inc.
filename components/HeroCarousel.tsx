"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Play,
    Pause,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { heroServices } from "@/lib/data/services";

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};


export default function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const slideDuration = 5000; // 5 seconds

    // Handle auto-advance
    useEffect(() => {
        if (isPlaying && !isHovered) {
            timerRef.current = setInterval(() => {
                handleNext();
            }, slideDuration);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, isHovered, currentIndex]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % heroServices.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + heroServices.length) % heroServices.length);
    };

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div
            className="relative h-screen min-h-[600px] w-full overflow-hidden bg-navy"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);
                        if (swipe < -swipeConfidenceThreshold) {
                            handleNext();
                        } else if (swipe > swipeConfidenceThreshold) {
                            handlePrev();
                        }
                    }}
                >
                    {/* Background Layer */}
                    <div className="absolute inset-0">
                        {/* Fallback Gradient if image fails or while loading */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${heroServices[currentIndex].gradient} opacity-50`} />

                        {/* Actual Background Image */}
                        {heroServices[currentIndex].image && (
                            <Image
                                src={heroServices[currentIndex].image}
                                alt={heroServices[currentIndex].title}
                                fill
                                className="object-cover mix-blend-overlay opacity-60"
                                priority
                            />
                        )}

                        {/* Dark Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40" />

                        {/* Pattern Overlay */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
                        <div className="max-w-5xl">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="flex flex-col items-center"
                            >
                                {/* Service Tag */}
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20 backdrop-blur-sm mb-8`}>
                                    {(() => {
                                        const Icon = heroServices[currentIndex].icon;
                                        return <Icon className="w-4 h-4 mr-2" />;
                                    })()}
                                    {heroServices[currentIndex].badge}
                                </span>

                                {/* Title */}
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
                                    {heroServices[currentIndex].title}
                                </h1>

                                {/* Description */}
                                <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                                    {heroServices[currentIndex].description}
                                </p>

                                {/* CTA Button */}
                                <Link
                                    href={heroServices[currentIndex].link}
                                    className="group inline-flex items-center bg-white text-navy px-10 py-5 rounded-full text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl shadow-black/20 hover:scale-105"
                                >
                                    Explore Service
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls Container - Premium Glassmorphism */}
            <div className="absolute bottom-4 left-0 right-0 z-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-6">

                    {/* Navigation & Play/Pause Controls */}
                    <div className="flex items-center space-x-6 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
                        <button
                            onClick={togglePlay}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all"
                            aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
                        >
                            {isPlaying ? (
                                <Pause className="w-5 h-5 fill-current" />
                            ) : (
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                            )}
                        </button>

                        <div className="h-6 w-px bg-white/20"></div>

                        <button
                            onClick={handlePrev}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        {/* Dots in the middle of arrows */}
                        <div className="flex items-center space-x-2 px-2">
                            {heroServices.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDotClick(index)}
                                    className={`h-2 rounded-full transition-all duration-500 ${index === currentIndex
                                        ? "w-8 bg-white"
                                        : "w-2 bg-white/40 hover:bg-white/60"
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
