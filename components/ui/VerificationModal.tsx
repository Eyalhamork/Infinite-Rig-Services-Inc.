"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Mail } from "lucide-react";
import { useEffect } from "react";

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    type?: "success" | "email";
}

export default function VerificationModal({
    isOpen,
    onClose,
    title,
    message,
    actionLabel = "Continue",
    onAction,
    type = "success",
}: VerificationModalProps) {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleAction = () => {
        if (onAction) {
            onAction();
        }
        onClose();
    };

    const isEmail = type === "email";
    const Icon = isEmail ? Mail : Check;
    const gradient = isEmail
        ? "from-blue-500 to-blue-600"
        : "from-green-500 to-emerald-600";
    const shadowColor = isEmail ? "text-blue-500" : "text-green-500";
    const glowColor = isEmail ? "bg-blue-500/30" : "bg-green-500/30";

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                            className="relative w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20"
                        >
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-navy-900">
                                <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900 opacity-90"></div>
                                <div className={`absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 ${glowColor} rounded-full blur-[50px]`}></div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="relative pt-16 px-8 pb-10 text-center">
                                {/* Icon Circle */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 15,
                                        delay: 0.1,
                                    }}
                                    className={`w-24 h-24 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl border-[6px] border-white relative z-10`}
                                >
                                    <Icon className="w-10 h-10 text-white stroke-[2.5]" />
                                </motion.div>

                                {/* Content */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4 tracking-tight">
                                        {title}
                                    </h3>
                                    <p className="text-gray-500 mb-8 leading-relaxed text-lg">
                                        {message}
                                    </p>

                                    <button
                                        onClick={handleAction}
                                        className="w-full bg-navy-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-navy-900/20 hover:bg-navy-800 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                                    >
                                        {actionLabel}
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
