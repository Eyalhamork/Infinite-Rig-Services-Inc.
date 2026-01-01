"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
    ArrowRight,
    Package,
    Truck,
    Clock,
    DollarSign,
    TrendingUp,
    CheckCircle2,
    Building,
    MapPin,
    Calendar,
    Award,
    Quote,
    BarChart3,
    Users,
} from "lucide-react";

interface CaseStudy {
    id: string;
    title: string;
    client: string;
    industry: string;
    location: string;
    duration: string;
    image: string;
    challenge: string;
    solution: string;
    results: {
        metric: string;
        value: string;
        description: string;
    }[];
    testimonial?: {
        quote: string;
        author: string;
        position: string;
    };
    services: string[];
}

const caseStudies: CaseStudy[] = [
    {
        id: "offshore-drilling-supply",
        title: "Offshore Drilling Platform Supply Chain Optimization",
        client: "West Africa Drilling Ltd.",
        industry: "Oil & Gas",
        location: "Offshore Liberia",
        duration: "18 months ongoing",
        image: "/images/services/offshore-operations.png",
        challenge:
            "The client was experiencing frequent supply delays causing operational downtime, with procurement costs 40% above industry average. Their existing supply chain lacked visibility and had multiple inefficiencies in vendor management.",
        solution:
            "We implemented an integrated supply chain solution including strategic vendor consolidation, real-time tracking systems, and optimized marine logistics routes. Our team also established a local warehousing hub to reduce delivery times for critical components.",
        results: [
            {
                metric: "Cost Reduction",
                value: "32%",
                description: "Savings on annual procurement costs",
            },
            {
                metric: "Delivery Time",
                value: "45%",
                description: "Faster average delivery to platform",
            },
            {
                metric: "Downtime",
                value: "Zero",
                description: "Supply-related operational stops",
            },
            {
                metric: "Vendor Network",
                value: "50+",
                description: "Qualified and vetted suppliers",
            },
        ],
        testimonial: {
            quote:
                "Infinite Rig Services transformed our supply chain operations. We've seen dramatic cost savings while improving our operational reliability. Their team's expertise in offshore logistics is unmatched.",
            author: "Michael Thompson",
            position: "Operations Director, West Africa Drilling Ltd.",
        },
        services: ["Strategic Procurement", "Marine Logistics", "Warehousing"],
    },
    {
        id: "emergency-supply-response",
        title: "Emergency Supply Response for Platform Repair",
        client: "Atlantic Energy Partners",
        industry: "Energy",
        location: "Offshore Ghana",
        duration: "72-hour emergency response",
        image: "/images/services/supply-operations.png",
        challenge:
            "A critical equipment failure on an offshore platform required urgent procurement and delivery of specialized parts from suppliers in Europe and the US. The client faced potential losses of $500,000 per day of downtime.",
        solution:
            "Our emergency response team coordinated air freight from multiple international suppliers, managed customs clearance on priority basis, and arranged helicopter transfer for final delivery to the platform. Round-the-clock coordination ensured seamless execution.",
        results: [
            {
                metric: "Response Time",
                value: "4 hrs",
                description: "From call to action plan",
            },
            {
                metric: "Delivery",
                value: "68 hrs",
                description: "Parts on platform from first call",
            },
            {
                metric: "Downtime Saved",
                value: "$1.5M",
                description: "Avoided losses from quick response",
            },
            {
                metric: "Parts Sourced",
                value: "12",
                description: "Critical components from 3 countries",
            },
        ],
        testimonial: {
            quote:
                "When our platform went down, Infinite Rig Services responded immediately. Their ability to source and deliver specialized parts in under 72 hours saved us over a million dollars in potential losses.",
            author: "Sandra Williams",
            position: "Supply Chain Manager, Atlantic Energy Partners",
        },
        services: ["Emergency Supply", "Customs Clearance", "Air Freight"],
    },
    {
        id: "inventory-optimization",
        title: "Warehouse & Inventory Optimization Project",
        client: "Offshore Support Services Inc.",
        industry: "Maritime",
        location: "Monrovia, Liberia",
        duration: "6 months implementation",
        image: "/images/services/supply-hero.png",
        challenge:
            "The client's existing warehouse operations were inefficient with high carrying costs, frequent stockouts, and lack of inventory visibility. Manual tracking systems led to errors and delayed order fulfillment.",
        solution:
            "We designed and implemented a modern warehouse management system with barcode scanning, real-time inventory tracking, and automated reorder points. Warehouse layout was optimized for faster picking and reduced handling time.",
        results: [
            {
                metric: "Inventory Accuracy",
                value: "99.5%",
                description: "Up from 82% accuracy",
            },
            {
                metric: "Carrying Costs",
                value: "28%",
                description: "Reduction in inventory costs",
            },
            {
                metric: "Order Fulfillment",
                value: "4 hrs",
                description: "Average turnaround time",
            },
            {
                metric: "Stockouts",
                value: "85%",
                description: "Reduction in stockout incidents",
            },
        ],
        services: ["Warehousing Solutions", "Inventory Management", "Process Optimization"],
    },
];

