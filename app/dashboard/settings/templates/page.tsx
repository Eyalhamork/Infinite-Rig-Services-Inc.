"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Settings,
    Briefcase,
    Plus,
    Edit3,
    Trash2,
    Save,
    X,
    Clock,
    ChevronDown,
    ChevronUp,
    GripVertical,
    Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface MilestoneTemplate {
    name: string;
    description: string;
    order: number;
    days_offset: number;
}

interface ServiceTemplate {
    id: string;
    service_type: string;
    default_milestones: MilestoneTemplate[];
    required_documents: { name: string; category: string }[];
    updated_at: string;
}

const SERVICE_TYPES = [
    { value: "manning", label: "Manning & Recruitment", color: "bg-blue-500" },
    { value: "offshore", label: "Offshore Services", color: "bg-purple-500" },
    { value: "hse", label: "HSE Consulting", color: "bg-green-500" },
    { value: "supply", label: "Supply Chain", color: "bg-orange-500" },
    { value: "waste", label: "Waste Management", color: "bg-teal-500" },
    { value: "asset-integrity", label: "Asset Integrity & Inspection", color: "bg-amber-500" },
    { value: "rig-move", label: "Rig Move & Marine Towage", color: "bg-cyan-500" },
    { value: "security", label: "Maritime Security", color: "bg-slate-500" },
];

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<ServiceTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedType, setExpandedType] = useState<string | null>(null);
    const [editingType, setEditingType] = useState<string | null>(null);
    const [editMilestones, setEditMilestones] = useState<MilestoneTemplate[]>([]);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const { data, error } = await supabase
                .from("project_templates")
                .select("*")
                .order("service_type");

            if (error) throw error;
            setTemplates(data || []);
        } catch (error) {
            console.error("Error fetching templates:", error);
            toast.error("Failed to load templates");
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (template: ServiceTemplate) => {
        setEditingType(template.service_type);
        setEditMilestones([...template.default_milestones]);
    };

    const cancelEditing = () => {
        setEditingType(null);
        setEditMilestones([]);
    };

    const addMilestone = () => {
        setEditMilestones([
            ...editMilestones,
            {
                name: "",
                description: "",
                order: editMilestones.length + 1,
                days_offset: 0,
            },
        ]);
    };

    const removeMilestone = (index: number) => {
        const updated = editMilestones.filter((_, i) => i !== index);
        // Re-order
        setEditMilestones(updated.map((m, i) => ({ ...m, order: i + 1 })));
    };

    const updateMilestone = (index: number, field: keyof MilestoneTemplate, value: string | number) => {
        const updated = [...editMilestones];
        updated[index] = { ...updated[index], [field]: value };
        setEditMilestones(updated);
    };

    const moveMilestone = (index: number, direction: "up" | "down") => {
        if (
            (direction === "up" && index === 0) ||
            (direction === "down" && index === editMilestones.length - 1)
        ) return;

        const updated = [...editMilestones];
        const newIndex = direction === "up" ? index - 1 : index + 1;
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        // Re-order
        setEditMilestones(updated.map((m, i) => ({ ...m, order: i + 1 })));
    };

    const saveTemplate = async () => {
        if (!editingType) return;

        // Validate
        const emptyMilestones = editMilestones.filter((m) => !m.name.trim());
        if (emptyMilestones.length > 0) {
            toast.error("All milestones must have a name");
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from("project_templates")
                .update({
                    default_milestones: editMilestones,
                    updated_at: new Date().toISOString(),
                })
                .eq("service_type", editingType);

            if (error) throw error;

            toast.success("Template saved successfully");
            setEditingType(null);
            setEditMilestones([]);
            fetchTemplates();
        } catch (error: any) {
            console.error("Error saving template:", error);
            toast.error("Failed to save template", { description: error.message });
        } finally {
            setSaving(false);
        }
    };

    const getServiceInfo = (type: string) => {
        return SERVICE_TYPES.find((s) => s.value === type) || { label: type, color: "bg-gray-500" };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link
                        href="/dashboard/settings"
                        className="inline-flex items-center text-gray-600 hover:text-primary transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Settings
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Project Templates</h1>
                    <p className="text-gray-600">
                        Configure default milestones for each service type
                    </p>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                    <strong>How it works:</strong> When a service request is approved, the project
                    automatically gets these milestones. Days offset is relative to project start date.
                </p>
            </div>

            {/* Templates List */}
            <div className="space-y-4">
                {templates.map((template) => {
                    const serviceInfo = getServiceInfo(template.service_type);
                    const isExpanded = expandedType === template.service_type;
                    const isEditing = editingType === template.service_type;

                    return (
                        <div
                            key={template.id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                        >
                            {/* Header */}
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                                onClick={() => setExpandedType(isExpanded ? null : template.service_type)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 ${serviceInfo.color} rounded-lg flex items-center justify-center`}>
                                        <Briefcase className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{serviceInfo.label}</h3>
                                        <p className="text-sm text-gray-500">
                                            {template.default_milestones.length} milestone{template.default_milestones.length !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!isEditing && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEditing(template);
                                                setExpandedType(template.service_type);
                                            }}
                                            className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                    )}
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="border-t border-gray-200">
                                    {isEditing ? (
                                        // Edit Mode
                                        <div className="p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-gray-900">Edit Milestones</h4>
                                                <button
                                                    onClick={addMilestone}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Add Milestone
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                {editMilestones.map((milestone, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                                                    >
                                                        <div className="flex flex-col gap-1 pt-2">
                                                            <button
                                                                onClick={() => moveMilestone(index, "up")}
                                                                disabled={index === 0}
                                                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                            >
                                                                <ChevronUp className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => moveMilestone(index, "down")}
                                                                disabled={index === editMilestones.length - 1}
                                                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                            >
                                                                <ChevronDown className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                                                            <div className="md:col-span-2">
                                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                    Milestone Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={milestone.name}
                                                                    onChange={(e) => updateMilestone(index, "name", e.target.value)}
                                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                                    placeholder="e.g., Requirements Gathering"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                                    Days Offset
                                                                </label>
                                                                <div className="relative">
                                                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                    <input
                                                                        type="number"
                                                                        value={milestone.days_offset}
                                                                        onChange={(e) => updateMilestone(index, "days_offset", parseInt(e.target.value) || 0)}
                                                                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                                        min="0"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex items-end">
                                                                <button
                                                                    onClick={() => removeMilestone(index)}
                                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {editMilestones.length === 0 && (
                                                    <div className="text-center py-8 text-gray-500">
                                                        No milestones. Click "Add Milestone" to create one.
                                                    </div>
                                                )}
                                            </div>

                                            {/* Save/Cancel Buttons */}
                                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                                <button
                                                    onClick={cancelEditing}
                                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={saveTemplate}
                                                    disabled={saving}
                                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {saving ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Save className="w-4 h-4" />
                                                    )}
                                                    Save Template
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // View Mode
                                        <div className="p-4">
                                            {template.default_milestones.length > 0 ? (
                                                <div className="space-y-2">
                                                    {template.default_milestones.map((milestone, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                                                                    {milestone.order}
                                                                </span>
                                                                <div>
                                                                    <p className="font-medium text-gray-900">{milestone.name}</p>
                                                                    {milestone.description && (
                                                                        <p className="text-sm text-gray-500">{milestone.description}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                                <Clock className="w-4 h-4" />
                                                                +{milestone.days_offset} days
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    No milestones defined for this service type
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {templates.length === 0 && (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                        <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No templates found. Run the migration to seed default templates.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
