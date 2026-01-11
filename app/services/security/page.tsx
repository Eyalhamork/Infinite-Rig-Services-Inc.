"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
    ShieldAlert,
    Shield,
    Lock,
    Eye,
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
    Radio,
    Siren,
    UserCheck,
    MapPin,
} from "lucide-react";

export default function SecurityServicesPage() {
    const capabilities = [
        {
            icon: ShieldAlert,
            title: "Armed Guard Services",
            description:
                "Highly trained armed security personnel for vessels and offshore installations, providing 24/7 protection against maritime threats including piracy and armed robbery.",
            features: [
                "Trained Armed Guards",
                "Vessel Escort Teams",
                "Platform Security",
                "Transit Protection",
            ],
            gradient: "from-slate-500 to-slate-700",
        },
        {
            icon: Lock,
            title: "Anti-Piracy Protection",
            description:
                "Comprehensive anti-piracy measures including risk assessments, security equipment, and trained response teams to protect your assets in high-risk waters.",
            features: [
                "Piracy Risk Assessment",
                "Secure Transit Planning",
                "Citadel Procedures",
                "Emergency Response",
            ],
            gradient: "from-gray-600 to-gray-800",
        },
        {
            icon: Eye,
            title: "Threat Assessment",
            description:
                "Expert intelligence analysis and threat assessments to identify risks and develop tailored security strategies for your specific operations.",
            features: [
                "Intelligence Analysis",
                "Route Risk Mapping",
                "Threat Monitoring",
                "Security Briefings",
            ],
            gradient: "from-zinc-500 to-zinc-700",
        },
        {
            icon: Users,
            title: "Security Personnel",
            description:
                "Deployment of qualified security professionals with military and law enforcement backgrounds, fully certified for maritime security operations.",
            features: [
                "STCW Certified",
                "Military Veterans",
                "Crisis Management",
                "First Aid Trained",
            ],
            gradient: "from-slate-600 to-gray-700",
        },
    ];

    const services = [
        "Armed vessel protection teams",
        "Offshore platform security",
        "High-risk transit escorts",
        "Security equipment supply",
        "Anti-terrorism measures",
        "Port security assessments",
        "Security awareness training",
        "Voyage security planning",
        "Crisis response teams",
        "Post-incident investigations",
    ];

    const stats = [
        { value: "0", label: "Security Incidents", icon: Target },
        { value: "500+", label: "Voyages Protected", icon: Award },
        { value: "24/7", label: "Operations Center", icon: Clock },
        { value: "100%", label: "ISPS Compliance", icon: Shield },
    ];

    const process = [
        {
            step: "01",
            title: "Risk Assessment",
            description:
                "Comprehensive analysis of voyage routes, threat levels, and security requirements specific to your operation.",
            icon: AlertTriangle,
        },
        {
            step: "02",
            title: "Team Deployment",
            description:
                "Mobilization of qualified armed security teams with appropriate equipment and documentation.",
            icon: UserCheck,
        },
        {
            step: "03",
            title: "Active Protection",
            description:
                "24/7 security presence with continuous threat monitoring, communication, and rapid response capability.",
            icon: ShieldAlert,
        },
        {
            step: "04",
            title: "Reporting & Debrief",
            description:
                "Comprehensive post-voyage reporting, incident analysis, and security recommendations.",
            icon: FileCheck,
        },
    ];

    const highRiskAreas = [
        { region: "Gulf of Guinea", threat: "Very High", color: "bg-red-500" },
        { region: "Somali Basin", threat: "High", color: "bg-orange-500" },
        { region: "Strait of Hormuz", threat: "Elevated", color: "bg-yellow-500" },
        { region: "Singapore Strait", threat: "Moderate", color: "bg-blue-500" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Premium Hero Section */}
            <section className="relative pt-40 pb-32 overflow-hidden bg-navy-900 before:absolute before:inset-0 before:bg-[url('/bg-pattern.svg')] before:opacity-5 before:z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-slate-900 to-primary-950 opacity-95 z-0"></div>

                {/* Animated Orbs */}
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-slate-600/20 rounded-full blur-[128px] animate-pulse z-0 mix-blend-screen"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-500/10 rounded-full blur-[128px] animate-pulse delay-1000 z-0 mix-blend-screen"></div>

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
                                <ShieldAlert className="h-4 w-4 text-gold" />
                                <span className="text-sm font-medium text-gray-200 tracking-wide uppercase">
                                    Service Capability
                                </span>
                            </motion.div>
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight text-white">
                                Maritime <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-white to-slate-400">
                                    Security Services
                                </span>
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-xl font-light">
                                Comprehensive armed guard services and anti-piracy protection
                                to safeguard your vessels, platforms, and personnel in
                                high-risk maritime environments.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/contact"
                                    className="bg-gold text-navy-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                                >
                                    Request Security Assessment
                                </Link>
                                <div className="flex items-center space-x-4 px-6 py-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-slate-500 border-2 border-navy-900 relative flex items-center justify-center text-[10px] font-bold text-white">
                                                <Shield className="w-4 h-4" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-300 font-medium">Armed Security Teams</span>
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
                                    src="/images/hero-maritime-security.png"
                                    alt="Maritime Security Operations"
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
                                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold">Security Status</div>
                                                <div className="text-green-400 text-xs font-bold uppercase tracking-wider">All Clear</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-white">0</div>
                                            <div className="text-gray-400 text-xs">Incidents</div>
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
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mb-3">
                                    <stat.icon className="h-6 w-6 text-slate-600" />
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
                        <span className="text-slate-600 font-bold text-sm uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full">
                            Our Capabilities
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mt-6 mb-6">
                            Comprehensive Maritime Security
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                            Protecting your people and assets with professional armed security
                            teams and proven anti-piracy protocols.
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

                                <h3 className="text-2xl font-bold text-navy-900 mb-4 group-hover:text-slate-700 transition-colors">
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

            {/* High Risk Areas Section */}
            <section className="py-24 bg-navy-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-red-400 font-bold text-sm uppercase tracking-widest">Threat Assessment</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                            High-Risk Maritime Zones
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
                            We provide specialized security services in the world's most dangerous waters.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {highRiskAreas.map((area, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all"
                            >
                                <div className={`w-4 h-4 ${area.color} rounded-full mx-auto mb-4`}></div>
                                <h3 className="text-lg font-bold text-white mb-2">{area.region}</h3>
                                <p className="text-gray-400 text-sm">Threat Level: <span className="font-bold text-white">{area.threat}</span></p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16 bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <AlertTriangle className="h-6 w-6 text-red-400" />
                            <span className="text-red-400 font-bold uppercase tracking-wider">Gulf of Guinea Focus</span>
                        </div>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            With our deep expertise in West African waters, we specialize in protecting vessels and platforms
                            operating in the Gulf of Guinea – one of the world's most challenging maritime security environments.
                        </p>
                    </motion.div>
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
                        <span className="text-slate-600 font-semibold text-sm uppercase tracking-wide">Our Methodology</span>
                        <h2 className="text-4xl font-bold text-navy-900 mt-2">Security Process</h2>
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
                                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-600 relative z-10">
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

            {/* Certifications Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="rounded-[3rem] overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>

                        <div className="relative z-10 p-10 md:p-20 text-center">
                            <div className="inline-flex items-center space-x-2 bg-gold/20 text-gold px-4 py-2 rounded-full font-bold mb-8 border border-gold/30">
                                <Award className="h-5 w-5" />
                                <span className="uppercase tracking-wider text-sm">Certifications & Compliance</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 max-w-4xl mx-auto leading-tight">
                                Fully Certified <br />
                                <span className="text-gold">Security Operations</span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mt-12">
                                {[
                                    "ISPS Code Compliant",
                                    "ISO 28000 Certified",
                                    "SOLAS Compliant",
                                    "IMO Guidelines"
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                                        <CheckCircle2 className="h-8 w-8 text-green-400 mb-4 mx-auto" />
                                        <span className="text-white font-medium block">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-primary-950 text-white relative overflow-hidden">
                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gray-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">
                        Protect Your <br /> Maritime Operations
                    </h2>
                    <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-300 font-light">
                        Partner with us for professional armed security services that keep
                        your vessels, platforms, and personnel safe from maritime threats.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            href="/contact"
                            className="bg-primary text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                        >
                            Request Security Assessment
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
