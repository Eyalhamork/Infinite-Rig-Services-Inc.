"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookie-consent", "true");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
                >
                    <div className="container mx-auto">
                        <div className="bg-[#0A0A12]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                            <div className="flex flex-col md:flex-row items-center justify-between p-6 md:px-10 gap-6">
                                <div className="flex items-center space-x-5 text-left">
                                    <div className="hidden sm:flex w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center flex-shrink-0 border border-primary/20">
                                        <Cookie className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg mb-1">Cookie Preferences</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                                            We use cookies to optimize site functionality and give you the best possible experience.
                                            By clicking "Accept", you agree to our use of cookies as described in our
                                            <Link href="/cookie-policy" className="text-primary hover:text-orange-400 transition-colors mx-1 font-medium">
                                                Cookie Policy
                                            </Link>.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                                    <button
                                        onClick={acceptCookies}
                                        className="w-full sm:w-auto bg-primary hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center group whitespace-nowrap"
                                    >
                                        Accept All
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="absolute top-4 right-4 md:static p-2 text-gray-500 hover:text-white transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
