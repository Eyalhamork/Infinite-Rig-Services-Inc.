"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Briefcase,
  MapPin,
  Calendar,
  Users,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience_level: string;
  salary_range: string;
  status: "draft" | "published" | "closed" | "filled";
  closing_date: string;
  positions_available: number;
  created_at: string;
  _count?: { applications: number };
}

const statusConfig = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700" },
  published: { label: "Published", color: "bg-green-100 text-green-700" },
  closed: { label: "Closed", color: "bg-red-100 text-red-700" },
  filled: { label: "Filled", color: "bg-blue-100 text-blue-700" },
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("job_postings")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Get application counts
      const jobsWithCounts = await Promise.all(
        (data || []).map(async (job) => {
          const { count } = await supabase
            .from("applications")
            .select("*", { count: "exact", head: true })
            .eq("job_id", job.id);
          return { ...job, _count: { applications: count || 0 } };
        })
      );

      setJobs(jobsWithCounts);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: JobPosting["status"]) => {
    try {
      const { error } = await supabase
        .from("job_postings")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j))
      );
      setActionMenuId(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteJob = async (id: string) => {
    try {
      const { error } = await supabase
        .from("job_postings")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setJobs((prev) => prev.filter((j) => j.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.department.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query)
    );
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-600">Manage your job listings</p>
        </div>
        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Post New Job</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
            <option value="filled">Filled</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35] mx-auto" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-8 text-center">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No job postings found</p>
            <Link
              href="/dashboard/jobs/new"
              className="inline-flex items-center space-x-2 mt-4 text-[#FF6B35] hover:underline"
            >
              <Plus className="h-4 w-4" />
              <span>Create your first job posting</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusConfig[job.status].color
                        }`}
                      >
                        {statusConfig[job.status].label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center space-x-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{job.department}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Posted {formatDate(job.created_at)}</span>
                      </span>
                      {job.closing_date && (
                        <span className="flex items-center space-x-1 text-orange-600">
                          <Calendar className="h-4 w-4" />
                          <span>Closes {formatDate(job.closing_date)}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-500">
                        {job.employment_type}
                      </span>
                      {job.experience_level && (
                        <span className="text-gray-500">
                          {job.experience_level}
                        </span>
                      )}
                      {job.salary_range && (
                        <span className="text-green-600 font-medium">
                          {job.salary_range}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <div className="text-center px-4 py-2 bg-gray-100 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">
                        {job._count?.applications || 0}
                      </p>
                      <p className="text-xs text-gray-500">Applications</p>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setActionMenuId(
                            actionMenuId === job.id ? null : job.id
                          )
                        }
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>

                      {actionMenuId === job.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setActionMenuId(null)}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                            <Link
                              href={`/dashboard/jobs/${job.id}`}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Edit className="h-4 w-4" />
                              <span>Edit</span>
                            </Link>
                            <Link
                              href={`/careers/${job.id}`}
                              target="_blank"
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>View Public Page</span>
                            </Link>
                            <hr className="my-1" />
                            {job.status === "draft" && (
                              <button
                                onClick={() => updateStatus(job.id, "published")}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 text-green-600"
                              >
                                <Eye className="h-4 w-4" />
                                <span>Publish</span>
                              </button>
                            )}
                            {job.status === "published" && (
                              <button
                                onClick={() => updateStatus(job.id, "closed")}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 text-orange-600"
                              >
                                <EyeOff className="h-4 w-4" />
                                <span>Close Job</span>
                              </button>
                            )}
                            {job.status === "closed" && (
                              <button
                                onClick={() => updateStatus(job.id, "filled")}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 text-blue-600"
                              >
                                <Users className="h-4 w-4" />
                                <span>Mark as Filled</span>
                              </button>
                            )}
                            <hr className="my-1" />
                            <button
                              onClick={() => setDeleteConfirm(job.id)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 flex items-center space-x-2 text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Job Posting?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. All applications for this job will
              also be deleted.
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteJob(deleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
