"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
    Inbox,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Clock,
    ChevronRight,
    MoreHorizontal,
    FileText,
    Calendar,
    DollarSign,
    MessageSquare,
    Loader2,
    Eye,
    MapPin,
    Briefcase
} from "lucide-react";
import { toast } from "sonner";

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ServiceRequest {
    id: string;
    client_id: string;
    service_type: string;
    details: any;
    status: string;
    created_at: string;
    client: {
        company_name: string;
        full_name: string;
        email: string;
    };
    client_response?: string;
    client_responded_at?: string;
    admin_notes?: string;
}

export default function RequestsInboxPage() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Approval Form State
    const [contractValue, setContractValue] = useState("");
    const [completionDate, setCompletionDate] = useState("");
    const [adminNote, setAdminNote] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchRequests();

        // Mark service request notifications as read
        const markRead = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            await supabase
                .from("notifications")
                .update({ is_read: true })
                .eq("user_id", user.id)
                .eq("type", "service_request");
        };
        markRead();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data, error } = await supabase
                .from("service_requests")
                .select(`
          *,
          client:clients(
            company_name,
            profiles(full_name, email)
          )
        `)
                .order("created_at", { ascending: false });

            if (error) throw error;

            // Transform data to flat structure for easier usage
            const flattened = data?.map((r: any) => ({
                ...r,
                client: {
                    company_name: r.client?.company_name || "Unknown Company",
                    full_name: r.client?.profiles?.full_name || "Unknown User",
                    email: r.client?.profiles?.email || "",
                },
            })) || [];

            setRequests(flattened);
        } catch (error: any) {
            console.error("Error fetching requests:", error); // Console log for debugging
            // Only show toast if it's not a simple 'no rows' or if it's a real error.
            // Actually empty rows don't throw error.
            toast.error("Failed to load requests", { description: error.message || error.details });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedRequest) return;
        if (!contractValue || !completionDate) {
            toast.error("Please enter contract value and completion date");
            return;
        }

        setProcessing(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // 1. Create Project
            const { data: project, error: projectError } = await supabase
                .from("projects")
                .insert({
                    client_id: selectedRequest.client_id,
                    project_name: selectedRequest.details.service_name || `${selectedRequest.service_type} Project - ${selectedRequest.client.company_name}`,
                    description: selectedRequest.details.description || `Project created from request ${selectedRequest.id}`,
                    status: "active",
                    service_type: selectedRequest.service_type,
                    start_date: new Date().toISOString(),
                    end_date: completionDate,
                    contract_value: parseFloat(contractValue),
                    service_request_id: selectedRequest.id,
                })
                .select()
                .single();

            if (projectError) throw projectError;

            // 2. Auto-generate milestones from template
            const { error: milestoneError } = await supabase.rpc('generate_milestones_from_template', {
                p_project_id: project.id,
                p_service_type: selectedRequest.service_type,
                p_start_date: new Date().toISOString().split('T')[0]
            });

            if (milestoneError) {
                console.error("Milestone generation error:", milestoneError);
                // Don't fail the whole approval, just log the error
            }

            // 3. Create initial project update (activity feed entry)
            await supabase.from("project_updates").insert({
                project_id: project.id,
                update_type: "project_created",
                title: "Project Created",
                description: `Project "${project.project_name}" has been approved and created.`,
                metadata: { service_type: selectedRequest.service_type },
                created_by: user?.id,
                is_client_visible: true
            });

            // 3.5 Generate Tracking Code (Update Project)
            // Format: IRS-{RANDOM_4_DIGITS}-WX-{YEAR}
            const randomCode = Math.floor(1000 + Math.random() * 9000);
            const year = new Date().getFullYear();
            const trackingCode = `IRS-${randomCode}-WX-${year}`;

            // Supply specific metadata
            let metadata = {};
            if (selectedRequest.service_type === 'supply') {
                metadata = {
                    origin: "Waiting for details",
                    destination: "Waiting for details",
                    vessel: "Pending Assignment"
                };
            }

            const { error: trackingError } = await supabase
                .from("projects")
                .update({
                    tracking_code: trackingCode,
                    metadata: metadata
                })
                .eq("id", project.id);

            if (trackingError) {
                console.error("Error setting tracking code:", trackingError);
                toast.warning("Project created but tracking code failed to generate.");
            } else {
                toast.success(`Project Created. Tracking Code: ${trackingCode}`);
            }

            // 4. Update Request Status
            const { error: updateError } = await supabase
                .from("service_requests")
                .update({
                    status: "approved",
                    reviewed_by: user?.id,
                    reviewed_at: new Date().toISOString(),
                })
                .eq("id", selectedRequest.id);

            if (updateError) throw updateError;

            toast.success("Project Created & Request Approved");
            setIsReviewOpen(false);
            fetchRequests();
        } catch (error: any) {
            toast.error("Approval failed", { description: error.message });
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!selectedRequest) return;
        if (!confirm("Are you sure you want to reject this request?")) return;

        setProcessing(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase
                .from("service_requests")
                .update({
                    status: "rejected",
                    reviewed_by: user?.id,
                    reviewed_at: new Date().toISOString(),
                })
                .eq("id", selectedRequest.id);

            if (error) throw error;
            toast.success("Request Rejected");
            setIsReviewOpen(false);
            fetchRequests();
        } catch (error: any) {
            toast.error("Rejection failed", { description: error.message });
        } finally {
            setProcessing(false);
        }
    };

    const handleRequestInfo = async () => {
        if (!selectedRequest) return;
        if (!adminNote.trim()) {
            toast.error("Please enter a note for the client");
            return;
        }

        setProcessing(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase
                .from("service_requests")
                .update({
                    status: "info_requested",
                    admin_notes: adminNote,
                    reviewed_by: user?.id,
                    reviewed_at: new Date().toISOString(),
                })
                .eq("id", selectedRequest.id);

            if (error) throw error;
            toast.success("Info Requested sent to client");
            setIsReviewOpen(false);
            fetchRequests();
        } catch (error: any) {
            toast.error("Failed to request info", { description: error.message });
        } finally {
            setProcessing(false);
        }
    };

    const filteredRequests = requests.filter(r => {
        const matchesSearch =
            r.client.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.service_type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "all" || r.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const styles: any = {
            pending: "bg-yellow-100 text-yellow-700",
            approved: "bg-green-100 text-green-700",
            rejected: "bg-red-100 text-red-700",
            info_requested: "bg-orange-100 text-orange-700",
            cancelled: "bg-gray-100 text-gray-700"
        };

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
                {status.replace("_", " ").toUpperCase()}
            </span>
        );
    };

    const openReview = async (req: ServiceRequest) => {
        setSelectedRequest(req);
        setIsReviewOpen(true);
        setContractValue("");
        setCompletionDate("");
        setAdminNote(req.admin_notes || "");

        // Auto-mark as in_progress if pending to clear badge
        if (req.status === 'pending') {
            try {
                const { error } = await supabase
                    .from("service_requests")
                    .update({ status: 'in_progress' })
                    .eq("id", req.id);

                if (!error) {
                    // Update local state to reflect change without full refetch if possible
                    setRequests(prev => prev.map(r =>
                        r.id === req.id ? { ...r, status: 'in_progress' } : r
                    ));
                    setSelectedRequest(prev => prev ? { ...prev, status: 'in_progress' } : null);
                }
            } catch (err) {
                console.error("Error auto-updating status:", err);
            }
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Service Requests</h1>
                    <p className="text-gray-500">Manage incoming project inquiries</p>
                </div>
                <div className="flex gap-2">
                    {/* Add Bulk Actions Here if needed */}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search company or service..."
                        className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-2 border rounded-lg text-sm bg-white"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="info_requested">Action Required</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Client</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Service</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredRequests.map((req) => (
                            <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-navy-900">{req.client.company_name}</div>
                                    <div className="text-xs text-gray-500">{req.client.full_name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-gray-400" />
                                        <span className="capitalize">{req.service_type}</span>
                                    </div>
                                    {req.details.quantity && <div className="text-xs text-gray-500 mt-1">Qty: {req.details.quantity}</div>}
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(req.status)}
                                    {req.status === 'info_requested' && req.client_response && (
                                        <div className="mt-1 flex items-center gap-1 text-xs text-blue-600 font-medium">
                                            <MessageSquare className="w-3 h-3" />
                                            Client Replied
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(req.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => openReview(req)}
                                        className="text-primary hover:text-orange-700 font-medium text-sm"
                                    >
                                        Review
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredRequests.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No requests found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Review Modal */}
            {isReviewOpen && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
                            <h2 className="text-xl font-bold text-navy-900">Review Request</h2>
                            <button onClick={() => setIsReviewOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 flex-1">
                            {/* Request Details */}
                            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Service Type</label>
                                    <p className="font-medium capitalize">{selectedRequest.service_type}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Client</label>
                                    <p className="font-medium">{selectedRequest.client.company_name}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Description</label>
                                    <p className="text-sm text-gray-700 mt-1">{selectedRequest.details.description || "No description provided."}</p>
                                </div>
                                {/* Dynamic Details Rendering */}
                                {Object.entries(selectedRequest.details).map(([key, value]) => {
                                    if (key === 'description') return null;
                                    return (
                                        <div key={key}>
                                            <label className="text-xs text-gray-500 uppercase font-semibold capitalize">{key.replace("_", " ")}</label>
                                            <p className="text-sm">{String(value)}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Communication History */}
                            {(selectedRequest.admin_notes || selectedRequest.client_response) && (
                                <div className="space-y-4 border-t border-gray-100 pt-4">
                                    <h3 className="font-semibold text-sm text-gray-900">Communication History</h3>
                                    <div className="space-y-3">
                                        {selectedRequest.admin_notes && (
                                            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 text-sm">
                                                <span className="font-bold text-orange-800 text-xs block mb-1">Last Admin Note:</span>
                                                {selectedRequest.admin_notes}
                                            </div>
                                        )}
                                        {selectedRequest.client_response && (
                                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm">
                                                <span className="font-bold text-blue-800 text-xs block mb-1">Latest Client Reply:</span>
                                                {selectedRequest.client_response}
                                                <div className="text-xs text-gray-400 mt-1">{new Date(selectedRequest.client_responded_at!).toLocaleString()}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Area */}
                            <div className="space-y-4 border-t border-gray-100 pt-4">
                                <h3 className="font-semibold text-sm text-gray-900">Take Action</h3>

                                {/* Approve Inputs */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Contract Value ($) *</label>
                                        <input
                                            type="number"
                                            value={contractValue}
                                            onChange={(e) => setContractValue(e.target.value)}
                                            className="w-full p-2 border rounded-lg text-sm"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Expected Completion *</label>
                                        <input
                                            type="date"
                                            value={completionDate}
                                            onChange={(e) => setCompletionDate(e.target.value)}
                                            className="w-full p-2 border rounded-lg text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Note Input */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Admin Note / Clarification</label>
                                    <textarea
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        className="w-full p-2 border rounded-lg text-sm"
                                        rows={2}
                                        placeholder="Add a note (Required for 'Request Info')"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl sticky bottom-0">
                            <button
                                onClick={() => handleReject()}
                                disabled={processing}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                            >
                                Reject Request
                            </button>
                            <button
                                onClick={() => handleRequestInfo()}
                                disabled={processing}
                                className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg text-sm font-medium transition-colors"
                            >
                                Request Info
                            </button>
                            <button
                                onClick={() => handleApprove()}
                                disabled={processing}
                                className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                            >
                                {processing ? "Processing..." : "Approve & Create Project"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
