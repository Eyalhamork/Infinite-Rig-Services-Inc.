"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
    Shield,
    AlertTriangle,
    FileCheck,
    Users,
    CheckCircle2,
    Award,
    Clock,
    ArrowRight,
    ClipboardCheck,
    GraduationCap,
    HeartPulse,
    HardHat,
    Flame,
    Search,
    TrendingUp,
} from "lucide-react";

export default function HSEConsultingPage() {
    const capabilities = [
        {
            icon: Search,
            title: "Audits & Assessments",
            description:
                "Comprehensive gap analysis and risk assessments to identify vulnerabilities before they become incidents.",
            features: [
                "ISO 45001 Gap Analysis",
                "Regulatory Compliance",
                "Process Safety Audits",
                "Environmental Impact",
            ],
            gradient: "from-red-500 to-rose-600",
        },
        {
            icon: GraduationCap,
            title: "Training Academy",
            description:
                "Building competency through accredited safety training programs tailored to offshore environments.",
            features: [
                "BOSIET/HUET Prep",
                "Permit to Work Systems",
                "Advanced First Aid",
                "Incident Command",
            ],
            gradient: "from-rose-500 to-red-700",
        },
        {
            icon: FileCheck,
            title: "Management Systems",
            description:
                "Design and implementation of robust HSE-MS frameworks aligned with IOGP and ISO standards.",
            features: [
                "Policy Development",
                "KPI Dashboarding",
                "Manuals & Procedures",
                "System Integration",
            ],
            gradient: "from-orange-500 to-red-600",
        },
        {
            icon: HeartPulse,
            title: "Health & Hygiene",
            description:
                "Occupational health strategies to protect your workforce from physical, chemical, and biological hazards.",
            features: [
                "Medical Emergency Plans",
                "Industrial Hygiene",
                "Fatigue Management",
                "Health Surveillance",
            ],
            gradient: "from-red-600 to-orange-700",
        },
    ];

    const stats = [
        { value: "0", label: "Target Incidents", icon: Shield },
        { value: "100%", label: "Compliance Rate", icon: CheckCircle2 },
        { value: "ISO", label: "45001 Certified", icon: Award },
        { value: "24/7", label: "Emergency Support", icon: Clock },
    ];

    const process = [
        {
            step: "01",
            title: "Diagnose",
            description:
                "We evaluate your current safety culture and systems against global best practices.",
            icon: Search,
        },
        {
            step: "02",
            title: "Design",
            description:
                "Developing tailored strategies and management systems that fit your operational reality.",
            icon: FileCheck,
        },
        {
            step: "03",
            title: "Implement",
            description:
                "Rolling out programs with hands-on training and leadership coaching to ensure adoption.",
            icon: Users,
        },
        {
            step: "04",
            title: "Sustain",
            description:
                "Continuous monitoring and improvement to maintain peak safety performance.",
            icon: Shield,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Premium Hero Section */}
            <section className="relative pt-40 pb-32 overflow-hidden bg-navy-900 before:absolute before:inset-0 before:bg-[url('/bg-pattern.svg')] before:opacity-5 before:z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-red-950 to-black opacity-95 z-0"></div>

                {/* Animated Orbs - Red Theme */}
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[128px] animate-pulse z-0 mix-blend-screen"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[128px] animate-pulse delay-1000 z-0 mix-blend-screen"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 mb-8"
                            >
                                <Shield className="h-4 w-4 text-red-500" />
                                <span className="text-sm font-medium text-gray-200 tracking-wide uppercase">
                                    Safety First
                                </span>
                            </motion.div>
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight text-white">
                                Zero Compromise <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-orange-500">
                                    on Safety
                                </span>
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-xl font-light">
                                Building world-class safety cultures that protect your most valuable assets: your people and your reputation.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/contact"
                                    className="bg-red-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-red-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                                >
                                    Request Audit
                                </Link>
                                <div className="flex items-center space-x-4 px-6 py-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                                    <div className="flex -space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-navy-900 relative flex items-center justify-center text-[10px] font-bold text-white">
                                            <Flame className="w-4 h-4" />
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-navy-900 relative flex items-center justify-center text-[10px] font-bold text-white">
                                            <AlertTriangle className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-300 font-medium">
                                        Risk Assessment Ready
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group">
                                <Image
                                    src="/images/services/offshore-safety-premium.png"
                                    alt="Offshore Safety"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-transparent to-transparent"></div>

                                {/* Floating Card */}
                                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5 text-red-500" />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold">
                                                    Safety Standard
                                                </div>
                                                <div className="text-red-400 text-xs font-bold uppercase tracking-wider">
                                                    Gold Class
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 w-[99%]"></div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                                        <span>Compliance Score</span>
                                        <span>99.9%</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="relative z-20 -mt-10 mb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200 border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-xl mb-3">
                                    <stat.icon className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="text-3xl font-bold text-navy-900 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Capabilities */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <span className="text-red-600 font-bold text-sm uppercase tracking-widest bg-red-50 px-4 py-2 rounded-full">
                            HSE Expertise
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mt-6 mb-6">
                            Holistic Safety Solutions
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                            We go beyond compliance to create safety ecosystems that drive efficiency and operational excellence.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                        {capabilities.map((capability, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
                            >
                                <div
                                    className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${capability.gradient} opacity-5 rounded-bl-full -mr-16 -mt-16 transition-opacity group-hover:opacity-10`}
                                ></div>

                                <div
                                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${capability.gradient} flex items-center justify-center mb-8 shadow-md group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <capability.icon className="h-8 w-8 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold text-navy-900 mb-4 group-hover:text-red-700 transition-colors">
                                    {capability.title}
                                </h3>
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    {capability.description}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                                    {capability.features.map((feature, j) => (
                                        <div
                                            key={j}
                                            className="flex items-center space-x-3 text-sm font-medium text-gray-700"
                                        >
                                            <div
                                                className={`w-2 h-2 rounded-full bg-gradient-to-r ${capability.gradient}`}
                                            ></div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visual Feature Section - Dark Mode */}
            <section className="py-32 bg-navy-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-red-950/20 to-navy-900"></div>
                {/* Background Overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-30"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-red-500 font-bold text-sm uppercase tracking-widest mb-4 block">
                                Risk Management
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                                Proactive <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
                                    Hazard Mitigation
                                </span>
                            </h2>

                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                        <TrendingUp className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">Predictive Safety</h4>
                                        <p className="text-gray-400 leading-relaxed">Utilizing leading indicators to anticipate and prevent incidents before they occur.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                        <FileCheck className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">Audit Trails</h4>
                                        <p className="text-gray-400 leading-relaxed">Comprehensive digital documentation ensuring full transparency and regulatory audit readiness.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                <Image src="/images/services/offshore-hero.png" alt="Safety Inspection" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent"></div>
                                <div className="absolute bottom-8 left-8">
                                    <div className="bg-red-600/90 backdrop-blur-md p-4 rounded-xl inline-flex items-center gap-3">
                                        <AlertTriangle className="text-white w-6 h-6" />
                                        <p className="text-white font-bold">Hazard Identified & Mitigated</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Process Steps */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-red-600 font-semibold text-sm uppercase tracking-wide">
                            The Methodology
                        </span>
                        <h2 className="text-4xl font-bold text-navy-900 mt-2">Consulting Workflow</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {process.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="relative"
                            >
                                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-full hover:shadow-xl transition-shadow duration-300">
                                    <div className="text-5xl font-bold text-gray-100 mb-6 absolute top-4 right-6 select-none">
                                        {item.step}
                                    </div>
                                    <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6 text-red-600 relative z-10 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                                        <item.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-navy-900 mb-3 relative z-10">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                                        {item.description}
                                    </p>
                                </div>
                                {i < process.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                                        <ArrowRight className="h-6 w-6 text-gray-300" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-red-900 via-orange-900 to-black text-white relative overflow-hidden">
                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">
                        Elevate Your Safety Standards
                    </h2>
                    <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-300 font-light">
                        Contact our certified experts to discuss how we can help you achieve zero-incident operations.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            href="/contact"
                            className="bg-white text-red-900 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
                        >
                            Consult with Experts
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
