"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
    FileText,
    User,
    Building,
    Mail,
    Phone,
    Briefcase,
    MessageSquare,
    CheckCircle2,
    ArrowRight,
    Send,
    Loader2,
} from "lucide-react";
import { submitQuoteForm } from "@/app/actions";
import { toast } from "sonner";
import SuccessModal from "@/components/ui/SuccessModal";

export default function QuotePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeSegment, setActiveSegment] = useState<
        "offshore" | "manning" | "hse" | "supply" | "waste"
    >("offshore");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        // Append active segment as it's not a form input
        formData.append('service_area', activeSegment);

        try {
            const result = await submitQuoteForm(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Quote request submitted successfully!");
                setShowSuccessModal(true);
            }
        } catch (error) {
            toast.error("Failed to submit quote request");
        } finally {
            setIsSubmitting(false);
        }
    };

    const services = [
        { id: "offshore", label: "Offshore Engineering" },
        { id: "manning", label: "Manning Services" },
        { id: "hse", label: "HSE Consulting" },
        { id: "supply", label: "Supply Chain" },
        { id: "waste", label: "Waste Management" },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 overflow-hidden bg-navy-900">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-black opacity-95"></div>
                <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-5"></div>

                {/* Animated Orbs */}
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[128px] animate-pulse z-0"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 mb-8">
                            <FileText className="h-4 w-4 text-gold-400" />
                            <span className="text-sm font-medium text-gray-200 tracking-wide uppercase">
                                Project Estimations
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Request a <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-yellow-200 to-gold-600">
                                Premium Quote
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                            Tell us about your project requirements. Our engineering team will analyze your needs and provide a comprehensive proposal.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-24 bg-gray-50 relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Sidebar Information */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-navy-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <h3 className="text-2xl font-bold mb-6">Why IRS?</h3>
                                <ul className="space-y-4">
                                    {[
                                        "Industry-certified Professionals",
                                        "24/7 Operational Support",
                                        "Global Logistics Network",
                                        "ISO 45001 Safety Standards",
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                                            <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold text-navy-900 mb-4">Need Immediate Assistance?</h3>
                                <p className="text-gray-600 mb-6 text-sm">For urgent inquiries, please contact our support desk directly.</p>
                                <a href="tel:+231881915322" className="flex items-center gap-3 text-navy-900 font-bold hover:text-gold-600 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <span>+231 88 191 5322</span>
                                </a>
                            </div>
                        </div>

                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10"
                            >
                                <form onSubmit={handleSubmit} className="space-y-8">

                                    {/* Service Selection */}
                                    <div>
                                        <label className="block text-sm font-bold text-navy-900 uppercase tracking-wide mb-4">
                                            Select Service Area
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {services.map((service) => (
                                                <button
                                                    type="button"
                                                    key={service.id}
                                                    onClick={() => setActiveSegment(service.id as any)}
                                                    className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 border ${activeSegment === service.id
                                                        ? service.id === "waste"
                                                            ? "bg-teal-600 text-white border-teal-600 shadow-lg scale-105"
                                                            : "bg-orange-600 text-white border-orange-600 shadow-lg scale-105"
                                                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gold-400 hover:bg-gold-50"
                                                        }`}
                                                >
                                                    {service.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="h-px bg-gray-100"></div>

                                    {/* Contact Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                                <input type="text" name="full_name" placeholder="John Doe" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all" required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Company Name</label>
                                            <div className="relative">
                                                <Building className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                                <input type="text" name="company_name" placeholder="Acme Offshore Ltd" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                                <input type="email" name="email" placeholder="john@company.com" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all" required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                                <input type="tel" name="phone" placeholder="+1 (555) 000-0000" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Project Details */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Project Requirements / Scope</label>
                                        <div className="relative">
                                            <textarea name="project_requirements" rows={5} placeholder="Please describe your project requirements, estimated duration, and any specific certifications needed..." className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all resize-none"></textarea>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-navy-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-navy-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing Request...
                                            </>
                                        ) : (
                                            <>
                                                <span>Submit Request</span>
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-xs text-gray-500">
                                        By submitting this form, you agree to our privacy policy and terms of service.
                                    </p>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Quote Request Received"
                message="We have successfully received your project requirements. Our engineering team will review your details and prepare a comprehensive proposal shortly."
                actionLabel="Explore Services"
                onAction={() => window.location.href = "/services"}
            />
        </div>
    );
}
