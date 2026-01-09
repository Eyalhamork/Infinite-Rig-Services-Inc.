"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Ship,
    Clock,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    FileText,
    MessageSquare,
    DollarSign,
    Building2,
    User,
    Edit3,
    Save,
    X,
    Plus,
    Loader2,
    ExternalLink,
    Pause,
    Trash2,
    FileCheck,
    Send,
    History,
} from "lucide-react";
import { toast } from "sonner";
import { MoneyInput } from "@/components/ui/MoneyInput";

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Project {
    id: string;
    project_name: string;
    project_code: string;
    description: string;
    status: string;
    start_date: string;
    end_date: string;
    location: string;
    service_type: string;
    vessel_name: string;
    contract_value: number;
    notes: string;
    service_request_id: string;
    client_id: string;
    created_at: string;
    updated_at: string;
    client: {
        id: string;
        company_name: string;
    };
}

interface Milestone {
    id: string;
    milestone_name: string;
    description: string;
    due_date: string;
    completion_date: string;
    is_completed: boolean;
}

const statusOptions = [
    { value: "active", label: "Active" },
    { value: "planning", label: "Planning" },
    { value: "in_progress", label: "In Progress" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];

export default function AdminProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Project>>({});

    // Milestone modal state
    const [showMilestoneModal, setShowMilestoneModal] = useState(false);
    const [milestoneForm, setMilestoneForm] = useState({
        milestone_name: "",
        description: "",
        due_date: "",
    });

    // Contract modal state
    const [showContractModal, setShowContractModal] = useState(false);
    const [generatingContract, setGeneratingContract] = useState(false);
    const [contractNote, setContractNote] = useState("");
    const [contractDoc, setContractDoc] = useState<any>(null);
    const [contractHistory, setContractHistory] = useState<any[]>([]);

    useEffect(() => {
        fetchProject();
    }, [params.id]);

    async function fetchProject() {
        try {
            // Fetch project with client
            const { data: projectData, error: projectError } = await supabase
                .from("projects")
                .select(`
          *,
          client:clients(id, company_name)
        `)
                .eq("id", params.id)
                .single();

            if (projectError) throw projectError;
            if (!projectData) {
                router.push("/dashboard/projects");
                return;
            }

            setProject(projectData);
            setEditForm(projectData);

            // Fetch contract document
            const { data: docData } = await supabase
                .from("project_documents")
                .select("*")
                .eq("project_id", params.id)
                .ilike("title", "Service Contract%")
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            setContractDoc(docData);

            // Fetch contract history
            const { data: historyData } = await supabase
                .from("project_updates")
                .select(`
                    *,
                    profiles:created_by(full_name)
                `)
                .eq("project_id", params.id)
                .in("update_type", ["contract_update", "contract_deleted", "document_added"])
                .order("created_at", { ascending: false });

            setContractHistory(historyData || []);

            // Fetch milestones
            const { data: milestonesData } = await supabase
                .from("project_milestones")
                .select("*")
                .eq("project_id", params.id)
                .order("due_date", { ascending: true });

            setMilestones(milestonesData || []);
        } catch (error) {
            console.error("Error fetching project:", error);
            toast.error("Failed to load project");
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async () => {
        if (!project) return;
        setSaving(true);

        try {
            const { error } = await supabase
                .from("projects")
                .update({
                    project_name: editForm.project_name,
                    description: editForm.description,
                    status: editForm.status,
                    start_date: editForm.start_date,
                    end_date: editForm.end_date,
                    location: editForm.location,
                    vessel_name: editForm.vessel_name,
                    contract_value: editForm.contract_value,
                    notes: editForm.notes,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", project.id);

            if (error) throw error;

            // Track contract changes
            const changes = [];
            if (editForm.contract_value !== project.contract_value) {
                changes.push(`Value: ${formatCurrency(project.contract_value)} → ${formatCurrency(editForm.contract_value || 0)}`);
            }
            if (editForm.start_date !== project.start_date) {
                changes.push(`Start Date changed`);
            }
            if (editForm.end_date !== project.end_date) {
                changes.push(`End Date changed`);
            }

            if (changes.length > 0) {
                const { data: { user } } = await supabase.auth.getUser();
                await supabase.from("project_updates").insert({
                    project_id: project.id,
                    update_type: "contract_update",
                    title: "Contract Updated",
                    description: changes.join(", "),
                    created_by: user?.id,
                    is_client_visible: true
                });
                // Refresh to get new history
                fetchProject();
            } else {
                setProject({ ...project, ...editForm });
            }

            setIsEditing(false);
            toast.success("Project updated successfully");
        } catch (error: any) {
            toast.error("Failed to update project", { description: error.message });
        } finally {
            setSaving(false);
        }
    };

    const handleViewContract = async () => {
        if (!contractDoc?.storage_path) return;
        try {
            const { data, error } = await supabase.storage
                .from('projects')
                .createSignedUrl(contractDoc.storage_path, 3600);
            if (error) throw error;
            window.open(data.signedUrl, '_blank');
        } catch (err) {
            toast.error("Failed to open contract");
        }
    };

    const handleDeleteContract = async () => {
        if (!confirm("Are you sure you want to delete the contract? This will remove the contract document and clear the contract value.")) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();

            // 1. Delete Document if exists
            if (contractDoc) {
                if (contractDoc.storage_path) {
                    await supabase.storage.from("projects").remove([contractDoc.storage_path]);
                }
                await supabase.from("project_documents").delete().eq("id", contractDoc.id);
            }

            // 2. Clear Project Fields
            await supabase.from("projects").update({
                contract_value: 0,
            }).eq("id", project?.id);

            // 3. Log
            await supabase.from("project_updates").insert({
                project_id: project?.id,
                update_type: "contract_deleted",
                title: "Contract Deleted",
                description: "Contract document deleted and value cleared.",
                created_by: user?.id,
                is_client_visible: true
            });

            toast.success("Contract deleted");
            fetchProject();
        } catch (error: any) {
            toast.error("Failed to delete contract");
        }
    };

    const handleAddMilestone = async () => {
        if (!milestoneForm.milestone_name || !milestoneForm.due_date) {
            toast.error("Please enter milestone name and due date");
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from("project_milestones")
                .insert({
                    project_id: params.id,
                    milestone_name: milestoneForm.milestone_name,
                    description: milestoneForm.description,
                    due_date: milestoneForm.due_date,
                    is_completed: false,
                    is_custom: true,
                    created_by: user?.id,
                    sort_order: milestones.length + 1,
                })
                .select()
                .single();

            if (error) throw error;

            setMilestones([...milestones, data]);
            setShowMilestoneModal(false);
            setMilestoneForm({ milestone_name: "", description: "", due_date: "" });
            toast.success("Custom milestone added");
        } catch (error: any) {
            toast.error("Failed to add milestone", { description: error.message });
        }
    };

    const toggleMilestoneComplete = async (milestone: Milestone) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { error } = await supabase
                .from("project_milestones")
                .update({
                    is_completed: !milestone.is_completed,
                    completion_date: !milestone.is_completed ? new Date().toISOString() : null,
                    completed_by: !milestone.is_completed ? user?.id : null,
                })
                .eq("id", milestone.id);

            if (error) throw error;

            setMilestones(
                milestones.map((m) =>
                    m.id === milestone.id
                        ? {
                            ...m,
                            is_completed: !m.is_completed,
                            completion_date: !m.is_completed ? new Date().toISOString() : "",
                        }
                        : m
                )
            );
            toast.success(milestone.is_completed ? "Milestone reopened" : "Milestone completed");
        } catch (error: any) {
            toast.error("Failed to update milestone");
        }
    };

    const deleteMilestone = async (id: string) => {
        if (!confirm("Delete this milestone?")) return;

        try {
            const { error } = await supabase.from("project_milestones").delete().eq("id", id);
            if (error) throw error;

            setMilestones(milestones.filter((m) => m.id !== id));
            toast.success("Milestone deleted");
        } catch (error: any) {
            toast.error("Failed to delete milestone");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
            case "in_progress":
                return "bg-blue-100 text-blue-700";
            case "completed":
                return "bg-green-100 text-green-700";
            case "planning":
                return "bg-yellow-100 text-yellow-700";
            case "on_hold":
                return "bg-gray-100 text-gray-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "active":
            case "in_progress":
                return <TrendingUp className="w-5 h-5" />;
            case "completed":
                return <CheckCircle2 className="w-5 h-5" />;
            case "planning":
                return <Clock className="w-5 h-5" />;
            case "on_hold":
                return <Pause className="w-5 h-5" />;
            default:
                return <AlertCircle className="w-5 h-5" />;
        }
    };

    const calculateProgress = () => {
        if (milestones.length === 0) return 0;
        const completed = milestones.filter((m) => m.is_completed).length;
        return Math.round((completed / milestones.length) * 100);
    };

    const formatCurrency = (value: number) => {
        if (!value) return "—";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const handleGenerateContract = async () => {
        if (!project) return;

        setGeneratingContract(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Generate contract HTML content
            const contractHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Service Contract - ${project.project_name}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
        h1 { color: #1A1A2E; border-bottom: 2px solid #FF6B35; padding-bottom: 10px; }
        h2 { color: #2D2D44; margin-top: 30px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .company-info { text-align: right; }
        .details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .detail-item { margin-bottom: 10px; }
        .detail-label { font-size: 12px; color: #666; text-transform: uppercase; }
        .detail-value { font-size: 16px; font-weight: 600; }
        .milestones { margin: 30px 0; }
        .milestone { background: #fff; border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .signature-section { margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .signature-block { border-top: 1px solid #333; padding-top: 10px; }
        .value { color: #FF6B35; font-size: 24px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>SERVICE CONTRACT</h1>
            <p>Contract #: ${project.project_code || 'IRS-' + project.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <div class="company-info">
            <strong>Infinite Rig Services, Inc.</strong><br>
            Monrovia, Liberia<br>
            info@infiniterigservices.com
        </div>
    </div>

    <h2>Client Information</h2>
    <div class="details">
        <div class="detail-item">
            <div class="detail-label">Client Company</div>
            <div class="detail-value">${project.client?.company_name || 'N/A'}</div>
        </div>
    </div>

    <h2>Project Details</h2>
    <div class="details">
        <div class="details-grid">
            <div class="detail-item">
                <div class="detail-label">Project Name</div>
                <div class="detail-value">${project.project_name}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Service Type</div>
                <div class="detail-value">${project.service_type || 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Start Date</div>
                <div class="detail-value">${project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">End Date</div>
                <div class="detail-value">${project.end_date ? new Date(project.end_date).toLocaleDateString() : 'TBD'}</div>
            </div>
            ${project.location ? `
            <div class="detail-item">
                <div class="detail-label">Location</div>
                <div class="detail-value">${project.location}</div>
            </div>` : ''}
            ${project.vessel_name ? `
            <div class="detail-item">
                <div class="detail-label">Vessel</div>
                <div class="detail-value">${project.vessel_name}</div>
            </div>` : ''}
        </div>
        <div class="detail-item" style="margin-top: 20px;">
            <div class="detail-label">Contract Value</div>
            <div class="value">${formatCurrency(project.contract_value)}</div>
        </div>
    </div>

    <h2>Description</h2>
    <p>${project.description || 'No description provided.'}</p>

    ${milestones.length > 0 ? `
    <h2>Project Milestones</h2>
    <div class="milestones">
        ${milestones.map((m, i) => `
        <div class="milestone">
            <strong>${i + 1}. ${m.milestone_name}</strong>
            ${m.description ? `<p>${m.description}</p>` : ''}
            ${m.due_date ? `<p><small>Due: ${new Date(m.due_date).toLocaleDateString()}</small></p>` : ''}
        </div>
        `).join('')}
    </div>` : ''}

    ${contractNote ? `
    <h2>Additional Notes</h2>
    <p>${contractNote}</p>` : ''}

    <div class="signature-section">
        <div>
            <p><strong>For Infinite Rig Services, Inc.</strong></p>
            <br><br>
            <div class="signature-block">
                <small>Authorized Signature & Date</small>
            </div>
        </div>
        <div>
            <p><strong>For ${project.client?.company_name || 'Client'}</strong></p>
            <br><br>
            <div class="signature-block">
                <small>Authorized Signature & Date</small>
            </div>
        </div>
    </div>

    <p style="text-align: center; margin-top: 60px; color: #999; font-size: 12px;">
        Generated on ${new Date().toLocaleString()}
    </p>
</body>
</html>`;

            // Create a Blob and upload to storage
            const blob = new Blob([contractHtml], { type: 'text/html' });
            const fileName = `contract_${project.project_code || project.id.slice(0, 8)}_${Date.now()}.html`;
            const filePath = `${project.id}/contracts/${fileName}`;

            // Upload to project storage
            const { error: uploadError } = await supabase.storage
                .from('projects')
                .upload(filePath, blob, {
                    contentType: 'text/html',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Create project_documents entry
            const { error: docError } = await supabase
                .from('project_documents')
                .insert({
                    project_id: project.id,
                    title: `Service Contract - ${project.project_name}`,
                    description: 'Auto-generated service contract',
                    storage_path: filePath,
                    file_type: 'text/html',
                    file_size: blob.size,
                    is_client_visible: true,
                    uploaded_by: user.id,
                });

            if (docError) throw docError;

            // Add activity entry
            await supabase.from('project_updates').insert({
                project_id: project.id,
                update_type: 'document_added',
                title: 'Contract Generated',
                description: 'Service contract has been generated and is available for download.',
                created_by: user.id,
                is_client_visible: true
            });

            toast.success('Contract generated successfully!', {
                description: 'The contract is now available in project documents.'
            });
            setShowContractModal(false);
            setContractNote('');
        } catch (error: any) {
            console.error('Error generating contract:', error);
            toast.error('Failed to generate contract', { description: error.message });
        } finally {
            setGeneratingContract(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Project not found</p>
                <Link href="/dashboard/projects" className="text-primary hover:underline">
                    Back to Projects
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Button & Actions */}
            <div className="flex items-center justify-between">
                <Link
                    href="/dashboard/projects"
                    className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Projects
                </Link>

                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditForm(project);
                                }}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                            >
                                <X className="w-4 h-4 inline mr-1" />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowContractModal(true)}
                                className="px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            >
                                <FileCheck className="w-4 h-4" />
                                Generate Contract
                            </button>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
                            >
                                <Edit3 className="w-4 h-4" />
                                Edit Project
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Project Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#1A1A2E] to-[#2D2D44] p-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editForm.project_name || ""}
                                    onChange={(e) => setEditForm({ ...editForm, project_name: e.target.value })}
                                    className="text-2xl font-bold bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white w-full md:w-auto"
                                />
                            ) : (
                                <h1 className="text-2xl font-bold">{project.project_name}</h1>
                            )}
                            {project.project_code && (
                                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mt-2">
                                    {project.project_code}
                                </span>
                            )}
                        </div>
                        {isEditing ? (
                            <select
                                value={editForm.status || ""}
                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                className="px-4 py-2 rounded-lg bg-white text-gray-900 font-medium"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                                    project.status
                                )}`}
                            >
                                {getStatusIcon(project.status)}
                                {project.status?.replace("_", " ")}
                            </span>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Project Progress</span>
                        <span className="text-sm font-bold text-primary">{calculateProgress()}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-primary to-orange-400 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${calculateProgress()}%` }}
                        ></div>
                    </div>
                </div>

                {/* Project Details */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Client */}
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Client</p>
                            <p className="font-semibold text-gray-900">{project.client?.company_name || "—"}</p>
                        </div>
                    </div>

                    {/* Contract Value */}
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Contract Value</p>
                            {isEditing ? (
                                <MoneyInput
                                    value={editForm.contract_value?.toString() || ""}
                                    onChange={(value) => setEditForm({ ...editForm, contract_value: value ? parseFloat(value) : 0 })}
                                    className="font-semibold text-gray-900 border border-gray-200 rounded px-2 py-1 w-full"
                                />
                            ) : (
                                <p className="font-semibold text-gray-900">{formatCurrency(project.contract_value)}</p>
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Timeline</p>
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={editForm.start_date?.split("T")[0] || ""}
                                        onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
                                        className="text-sm border border-gray-200 rounded px-2 py-1"
                                    />
                                    <input
                                        type="date"
                                        value={editForm.end_date?.split("T")[0] || ""}
                                        onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
                                        className="text-sm border border-gray-200 rounded px-2 py-1"
                                    />
                                </div>
                            ) : (
                                <p className="font-semibold text-gray-900">
                                    {project.start_date
                                        ? new Date(project.start_date).toLocaleDateString()
                                        : "—"}
                                    {project.end_date && ` - ${new Date(project.end_date).toLocaleDateString()}`}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Service Type */}
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Service Type</p>
                            <p className="font-semibold text-gray-900 capitalize">{project.service_type || "—"}</p>
                        </div>
                    </div>
                </div>

                {/* Description & Notes */}
                {(project.description || isEditing) && (
                    <div className="p-6 border-t border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                        {isEditing ? (
                            <textarea
                                value={editForm.description || ""}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg p-3 text-gray-700"
                                rows={3}
                            />
                        ) : (
                            <p className="text-gray-600">{project.description}</p>
                        )}
                    </div>
                )}

                {/* Link to Service Request */}
                {project.service_request_id && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <Link
                            href={`/dashboard/requests`}
                            className="inline-flex items-center gap-2 text-primary hover:text-orange-600 font-medium"
                        >
                            <ExternalLink className="w-4 h-4" />
                            View Original Service Request
                        </Link>
                    </div>
                )}
            </div>

            {/* Contract Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Contract Management</h2>
                    {contractDoc && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleViewContract}
                                className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                            >
                                <ExternalLink className="w-4 h-4" />
                                View Contract
                            </button>
                            <button
                                onClick={handleDeleteContract}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 text-sm font-medium"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-6">
                    {!contractDoc ? (
                        <div className="text-center py-6">
                            <FileCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 mb-4">No formal contract generated yet.</p>
                            <button
                                onClick={() => setShowContractModal(true)}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 text-sm font-medium"
                            >
                                Generate Contract
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileCheck className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{contractDoc.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        Generated on {new Date(contractDoc.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <History className="w-4 h-4" />
                                Contract History
                            </h3>
                            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                                {contractHistory.length > 0 ? (
                                    contractHistory.map((update) => (
                                        <div key={update.id} className="relative pl-6 border-l-2 border-gray-200 pb-4 last:border-0 last:pb-0">
                                            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-400"></div>
                                            <p className="text-sm font-medium text-gray-900">{update.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{update.description}</p>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {new Date(update.created_at).toLocaleString()} by {update.profiles?.full_name || 'System'}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No updates recorded.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Milestones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Project Milestones</h2>
                    <button
                        onClick={() => setShowMilestoneModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add Milestone
                    </button>
                </div>

                {milestones.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {milestones.map((milestone, index) => (
                            <div key={milestone.id} className="p-6 flex items-start gap-4 hover:bg-gray-50">
                                <button
                                    onClick={() => toggleMilestoneComplete(milestone)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${milestone.is_completed
                                        ? "bg-green-100 text-green-600 hover:bg-green-200"
                                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                        }`}
                                >
                                    {milestone.is_completed ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        <span className="text-sm font-bold">{index + 1}</span>
                                    )}
                                </button>
                                <div className="flex-1">
                                    <h3
                                        className={`font-semibold ${milestone.is_completed ? "text-green-700 line-through" : "text-gray-900"
                                            }`}
                                    >
                                        {milestone.milestone_name}
                                    </h3>
                                    {milestone.description && (
                                        <p className="text-gray-500 text-sm mt-1">{milestone.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 mt-2 text-sm">
                                        {milestone.due_date && (
                                            <span className="text-gray-500 flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Due: {new Date(milestone.due_date).toLocaleDateString()}
                                            </span>
                                        )}
                                        {milestone.completion_date && (
                                            <span className="text-green-600 flex items-center gap-1">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Completed: {new Date(milestone.completion_date).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteMilestone(milestone.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No milestones defined yet</p>
                    </div>
                )}
            </div>

            {/* Add Milestone Modal */}
            {showMilestoneModal && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setShowMilestoneModal(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Milestone</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Milestone Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={milestoneForm.milestone_name}
                                        onChange={(e) =>
                                            setMilestoneForm({ ...milestoneForm, milestone_name: e.target.value })
                                        }
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="e.g., Initial Assessment Complete"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={milestoneForm.description}
                                        onChange={(e) =>
                                            setMilestoneForm({ ...milestoneForm, description: e.target.value })
                                        }
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        rows={3}
                                        placeholder="Optional description..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={milestoneForm.due_date}
                                        onChange={(e) =>
                                            setMilestoneForm({ ...milestoneForm, due_date: e.target.value })
                                        }
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowMilestoneModal(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddMilestone}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600"
                                >
                                    Add Milestone
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Generate Contract Modal */}
            {showContractModal && project && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setShowContractModal(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <FileCheck className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Generate Contract</h3>
                                    <p className="text-sm text-gray-500">Create a service contract document</p>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Contract Preview</h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-gray-500">Client:</span>
                                        <p className="font-medium">{project.client?.company_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Project:</span>
                                        <p className="font-medium">{project.project_name}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Contract Value:</span>
                                        <p className="font-medium text-green-600">{formatCurrency(project.contract_value)}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Milestones:</span>
                                        <p className="font-medium">{milestones.length} defined</p>
                                    </div>
                                </div>
                            </div>

                            {/* Note */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Additional Notes (optional)
                                </label>
                                <textarea
                                    value={contractNote}
                                    onChange={(e) => setContractNote(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    rows={3}
                                    placeholder="Any additional terms or notes to include in the contract..."
                                />
                            </div>

                            <p className="text-xs text-gray-500 mb-4">
                                The contract will be saved to Project Documents and made visible to the client.
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowContractModal(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleGenerateContract}
                                    disabled={generatingContract}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {generatingContract ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <FileCheck className="w-4 h-4" />
                                            Generate Contract
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
