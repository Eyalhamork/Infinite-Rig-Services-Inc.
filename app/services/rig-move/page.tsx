"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
    Compass,
    Ship,
    Anchor,
    Navigation,
    Shield,
    Users,
    CheckCircle2,
    Award,
    Clock,
    TrendingUp,
    FileCheck,
    Settings,
    Target,
    ArrowRight,
    AlertTriangle,
    MapPin,
    Globe,
    Waves,
} from "lucide-react";

export default function RigMovePage() {
    const capabilities = [
        {
            icon: Navigation,
            title: "Rig Relocation Services",
            description:
                "Complete planning and execution of rig moves, ensuring safe transport of drilling rigs and platforms to new locations within territorial waters.",
            features: [
                "Route Planning & Optimization",
                "Weather Window Analysis",
                "Permit Coordination",
                "Rig Preparation & Securing",
            ],
            gradient: "from-cyan-500 to-cyan-700",
        },
        {
            icon: Ship,
            title: "Marine Towage Operations",
            description:
                "Professional marine towage services with experienced crews and modern vessels for safe, efficient transportation of offshore assets.",
            features: [
                "Deep Sea Towing",
                "Coastal Towage",
                "Escort Services",
                "Emergency Response",
            ],
            gradient: "from-blue-500 to-blue-700",
        },
        {
            icon: Anchor,
            title: "Anchor Handling",
            description:
                "Expert anchor handling vessel (AHV) operations for positioning, mooring, and station-keeping of drilling units and floating platforms.",
            features: [
                "Anchor Deployment",
                "Mooring Systems",
                "Chain Handling",
                "Pre-Lay Surveys",
            ],
            gradient: "from-teal-500 to-teal-700",
        },
        {
            icon: FileCheck,
            title: "Maritime Compliance",
            description:
                "Full regulatory compliance support ensuring all rig moves meet international maritime standards and territorial water entry requirements.",
            features: [
                "Port State Requirements",
                "Flag State Compliance",
                "Customs Coordination",
                "Safety Documentation",
            ],
            gradient: "from-cyan-600 to-blue-700",
        },
    ];

    const services = [
        "Jack-up rig relocations",
        "Semi-submersible towing",
        "FPSO positioning support",
        "Platform decommissioning transport",
        "Pipe-lay vessel support",
        "Heavy lift vessel operations",
        "Offshore installation tows",
        "Territorial water entries",
        "Port approach coordination",
        "Emergency towing services",
    ];

    const stats = [
        { value: "150+", label: "Rigs Relocated", icon: Target },
        { value: "100%", label: "Safe Delivery", icon: Award },
        { value: "24/7", label: "Operations Center", icon: Clock },
        { value: "Global", label: "Coverage", icon: Globe },
    ];

    const process = [
        {
            step: "01",
            title: "Planning & Survey",
            description:
                "Comprehensive route planning, weather analysis, and pre-move surveys to ensure optimal tow routes and timing.",
            icon: MapPin,
        },
        {
            step: "02",
            title: "Preparation",
            description:
                "Rig securing, ballasting, vessel mobilization, and coordination with port authorities and flag states.",
            icon: Settings,
        },
        {
            step: "03",
            title: "Execution",
            description:
                "Professional towing operations with 24/7 monitoring, weather routing, and real-time position tracking.",
            icon: Navigation,
        },
        {
            step: "04",
            title: "Positioning",
            description:
                "Precise rig positioning, anchor deployment, and final station-keeping at the destination location.",
            icon: Anchor,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Premium Hero Section */}
            <section className="relative pt-40 pb-32 overflow-hidden bg-navy-900 before:absolute before:inset-0 before:bg-[url('/bg-pattern.svg')] before:opacity-5 before:z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-cyan-950 to-primary-950 opacity-95 z-0"></div>

                {/* Animated Orbs */}
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[128px] animate-pulse z-0 mix-blend-screen"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[128px] animate-pulse delay-1000 z-0 mix-blend-screen"></div>

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
                                <Compass className="h-4 w-4 text-gold" />
                                <span className="text-sm font-medium text-gray-200 tracking-wide uppercase">
                                    Service Capability
                                </span>
                            </motion.div>
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight text-white">
                                Rig Move & <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-cyan-400">
                                    Marine Towage
                                </span>
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-xl font-light">
                                Specialized marine towage and rig relocation services for safely
                                transporting drilling rigs into territorial waters with full
                                regulatory compliance.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/contact"
                                    className="bg-gold text-navy-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                                >
                                    Request Rig Move Quote
                                </Link>
                                <div className="flex items-center space-x-4 px-6 py-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-navy-900 relative flex items-center justify-center text-[10px] font-bold text-white">
                                                <Ship className="w-4 h-4" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-300 font-medium">Expert Marine Teams</span>
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
                                    src="/images/hero-rig-move.png"
                                    alt="Rig Move Operations"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-transparent to-transparent"></div>

                                {/* Floating Card */}
                                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <Navigation className="w-5 h-5 text-green-400" />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold">Tow Status</div>
                                                <div className="text-green-400 text-xs font-bold uppercase tracking-wider">On Schedule</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-white">150+</div>
                                            <div className="text-gray-400 text-xs">Rigs Moved</div>
                                        </div>
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
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-50 rounded-xl mb-3">
                                    <stat.icon className="h-6 w-6 text-cyan-600" />
                                </div>
                                <div className="text-3xl font-bold text-navy-900 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Capabilities */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <span className="text-cyan-600 font-bold text-sm uppercase tracking-widest bg-cyan-50 px-4 py-2 rounded-full">
                            Our Capabilities
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mt-6 mb-6">
                            Complete Rig Move Solutions
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                            From planning to positioning, we handle every aspect of your rig
                            relocation with precision and expertise.
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
                                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${capability.gradient} opacity-5 rounded-bl-full -mr-16 -mt-16 transition-opacity group-hover:opacity-10`}></div>

                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${capability.gradient} flex items-center justify-center mb-8 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                    <capability.icon className="h-8 w-8 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold text-navy-900 mb-4 group-hover:text-cyan-700 transition-colors">
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
                                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${capability.gradient}`}></div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visual Feature Section */}
            <section className="py-32 bg-navy-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-cyan-950"></div>
                <div className="absolute inset-0 opacity-10">
                    <Image src="/images/services/offshore-operations.png" alt="Background" fill className="object-cover" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-gold font-bold text-sm uppercase tracking-widest mb-4 block">Territorial Water Entry</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                                Safe Passage Into <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">Your Waters</span>
                            </h2>

                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                        <Globe className="w-6 h-6 text-gold" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">International Expertise</h4>
                                        <p className="text-gray-400 leading-relaxed">
                                            Experienced in navigating complex international maritime regulations and coordinating with port authorities across West Africa and beyond.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                        <Shield className="w-6 h-6 text-gold" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">Safety First Approach</h4>
                                        <p className="text-gray-400 leading-relaxed">
                                            Every rig move is planned with safety as the top priority, with comprehensive risk assessments and contingency planning.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                                        <Waves className="w-6 h-6 text-gold" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">Weather Routing</h4>
                                        <p className="text-gray-400 leading-relaxed">
                                            Advanced weather forecasting and route optimization to ensure safe passages and minimize transit times.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div className="space-y-4 mt-12">
                                <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl">
                                    <Image src="/images/services/offshore-operations.png" alt="Marine Towage" fill className="object-cover hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="relative h-48 rounded-2xl overflow-hidden shadow-2xl bg-cyan-900/30 border border-white/10 p-6">
                                    <h3 className="text-3xl font-bold text-white mb-2">150+</h3>
                                    <p className="text-gray-300 text-sm">Successful Rig Moves</p>
                                    <div className="absolute bottom-4 right-4 text-white/10">
                                        <Ship className="w-16 h-16" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="relative h-48 rounded-2xl overflow-hidden shadow-2xl bg-gold/10 border border-gold/20 p-6 flex flex-col justify-end">
                                    <h3 className="text-xl font-bold text-gold mb-1">100%</h3>
                                    <p className="text-gold/80 text-sm">Safe Delivery Record</p>
                                </div>
                                <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
                                    <Image src="/images/services/offshore-hero.png" alt="Rig Operations" fill className="object-cover hover:scale-110 transition-transform duration-700" />
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
                        <span className="text-cyan-600 font-semibold text-sm uppercase tracking-wide">Our Methodology</span>
                        <h2 className="text-4xl font-bold text-navy-900 mt-2">Rig Move Process</h2>
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
                                    <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6 text-cyan-600 relative z-10">
                                        <item.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-navy-900 mb-3 relative z-10">{item.title}</h3>
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
            <section className="py-24 bg-gradient-to-br from-cyan-900 via-blue-900 to-primary-950 text-white relative overflow-hidden">
                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">
                        Ready to Relocate <br /> Your Rig?
                    </h2>
                    <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-300 font-light">
                        Partner with us for safe, efficient rig moves into your territorial waters
                        with full regulatory compliance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            href="/contact"
                            className="bg-primary text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                        >
                            Request Rig Move Quote
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
