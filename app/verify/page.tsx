"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { QrCode, Shield, CheckCircle, Search, ArrowRight, Lock, BadgeCheck, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function VerifyPage() {
    const [employeeId, setEmployeeId] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = employeeId.trim();
        if (!trimmed) {
            setError("Please enter an Employee ID or Verification Code");
            return;
        }
        setError("");
        router.push(`/verify/${encodeURIComponent(trimmed)}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
            <Header />

            <main className="pt-32 pb-24">
                {/* Hero & Search Section */}
                <section className="relative overflow-hidden bg-navy-950 text-white py-20 mb-16">
                    <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-950 to-primary-950 opacity-95" />
                    <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-5" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] -z-0 pointer-events-none" />

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-gold-300 text-sm font-semibold mb-6 shadow-sm backdrop-blur-md">
                                <Shield className="h-4 w-4 text-primary" />
                                Official Credentials Verification
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-white">
                                Employee ID Verification
                            </h1>

                            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
                                Instantly verify credentials, certifications, and active employment status for all Infinite Rig Services personnel worldwide.
                            </p>

                            {/* Manual ID Search Form */}
                            <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-4">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-orange-500/30 rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity" />
                                    <input
                                        type="text"
                                        value={employeeId}
                                        onChange={(e) => {
                                            setEmployeeId(e.target.value);
                                            if (error) setError("");
                                        }}
                                        placeholder="Enter Employee ID (e.g., IRS-EMP-001)"
                                        className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-2xl py-5 pl-6 pr-36 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg font-medium shadow-2xl transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-primary to-orange-600 hover:from-primary-600 hover:to-orange-700 text-white px-7 rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
                                    >
                                        <Search className="w-4 h-4" />
                                        <span>Verify</span>
                                    </button>
                                </div>
                                {error && (
                                    <p className="text-red-400 text-sm mt-3 flex items-center justify-center gap-1.5">
                                        <AlertCircle className="w-4 h-4" /> {error}
                                    </p>
                                )}
                            </form>

                            <p className="text-xs text-gray-400 flex items-center justify-center gap-4 pt-2">
                                <span className="flex items-center gap-1"><BadgeCheck className="w-3.5 h-3.5 text-primary" /> Official Cryptographic Validation</span>
                                <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-primary" /> Tamper-Proof QR Records</span>
                            </p>
                        </motion.div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* How It Works Card */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 mb-12 border border-gray-100 shadow-xl relative overflow-hidden">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 relative z-10">
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/20 text-white">
                                    <QrCode className="h-7 w-7" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-1">
                                    Two Fast Ways to Verify
                                </h2>
                                <p className="text-gray-500 text-base">
                                    Designed for offshore security officers, port authorities, and client project managers.
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 relative z-10">
                            {[
                                {
                                    icon: QrCode,
                                    title: "1. Scan Secure QR Code",
                                    description: "Use any smartphone camera to scan the cryptographically signed QR badge on physical or digital ID cards.",
                                    bg: "bg-orange-50 text-orange-600 border-orange-100",
                                },
                                {
                                    icon: Search,
                                    title: "2. Direct ID Lookup",
                                    description: "Enter the employee ID directly into the verification field above to retrieve real-time personnel records.",
                                    bg: "bg-blue-50 text-blue-600 border-blue-100",
                                },
                                {
                                    icon: BadgeCheck,
                                    title: "3. Live Authentication",
                                    description: "Our database verifies live employment status, STCW certifications, safety accreditations, and expiry dates.",
                                    bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
                                },
                            ].map((step) => (
                                <div key={step.title} className="p-7 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${step.bg} group-hover:scale-110 transition-transform`}>
                                        <step.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-lg text-navy-900 mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed text-sm">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Verification Details & Privacy Cards */}
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
                            <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                                <BadgeCheck className="w-6 h-6 text-primary" /> Verified Information Returned
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    "Verified employee portrait and official name",
                                    "Current operational rank, position & department",
                                    "Live employment status (Active / Inactive)",
                                    "Official Employee ID badge number",
                                    "Card issue date and validation expiry",
                                    "Security clearance and offshore safety qualifications",
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-navy-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -ml-20 -mb-20" />

                            <div className="relative z-10">
                                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-white">
                                    <Shield className="h-5 w-5 text-primary" />
                                    Strict Privacy & Security
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-sm mb-6">
                                    This system protects employee personal data while giving offshore installations and clients authoritative verification for access control.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 relative z-10 text-xs text-gray-200">
                                All verification requests are timestamped and monitored to prevent counterfeit credentials.
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
