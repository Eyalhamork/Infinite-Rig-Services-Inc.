"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  Mail,
  Download,
  MoreHorizontal,
  FileText,
  Calendar,
  MapPin,
  Briefcase,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ApplicationStatus =
  | "submitted"
  | "reviewing"
  | "shortlisted"
  | "interview_scheduled"
  | "interview_completed"
  | "offer_extended"
  | "accepted"
  | "rejected"
  | "withdrawn";

interface Application {
  id: string;
  created_at: string;
  status: ApplicationStatus;
  resume_url: string;
  cover_letter: string;
  phone: string;
  years_experience: number;
  current_position: string;
  expected_salary: string;
  notes: string;
  job_postings: {
    id: string;
    title: string;
    department: string;
    location: string;
  };
  profiles: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string;
  };
}

const statusConfig: Record<
  ApplicationStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  submitted: {
    label: "Submitted",
    color: "bg-gray-100 text-gray-700",
    icon: Clock,
  },
  reviewing: {
    label: "Reviewing",
    color: "bg-blue-100 text-blue-700",
    icon: Eye,
  },
  shortlisted: {
    label: "Shortlisted",
    color: "bg-purple-100 text-purple-700",
    icon: CheckCircle,
  },
  interview_scheduled: {
    label: "Interview Scheduled",
    color: "bg-yellow-100 text-yellow-700",
    icon: Calendar,
  },
  interview_completed: {
    label: "Interview Done",
    color: "bg-indigo-100 text-indigo-700",
    icon: CheckCircle,
  },
  offer_extended: {
    label: "Offer Extended",
    color: "bg-orange-100 text-orange-700",
    icon: Mail,
  },
  accepted: {
    label: "Accepted",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
  withdrawn: {
    label: "Withdrawn",
    color: "bg-gray-100 text-gray-500",
    icon: AlertCircle,
  },
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchApplications();

    // Mark application notifications as read
    const markRead = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("type", "application");
    };
    markRead();
  }, [statusFilter, departmentFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("applications")
        .select(
          `
          *,
          job_postings (id, title, department, location),
          profiles (id, full_name, email, avatar_url)
        `
        )
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filtered = data || [];

      if (departmentFilter !== "all") {
        filtered = filtered.filter(
          (app) => app.job_postings?.department === departmentFilter
        );
      }

      setApplications(filtered);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: ApplicationStatus) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
      setActionMenuId(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      app.profiles?.full_name?.toLowerCase().includes(query) ||
      app.profiles?.email?.toLowerCase().includes(query) ||
      app.job_postings?.title?.toLowerCase().includes(query)
    );
  });

  const departments = [
    ...new Set(applications.map((a) => a.job_postings?.department).filter(Boolean)),
  ];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Job Applications
          </h1>
          <p className="text-gray-600">
            Manage and review all job applications
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            {filteredApplications.length} application
            {filteredApplications.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors lg:hidden"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>

            <div
              className={`flex flex-col lg:flex-row gap-3 ${showFilters ? "block" : "hidden lg:flex"
                }`}
            >
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none bg-white"
              >
                <option value="all">All Status</option>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none bg-white"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35] mx-auto" />
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((application) => {
                  const status = statusConfig[application.status];
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={application.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#004E89] rounded-full flex items-center justify-center text-white font-semibold">
                            {application.profiles?.full_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2) || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {application.profiles?.full_name || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {application.profiles?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {application.job_postings?.title || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {application.job_postings?.department}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          <span>{status.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(application.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/dashboard/applications/${application.id}`}
                            className="p-2 text-gray-600 hover:text-[#FF6B35] hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          {application.resume_url && (
                            <a
                              href={application.resume_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-600 hover:text-[#FF6B35] hover:bg-gray-100 rounded-lg transition-colors"
                              title="Download Resume"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          )}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setActionMenuId(
                                  actionMenuId === application.id
                                    ? null
                                    : application.id
                                )
                              }
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {actionMenuId === application.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setActionMenuId(null)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                                  <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                                    Update Status
                                  </p>
                                  {Object.entries(statusConfig).map(
                                    ([key, config]) => (
                                      <button
                                        key={key}
                                        onClick={() =>
                                          updateStatus(
                                            application.id,
                                            key as ApplicationStatus
                                          )
                                        }
                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${application.status === key
                                            ? "bg-gray-50"
                                            : ""
                                          }`}
                                      >
                                        <config.icon className="h-4 w-4" />
                                        <span>{config.label}</span>
                                      </button>
                                    )
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