export default function CaseStudiesPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-600 to-charcoal"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto text-center text-white"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
                        >
                            <Award className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Success Stories</span>
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Case Studies
                        </h1>
                        <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                            Discover how we've helped clients optimize their supply chains,
                            reduce costs, and improve operational efficiency
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Summary */}
            <section className="py-12 bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { value: "50+", label: "Projects Completed", icon: CheckCircle2 },
                            { value: "30%", label: "Avg. Cost Savings", icon: DollarSign },
                            { value: "99%", label: "On-Time Delivery", icon: Clock },
                            { value: "100+", label: "Satisfied Clients", icon: Users },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
                                    <stat.icon className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="text-3xl font-bold text-navy mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Case Studies */}
            <section className="py-24 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-24">
                        {caseStudies.map((study, index) => (
                            <motion.div
                                key={study.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="bg-white rounded-3xl shadow-xl overflow-hidden"
                            >
                                {/* Header */}
                                <div className="relative h-64 md:h-80">
                                    <Image
                                        src={study.image}
                                        alt={study.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 right-6 text-white">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {study.services.map((service, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                                                >
                                                    {service}
                                                </span>
                                            ))}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold mb-2">
                                            {study.title}
                                        </h2>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
                                            <span className="flex items-center">
                                                <Building className="h-4 w-4 mr-1" />
                                                {study.client}
                                            </span>
                                            <span className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {study.location}
                                            </span>
                                            <span className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {study.duration}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 md:p-12">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                        {/* Challenge & Solution */}
                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="text-xl font-bold text-navy mb-4 flex items-center">
                                                    <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                                                        <span className="text-red-600 font-bold text-sm">!</span>
                                                    </span>
                                                    The Challenge
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {study.challenge}
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-navy mb-4 flex items-center">
                                                    <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    </span>
                                                    Our Solution
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {study.solution}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Results */}
                                        <div>
                                            <h3 className="text-xl font-bold text-navy mb-6 flex items-center">
                                                <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                                                    <TrendingUp className="h-4 w-4 text-primary" />
                                                </span>
                                                Key Results
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {study.results.map((result, i) => (
                                                    <div
                                                        key={i}
                                                        className="bg-gray-50 rounded-xl p-4 text-center"
                                                    >
                                                        <div className="text-3xl font-bold text-green-600 mb-1">
                                                            {result.value}
                                                        </div>
                                                        <div className="text-sm font-semibold text-navy mb-1">
                                                            {result.metric}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {result.description}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Testimonial */}
                                    {study.testimonial && (
                                        <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                                            <Quote className="h-10 w-10 text-green-300 mb-4" />
                                            <p className="text-lg text-gray-700 italic mb-6 leading-relaxed">
                                                "{study.testimonial.quote}"
                                            </p>
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                                    {study.testimonial.author
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-navy">
                                                        {study.testimonial.author}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {study.testimonial.position}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to Optimize Your Supply Chain?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto text-green-100">
                        Let us help you achieve similar results. Get in touch for a
                        customized supply chain solution.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/quote"
                            className="bg-white text-green-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center"
                        >
                            Request Quote
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-green-900 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-950 hover:shadow-2xl transition-all duration-300"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
