"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Briefcase, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const departments = [
    "Offshore Operations",
    "Supply Chain & Logistics",
    "Manning Services",
    "Health, Safety, Security & Environment",
    "Finance & Administration",
    "Human Resources",
    "Information Technology",
    "Asset Integrity & Inspection",
    "Marine Operations & Towage",
    "Maritime Security",
];

export default function EditJobPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        department: "",
        location: "",
        employment_type: "",
        experience_level: "",
        salary_range: "",
        description: "",
        requirements: "",
        responsibilities: "",
        qualifications: "",
        benefits: "",
        status: "",
        closing_date: "",
        positions_available: 1,
    });
    const supabase = createClient();

    useEffect(() => {
        fetchJob();
    }, []);

    const fetchJob = async () => {
        try {
            const { data, error } = await supabase
                .from("job_postings")
                .select("*")
                .eq("id", params.id)
                .single();

            if (error) throw error;
            if (data) {
                setFormData({
                    title: data.title,
                    department: data.department,
                    location: data.location,
                    employment_type: data.employment_type,
                    experience_level: data.experience_level || "Mid-level",
                    salary_range: data.salary_range || "",
                    description: data.description,
                    requirements: data.requirements || "",
                    responsibilities: data.responsibilities || "",
                    qualifications: data.qualifications || "", // Handle new field
                    benefits: data.benefits || "",
                    status: data.status,
                    closing_date: data.closing_date || "",
                    positions_available: data.positions_available || 1,
                });
            }
        } catch (error) {
            console.error("Error fetching job:", error);
            alert("Failed to load job details");
            router.push("/dashboard/jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from("job_postings")
                .update({
                    ...formData,
                    updated_at: new Date().toISOString(),
                    closing_date: formData.closing_date || null,
                })
                .eq("id", params.id);

            if (error) throw error;
            router.push("/dashboard/jobs");
        } catch (error) {
            console.error("Error updating job:", error);
            alert("Failed to update job posting");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35]" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Link
                    href="/dashboard/jobs"
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Job Posting</h1>
                    <p className="text-gray-600">Update job details</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department *
                        </label>
                        <select
                            required
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
                        >
                            <option value="">Select department...</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Employment Type
                        </label>
                        <select
                            value={formData.employment_type}
                            onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Temporary">Temporary</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Experience Level
                        </label>
                        <select
                            value={formData.experience_level}
                            onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
                        >
                            <option value="Entry-level">Entry-level</option>
                            <option value="Mid-level">Mid-level</option>
                            <option value="Senior">Senior</option>
                            <option value="Executive">Executive</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Salary Range
                        </label>
                        <input
                            type="text"
                            value={formData.salary_range}
                            onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Positions Available
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={formData.positions_available}
                            onChange={(e) => setFormData({ ...formData, positions_available: parseInt(e.target.value) })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Closing Date
                        </label>
                        <input
                            type="date"
                            value={formData.closing_date}
                            onChange={(e) => setFormData({ ...formData, closing_date: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Description *
                    </label>
                    <textarea
                        required
                        rows={5}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Requirements *
                    </label>
                    <textarea
                        required
                        rows={5}
                        value={formData.requirements}
                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        placeholder="One per line..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Responsibilities
                    </label>
                    <textarea
                        rows={5}
                        value={formData.responsibilities}
                        onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                        placeholder="One per line..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qualifications
                    </label>
                    <textarea
                        rows={5}
                        value={formData.qualifications}
                        onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                        placeholder="One per line..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Benefits
                    </label>
                    <textarea
                        rows={3}
                        value={formData.benefits}
                        onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                        placeholder="List benefits..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none resize-none"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="closed">Closed</option>
                            <option value="filled">Filled</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/dashboard/jobs"
                            className="px-6 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors disabled:opacity-50"
                        >
                            {saving ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                            ) : (
                                <Save className="h-5 w-5" />
                            )}
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
