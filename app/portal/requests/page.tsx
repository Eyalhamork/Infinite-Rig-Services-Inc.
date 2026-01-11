"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import {
    Plus,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    MessageSquare,
    ChevronDown,
    ArrowRight,
    Loader2
} from "lucide-react";
import { toast } from "sonner";

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ServiceRequest {
    id: string;
    service_type: string;
    status: "pending" | "approved" | "rejected" | "in_progress" | "info_requested" | "cancelled";
    created_at: string;
    admin_notes?: string;
    client_response?: string;
    details: any;
}

export default function RequestsPage() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [submittingReply, setSubmittingReply] = useState(false);

    useEffect(() => {
        fetchRequests();

        // Mark service_request notifications as read
        const markRead = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from("notifications")
                    .update({ is_read: true })
                    .eq("user_id", user.id)
                    .eq("type", "service_request");
            }
        }
        markRead();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: client } = await supabase
                .from("clients")
                .select("id")
                .eq("primary_contact_id", user.id)
                .single();

            if (client) {
                const { data, error } = await supabase
                    .from("service_requests")
                    .select("*")
                    .eq("client_id", client.id)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setRequests(data || []);
            }
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this request?")) return;

        try {
            const { error } = await supabase
                .from("service_requests")
                .update({ status: "cancelled" })
                .eq("id", id);

            if (error) throw error;
            toast.success("Request cancelled");
            fetchRequests();
        } catch (error: any) {
            toast.error("Failed to cancel", { description: error.message });
        }
    };

    const handleSubmitReply = async (id: string) => {
        if (!replyText.trim()) return;
        setSubmittingReply(true);

        try {
            const { error } = await supabase
                .from("service_requests")
                .update({
                    client_response: replyText,
                    status: "pending", // Reset status for admin review
                    client_responded_at: new Date().toISOString()
                })
                .eq("id", id);

            if (error) throw error;
            toast.success("Response sent");
            setReplyingTo(null);
            setReplyText("");
            fetchRequests();
        } catch (error: any) {
            toast.error("Failed to send response", { description: error.message });
        } finally {
            setSubmittingReply(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
            approved: "bg-green-100 text-green-700 border-green-200",
            rejected: "bg-red-100 text-red-700 border-red-200",
            in_progress: "bg-blue-100 text-blue-700 border-blue-200",
            info_requested: "bg-orange-100 text-orange-700 border-orange-200",
            cancelled: "bg-gray-100 text-gray-700 border-gray-200",
        };

        const labels = {
            pending: "Under Review",
            approved: "Approved",
            rejected: "Rejected",
            in_progress: "Processing",
            info_requested: "Action Required",
            cancelled: "Cancelled",
        };

        const StatusIcon = {
            pending: Clock,
            approved: CheckCircle2,
            rejected: XCircle,
            in_progress: Loader2,
            info_requested: AlertCircle,
            cancelled: XCircle,
        }[status as keyof typeof styles] || Clock;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.pending}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {labels[status as keyof typeof labels] || status}
            </span>
        );
    };

    const getServiceLabel = (type: string) => {
        const map: Record<string, string> = {
            manning: "Technical Manning",
            offshore: "Offshore/Technical Services",
            hse: "HSE & Training",
            supply: "Supply Chain & Logistics",
            waste: "Waste Management",
            "asset-integrity": "Asset Integrity & Inspection",
            "rig-move": "Rig Move & Marine Towage",
            security: "Maritime Security Services",
        };
        return map[type] || type;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-2xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">My Requests</h1>
                    <p className="text-gray-500">Track and manage your service inquiries</p>
                </div>
                <Link
                    href="/portal/requests/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-bold shadow-sm shadow-primary-600/20"
                >
                    <Plus className="w-4 h-4" />
                    Request Service
                </Link>
            </div>

            <div className="space-y-4">
                {requests.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-navy-900">No requests yet</h3>
                        <p className="text-gray-500 mb-4">Start by creating your first service request</p>
                        <Link
                            href="/portal/requests/new"
                            className="text-primary-600 hover:text-primary-700 font-bold underline decoration-primary-200"
                        >
                            Create Request
                        </Link>
                    </div>
                ) : (
                    requests.map((req) => (
                        <div key={req.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-lg text-navy-900">
                                            {req.details.position || req.details.service_name || req.details.item_name || getServiceLabel(req.service_type)}
                                        </h3>
                                        {getStatusBadge(req.status)}
                                    </div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        <span className="font-medium">{getServiceLabel(req.service_type)}</span>
                                        <span className="mx-2">•</span>
                                        Created {new Date(req.created_at).toLocaleDateString()}
                                    </p>

                                    {/* Summary Details */}
                                    <div className="text-sm text-gray-600 mt-3 space-y-1">
                                        {req.details.quantity && <p>Quantity: {req.details.quantity}</p>}
                                        {req.details.location && <p>Location: {req.details.location}</p>}
                                        {req.details.dates && <p>Dates: {req.details.dates}</p>}
                                        {req.details.description && (
                                            <p className="line-clamp-2 mt-2 italic text-gray-500">"{req.details.description}"</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 min-w-[140px]">
                                    {req.status === 'pending' && (
                                        <button
                                            onClick={() => handleCancel(req.id)}
                                            className="text-sm text-gray-500 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors text-right md:text-center"
                                        >
                                            Cancel Request
                                        </button>
                                    )}
                                    {req.status === 'approved' && (
                                        <Link
                                            href="/portal/projects" // ideally link to specific project if we had the ID link back easily
                                            className="inline-flex items-center justify-center gap-2 text-sm bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-100 transition-colors"
                                        >
                                            View Project <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Action Required Section */}
                            {req.status === 'info_requested' && (
                                <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-100 space-y-4">
                                    <div className="flex gap-3">
                                        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-orange-900">Action Required</h4>
                                            <p className="text-sm text-orange-800 mt-1">{req.admin_notes}</p>
                                        </div>
                                    </div>

                                    {replyingTo === req.id ? (
                                        <div className="ml-8 space-y-3">
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Type your response here..."
                                                className="w-full p-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none text-sm"
                                                rows={3}
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSubmitReply(req.id)}
                                                    disabled={submittingReply}
                                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 disabled:opacity-50 transition-all shadow-sm shadow-primary-600/20"
                                                >
                                                    {submittingReply ? "Sending..." : "Submit Response"}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setReplyingTo(null);
                                                        setReplyText("");
                                                    }}
                                                    className="px-4 py-2 text-gray-600 hover:bg-white rounded-lg text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setReplyingTo(req.id)}
                                            className="ml-8 text-sm font-medium text-orange-700 hover:text-orange-900 flex items-center gap-1"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            Reply to Admin
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
