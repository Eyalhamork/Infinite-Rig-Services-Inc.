"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import {
    FolderKanban,
    Search,
    Filter,
    ChevronRight,
    Calendar,
    DollarSign,
    Building2,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertCircle,
    Pause,
    Loader2,
} from "lucide-react";

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
    service_type: string;
    contract_value: number;
    client_id: string;
    service_request_id: string;
    created_at: string;
    client: {
        company_name: string;
    };
}

const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "planning", label: "Planning" },
    { value: "in_progress", label: "In Progress" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
];

const serviceOptions = [
    { value: "all", label: "All Services" },
    { value: "manning", label: "Manning" },
    { value: "offshore", label: "Offshore" },
    { value: "hse", label: "HSE" },
    { value: "supply", label: "Supply Chain" },
    { value: "waste", label: "Waste Management" },
];

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [serviceFilter, setServiceFilter] = useState("all");

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            const { data, error } = await supabase
                .from("projects")
                .select(`
          *,
          client:clients(company_name)
        `)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setProjects(data || []);
            setFilteredProjects(data || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let filtered = [...projects];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (p) =>
                    p.project_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.project_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.client?.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((p) => p.status === statusFilter);
        }

        // Apply service filter
        if (serviceFilter !== "all") {
            filtered = filtered.filter((p) => p.service_type === serviceFilter);
        }

        setFilteredProjects(filtered);
    }, [searchQuery, statusFilter, serviceFilter, projects]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
            case "in_progress":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "completed":
                return "bg-green-100 text-green-700 border-green-200";
            case "planning":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "on_hold":
                return "bg-gray-100 text-gray-600 border-gray-200";
            case "cancelled":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "active":
            case "in_progress":
                return <TrendingUp className="w-4 h-4" />;
            case "completed":
                return <CheckCircle2 className="w-4 h-4" />;
            case "planning":
                return <Clock className="w-4 h-4" />;
            case "on_hold":
                return <Pause className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const formatCurrency = (value: number) => {
        if (!value) return "—";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Stats
    const stats = {
        total: projects.length,
        active: projects.filter((p) => p.status === "active" || p.status === "in_progress").length,
        completed: projects.filter((p) => p.status === "completed").length,
        totalValue: projects.reduce((sum, p) => sum + (p.contract_value || 0), 0),
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    <p className="text-gray-500">
                        Manage approved client projects
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FolderKanban className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            <p className="text-sm text-gray-500">Total Projects</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                            <p className="text-sm text-gray-500">Active</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                            <p className="text-sm text-gray-500">Completed</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
                            <p className="text-sm text-gray-500">Total Value</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search projects or clients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white min-w-[150px]"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Service Filter */}
                    <div className="relative">
                        <select
                            value={serviceFilter}
                            onChange={(e) => setServiceFilter(e.target.value)}
                            className="appearance-none px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white min-w-[150px]"
                        >
                            {serviceOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Projects List */}
            {filteredProjects.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Project
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Client
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Service
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Contract Value
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Timeline
                                    </th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProjects.map((project) => (
                                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <FolderKanban className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{project.project_name}</p>
                                                    {project.project_code && (
                                                        <p className="text-xs text-gray-500">{project.project_code}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-700">{project.client?.company_name || "—"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-medium capitalize">
                                                {project.service_type || "—"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                    project.status
                                                )}`}
                                            >
                                                {getStatusIcon(project.status)}
                                                {project.status?.replace("_", " ") || "—"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-900">
                                                {formatCurrency(project.contract_value)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {project.start_date ? (
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {new Date(project.start_date).toLocaleDateString()}
                                                        {project.end_date && ` - ${new Date(project.end_date).toLocaleDateString()}`}
                                                    </span>
                                                </div>
                                            ) : (
                                                "—"
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/dashboard/projects/${project.id}`}
                                                className="inline-flex items-center gap-1 text-primary hover:text-orange-600 font-medium text-sm"
                                            >
                                                View
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                    <FolderKanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No projects found
                    </h3>
                    <p className="text-gray-500">
                        {searchQuery || statusFilter !== "all" || serviceFilter !== "all"
                            ? "Try adjusting your filters"
                            : "Projects will appear here when service requests are approved"}
                    </p>
                </div>
            )}
        </div>
    );
}
