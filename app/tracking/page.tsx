"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
    Search,
    Package,
    MapPin,
    Anchor,
    Clock,
    CheckCircle2,
    Truck,
    Ship,
    Calendar,
    ArrowRight,
    AlertCircle,
} from "lucide-react";

import { createBrowserClient } from "@supabase/ssr";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function TrackingContent() {
    const searchParams = useSearchParams();
    const [trackingId, setTrackingId] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [trackingData, setTrackingData] = useState<any>(null);

    // Auto-search if URL has id
    useEffect(() => {
        const idFromUrl = searchParams.get('id');
        if (idFromUrl) {
            setTrackingId(idFromUrl);
            fetchTrackingValues(idFromUrl);
        }
    }, [searchParams]);

    const fetchTrackingValues = async (code: string) => {
        setIsSearching(true);
        setShowResult(false);
        try {
            const { data, error } = await supabase.rpc('get_tracking_details', {
                p_tracking_code: code
            });

            if (error) throw error;

            if (!data) {
                toast.error("Tracking ID not found. Please check and try again.");
                setIsSearching(false);
                return;
            }

            // Process Data for UI
            const processed = processTrackingData(data);
            setTrackingData(processed);
            setShowResult(true);

        } catch (err: any) {
            console.error("Tracking Error:", err);
            toast.error("Failed to track shipment. Please try again later.");
        } finally {
            setIsSearching(false);
        }
    }

    const processTrackingData = (data: any) => {
        const isSupply = data.service_type === 'supply';
        const milestones = data.milestones || [];

        // Calculate Progress
        const total = milestones.length;
        const completed = milestones.filter((m: any) => m.is_completed).length;
        const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

        // Get Status from metadata or derived from milestones
        // If supply, use metadata origin/dest. If not, use generic.
        const origin = isSupply ? (data.metadata?.origin || "Pending Origin") : "Project Start";
        const destination = isSupply ? (data.metadata?.destination || "Pending Dest") : "Project Completion";
        const vessel = isSupply ? (data.metadata?.vessel || "Pending Assignment") : data.service_type?.toUpperCase();

        // Map events
        const events = milestones.map((m: any) => ({
            date: m.due_date ? new Date(m.due_date).toLocaleDateString() : "Pending Date",
            location: isSupply ? "Logistics Hub" : "Project Site", // Generic location for now
            status: m.milestone_name,
            completed: m.is_completed,
            current: !m.is_completed && milestones.find((x: any) => !x.is_completed)?.milestone_name === m.milestone_name, // Is roughly next
            icon: m.is_completed ? CheckCircle2 : Clock
        }));

        return {
            id: data.tracking_code,
            status: data.status?.replace('_', ' ').toUpperCase(),
            origin,
            destination,
            vessel,
            eta: data.end_date ? new Date(data.end_date).toLocaleDateString() : "TBD",
            progress,
            events,
            isSupply
        };
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingId.trim()) return;
        fetchTrackingValues(trackingId.trim());
    };

    return (
        <div className="min-h-screen bg-navy-900 text-white selection:bg-green-500 selection:text-white">
            <Header />

            <main className="pt-32 pb-24 relative overflow-hidden min-h-screen flex flex-col">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-5 z-0"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 z-0"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 z-0"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-grow flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center mb-12"
                    >
                        <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 mb-8">
                            <Package className="h-4 w-4 text-green-400" />
                            <span className="text-sm font-medium text-gray-200 tracking-wide uppercase">
                                Real-Time Project Tracking
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Track Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400">
                                Project Status
                            </span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-xl mx-auto">
                            Enter your Tracking ID (e.g., IRS-XXXX...) to get
                            real-time status updates on your service or shipment.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-xl mx-auto w-full mb-16"
                    >
                        <form onSubmit={handleSearch} className="relative">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                <input
                                    type="text"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    placeholder="Enter Tracking ID (e.g., IRS-8842...)"
                                    className="w-full bg-navy-800/80 backdrop-blur-xl border border-white/10 text-white placeholder-gray-500 rounded-2xl py-6 pl-6 pr-36 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all text-lg shadow-2xl"
                                />
                                <button
                                    type="submit"
                                    disabled={isSearching}
                                    className="absolute right-2 top-2 bottom-2 bg-green-600 hover:bg-green-500 text-white px-8 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSearching ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Locating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-4 h-4" />
                                            <span>Track</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-500" /> Live Data
                            </span>
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-500" /> Secure Access
                            </span>
                        </div>
                    </motion.div>

                    {/* Results Area */}
                    <AnimatePresence>
                        {showResult && trackingData && (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="max-w-4xl mx-auto w-full"
                            >
                                {/* Supply Chain Visuals - Only if Supply */}
                                {trackingData.isSupply && (
                                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <Anchor className="w-32 h-32 text-white" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                                            <div>
                                                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Status</h3>
                                                <div className="text-2xl font-bold text-green-400 flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                                    {trackingData.status}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Target Date</h3>
                                                <div className="text-2xl font-bold text-white">{trackingData.eta}</div>
                                            </div>
                                            <div>
                                                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Vessel/Ref</h3>
                                                <div className="text-2xl font-bold text-white">{trackingData.vessel}</div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-10 mb-2">
                                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                                                <span>Origin</span>
                                                <span>Destination</span>
                                            </div>
                                            <div className="h-2 bg-navy-900 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${trackingData.progress}%` }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                    className="h-full bg-gradient-to-r from-green-600 to-teal-400"
                                                ></motion.div>
                                            </div>
                                            <div className="flex justify-between text-sm font-medium text-white mt-2">
                                                <span>{trackingData.origin}</span>
                                                <span>{trackingData.destination}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Generic Project Header - If NOT Supply */}
                                {!trackingData.isSupply && (
                                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 text-center">
                                        <h2 className="text-3xl font-bold mb-2">Project Timeline</h2>
                                        <p className="text-gray-400">{trackingData.status}</p>
                                        <div className="mt-6 w-full bg-navy-900 rounded-full h-2 max-w-lg mx-auto overflow-hidden">
                                            <div
                                                className="bg-green-500 h-full transition-all duration-1000"
                                                style={{ width: `${trackingData.progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="mt-2 text-sm text-green-400">{trackingData.progress}% Complete</div>
                                    </div>
                                )}

                                {/* Timeline */}
                                <div className="bg-navy-800/50 backdrop-blur-md border border-white/5 rounded-3xl p-8">
                                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-green-500" />
                                        Project Milestones
                                    </h3>

                                    <div className="space-y-8 relative before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-[2px] before:bg-white/10">
                                        {trackingData.events.map((event: any, i: number) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 + (i * 0.1) }}
                                                className="relative pl-20"
                                            >
                                                <div className={`absolute left-0 top-1 w-14 h-14 rounded-2xl flex items-center justify-center border ${event.completed
                                                    ? 'bg-green-500/10 border-green-500/30 text-green-500'
                                                    : event.current
                                                        ? 'bg-white/10 border-white/30 text-white animate-pulse'
                                                        : 'bg-navy-900 border-white/10 text-gray-600'
                                                    }`}>
                                                    <event.icon className="w-6 h-6" />
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    <div>
                                                        <h4 className={`text-lg font-bold ${event.completed || event.current ? 'text-white' : 'text-gray-500'}`}>
                                                            {event.status}
                                                        </h4>
                                                        <p className="text-gray-400 text-sm">{event.location}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`text-sm font-mono ${event.completed ? 'text-green-400' : 'text-gray-500'}`}>
                                                            {event.date}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <p className="text-gray-500 text-sm mb-4">Have questions about this project?</p>
                                    <Link href="/contact" className="inline-flex items-center text-green-400 hover:text-green-300 font-medium transition-colors">
                                        Contact Support <ArrowRight className="ml-1 w-4 h-4" />
                                    </Link>
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!showResult && !isSearching && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto opacity-50"
                        >
                            {[
                                { title: "Ocean Freight", icon: Ship, desc: "Container & Bulk" },
                                { title: "Air Freight", icon: Package, desc: "Express Delivery" },
                                { title: "Inland Logistics", icon: Truck, desc: "Road & Rail" },
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
                                    <item.icon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                                    <h3 className="text-white font-medium">{item.title}</h3>
                                    <p className="text-gray-500 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function TrackingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-navy-900 flex items-center justify-center"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div></div>}>
            <TrackingContent />
        </Suspense>
    );
}
