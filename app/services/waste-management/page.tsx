"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
    Trash2,
    Recycle,
    ShieldCheck,
    Truck,
    Leaf,
    Factory,
    CheckCircle2,
    ArrowRight,
    AlertTriangle,
    FileCheck,
} from "lucide-react";

export default function WasteManagementPage() {
    const features = [
        {
            icon: AlertTriangle,
            title: "Hazardous Waste Handling",
            desc: "Safe collection, transport, and disposal of hazardous materials in compliance with international environmental standards.",
        },
        {
            icon: Recycle,
            title: "Recycling & Recovery",
            desc: "Comprehensive recycling programs designed to minimize environmental impact and maximize resource recovery.",
        },
        {
            icon: Truck,
            title: "Transport & Logistics",
            desc: "Specialized fleet for the safe and efficient transportation of all waste types from offshore and onshore sites.",
        },
        {
            icon: FileCheck,
            title: "Compliance & Reporting",
            desc: "Full regulatory compliance management and detailed environmental reporting for your operations.",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-navy-900">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-green-900 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-5 mix-blend-overlay"></div>

                {/* Animated Orbs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-[128px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px] animate-pulse delay-700"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 mb-6">
                                <Leaf className="h-4 w-4 text-green-400" />
                                <span className="text-sm font-medium text-green-100 tracking-wide uppercase">Sustainable Solutions</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                Integrated <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Waste Management</span> Services
                            </h1>
                            <p className="text-xl text-gray-300 mb-8 leading-relaxed font-light">
                                Delivering environmentally responsible waste management solutions for the offshore and oil & gas industries. We prioritize sustainability, compliance, and operational efficiency.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/contact"
                                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all transform hover:-translate-y-1"
                                >
                                    Request Consultation
                                </Link>
                                <Link
                                    href="/quote"
                                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold backdrop-blur-sm transition-all transform hover:-translate-y-1"
                                >
                                    Get a Quote
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 h-[500px]">
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent z-10"></div>
                                <Image
                                    src="/images/services/waste-management-hero.png"
                                    alt="Offshore Waste Management Operations"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Floating Stats Card */}
                            <div className="absolute -bottom-10 -left-10 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-xl z-20 max-w-xs">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-green-500 rounded-xl text-white">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">EPA Compliant</h3>
                                        <p className="text-green-200 text-sm">Fully Certified</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Adhering to the strictest environmental regulations and best practices.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-green-600 font-bold tracking-widest uppercase text-sm">Our Capabilities</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-navy-900 mt-3 mb-6">Comprehensive Waste Solutions</h2>
                        <p className="text-lg text-gray-600">
                            From hazardous material handling to routine waste disposal, we provide end-to-end management tailored to your operational needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl border border-gray-100 hover:border-green-100 transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-navy-900 mb-4 group-hover:text-green-700 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-8">
                                The Infinite Approach to <span className="text-green-400">Sustainability</span>
                            </h2>
                            <div className="space-y-8">
                                {[
                                    {
                                        step: "01",
                                        title: "Assessment & Planning",
                                        desc: "We analyze your waste streams to develop a customized management plan.",
                                    },
                                    {
                                        step: "02",
                                        title: "Safe Collection & Transport",
                                        desc: " utilizing specialized equipment and certified personnel for safe handling.",
                                    },
                                    {
                                        step: "03",
                                        title: "Treatment & Disposal",
                                        desc: "Prioritizing recycling and recovery before safe, compliant disposal.",
                                    },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-6">
                                        <span className="text-4xl font-bold text-white/10 font-display">{item.step}</span>
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                            <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-10 shadow-2xl">
                                <div className="flex flex-col items-center text-center">
                                    <Factory className="w-20 h-20 text-white/80 mb-6" />
                                    <h3 className="text-2xl font-bold mb-4">Zero Waste Goals?</h3>
                                    <p className="text-green-100 mb-8">
                                        Partner with us to achieve your environmental sustainability targets and reduce your carbon footprint.
                                    </p>
                                    <Link href="/contact" className="bg-white text-green-800 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                                        Start the Conversation <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
