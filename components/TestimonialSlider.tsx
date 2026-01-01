"use client";

import { useState, useEffect, TouchEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

// Testimonial Data
const testimonials = [
    {
        quote: "Infinite Rig Services has been instrumental in supporting our offshore operations. Their professionalism and commitment to safety standards are unmatched in the region.",
        author: "James Wilson",
        role: "Operations Director",
        company: "Major Oil & Gas Company",
        rating: 5,
        initials: "JW"
    },
    {
        quote: "Their supply chain efficiency has reduced our operational downtime significantly. A reliable partner for all our procurement and logistics needs.",
        author: "Sarah Chen",
        role: "Procurement Manager",
        company: "International Energy Corp",
        rating: 5,
        initials: "SC"
    },
    {
        quote: "The quality of personnel they provide is exceptional. Their training programs ensure we always have certified, competent teams on our platforms.",
        author: "Michael Osei",
        role: "HR Director",
        company: "Offshore Drilling Contractor",
        rating: 5,
        initials: "MO"
    },
    {
        quote: "Exceptional service delivery and quick response times. They truly understand the urgency of offshore operations.",
        author: "David Mensah",
        role: "Technical Superintendent",
        company: "West African Petroleum",
        rating: 5,
        initials: "DM"
    },
    {
        quote: "We appreciate their dedication to environmental compliance. Their HSE consulting services have been vital for our sustainability goals.",
        author: "Elena Rodriguez",
        role: "Sustainability Manager",
        company: "EcoEnergy Solutions",
        rating: 5,
        initials: "ER"
    }
];

export default function TestimonialSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            handleNext();
        }
        if (isRightSwipe) {
            handlePrev();
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, []); // Run effect only once on mount, state updates inside handleNext are functional

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const getCardProps = (index: number) => {
        const length = testimonials.length;
        // Calculate shortest distance in a circle
        let offset = (index - currentIndex + length) % length;
        if (offset > length / 2) offset -= length;

        // Determine position state
        if (offset === 0) return "center";
        if (offset === 1) return "right";
        if (offset === -1) return "left";
        return "hidden";
    };

    const variants = {
        center: {
            x: "0%",
            scale: 1,
            zIndex: 20,
            opacity: 1,
            filter: "blur(0px)",
            rotateY: 0,
        },
        left: {
            x: "-60%", // Pull to the left
            scale: 0.8,
            zIndex: 10,
            opacity: 0.6,
            filter: "blur(0px)", // Optional blur
            rotateY: 0,
        },
        right: {
            x: "60%", // Pull to the right
            scale: 0.8,
            zIndex: 10,
            opacity: 0.6,
            filter: "blur(0px)",
            rotateY: 0,
        },
        hidden: {
            x: "0%",
            scale: 0.5,
            zIndex: 0,
            opacity: 0,
            filter: "blur(10px)",
        }
    };

    return (
        <div
            className="relative w-full max-w-7xl mx-auto px-4 overflow-hidden py-10"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Decorative Quote Icon background - Centered */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] text-navy z-0">
                <Quote className="w-96 h-96 rotate-180" />
            </div>

            {/* Slider Container */}
            <div className="relative h-[450px] md:h-[400px] flex items-center justify-center">
                {testimonials.map((item, index) => {
                    const position = getCardProps(index);
                    const isCenter = position === "center";

                    return (
                        <motion.div
                            key={index}
                            variants={variants}
                            initial="hidden"
                            animate={position}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 25,
                                duration: 0.5
                            }}
                            className="absolute w-full max-w-2xl px-4 cursor-pointer"
                            onClick={() => {
                                if (position === 'left') handlePrev();
                                if (position === 'right') handleNext();
                            }}
                        >
                            <div
                                className={`bg-white rounded-3xl p-8 md:p-12 border transition-all duration-300 relative overflow-hidden
                  ${isCenter
                                        ? "shadow-2xl border-gray-100 ring-1 ring-black/5"
                                        : "shadow-lg border-gray-50 bg-gray-50/80 grayscale-[0.5] hover:grayscale-0"
                                    }
                `}
                            >
                                {/* Top Accent Gradient (Only for center card) */}
                                {isCenter && (
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-orange-500" />
                                )}

                                {/* Content */}
                                <div className="text-center relative z-10">
                                    {/* Stars */}
                                    <div className="flex justify-center mb-6 space-x-1">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <Star key={i} className={`w-5 h-5 ${isCenter ? "text-gold fill-gold" : "text-gray-300 fill-gray-300"}`} />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <blockquote
                                        className={`font-medium leading-relaxed mb-8 transition-colors duration-300
                      ${isCenter ? "text-xl md:text-2xl text-navy" : "text-lg text-gray-500 line-clamp-3"}
                    `}
                                    >
                                        "{item.quote}"
                                    </blockquote>

                                    {/* Author Info */}
                                    <div className="flex items-center justify-center space-x-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md transition-colors duration-300
                        ${isCenter ? "bg-gradient-to-br from-navy to-charcoal" : "bg-gray-300"}
                    `}>
                                            {item.initials}
                                        </div>
                                        <div className="text-left">
                                            <div className={`font-bold text-lg transition-colors duration-300 ${isCenter ? "text-navy" : "text-gray-600"}`}>
                                                {item.author}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {item.role}
                                            </div>
                                            <div className={`text-xs font-medium uppercase tracking-wide mt-0.5 transition-colors duration-300 ${isCenter ? "text-primary" : "text-gray-400"}`}>
                                                {item.company}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center mt-4 space-x-6 z-20 relative">
                <button
                    onClick={handlePrev}
                    className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-navy hover:text-white hover:border-navy transition-all shadow-sm hover:shadow-lg active:scale-95"
                    aria-label="Previous testimonial"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Indicators */}
                <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-primary" : "w-1.5 bg-gray-300 hover:bg-gray-400"
                                }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-navy hover:text-white hover:border-navy transition-all shadow-sm hover:shadow-lg active:scale-95"
                    aria-label="Next testimonial"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
