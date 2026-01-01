"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  FileText,
  Download,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  DollarSign,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-700", icon: Clock },
  reviewing: { label: "Under Review", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  shortlisted: { label: "Shortlisted", color: "bg-purple-100 text-purple-700", icon: CheckCircle },
  interview_scheduled: { label: "Interview Scheduled", color: "bg-indigo-100 text-indigo-700", icon: Calendar },
  interview_completed: { label: "Interview Completed", color: "bg-cyan-100 text-cyan-700", icon: CheckCircle },
  offer_extended: { label: "Offer Extended", color: "bg-green-100 text-green-700", icon: CheckCircle },
  accepted: { label: "Accepted", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
  withdrawn: { label: "Withdrawn", color: "bg-gray-100 text-gray-600", icon: XCircle },
};

const statusOrder = [
  "submitted",
  "reviewing",
  "shortlisted",
  "interview_scheduled",
  "interview_completed",
  "offer_extended",
  "accepted",
];

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchApplication();
  }, [params.id]);

  // Auto-update status to reviewing if it's submitted
  useEffect(() => {
    if (application && application.status === 'submitted' && !updating) {
      updateStatus('reviewing');
    }
  }, [application?.status]);

  const fetchApplication = async () => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          profiles:applicant_id (id, full_name, email, phone, avatar_url),
          job_postings:job_id (id, title, department, location, employment_type),
          reviewer:reviewed_by (full_name)
        `)
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setApplication(data);
      setNotes(data.notes || "");
    } catch (error) {
      console.error("Error fetching application:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("applications")
        .update({
          status: newStatus,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", params.id);

      if (error) throw error;
      setApplication({ ...application, status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const saveNotes = async () => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ notes })
        .eq("id", params.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35]" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">Application not found</p>
        <Link href="/dashboard/applications" className="text-[#FF6B35] mt-4 inline-block">
          Back to Applications
        </Link>
      </div>
    );
  }

  const status = statusConfig[application.status] || statusConfig.submitted;
  const StatusIcon = status.icon;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/applications"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {application.profiles?.full_name}
            </h1>
            <p className="text-gray-600">
              Applied for {application.job_postings?.title}
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${status.color}`}>
          <StatusIcon className="h-4 w-4" />
          <span>{status.label}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Applicant Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${application.profiles?.email}`} className="text-[#FF6B35] hover:underline">
                    {application.profiles?.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a href={`tel:${application.phone}`} className="text-[#FF6B35] hover:underline">
                    {application.phone}
                  </a>
                </div>
              </div>
              {application.current_position && (
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Current Position</p>
                    <p className="text-gray-900">{application.current_position}</p>
                  </div>
                </div>
              )}
              {application.years_experience && (
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="text-gray-900">{application.years_experience} years</p>
                  </div>
                </div>
              )}
              {application.expected_salary && (
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Expected Salary</p>
                    <p className="text-gray-900">{application.expected_salary}</p>
                  </div>
                </div>
              )}
              {application.availability_date && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Available From</p>
                    <p className="text-gray-900">{formatDate(application.availability_date)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
              {application.resume_url && (
                <a
                  href={application.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b]"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Resume</span>
                </a>
              )}
              {application.linkedin_url && (
                <a
                  href={application.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>LinkedIn</span>
                </a>
              )}
              {application.portfolio_url && (
                <a
                  href={application.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          </div>

          {/* Cover Letter */}
          {application.cover_letter && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Cover Letter</h2>
              <div className="prose prose-gray max-w-none">
                <p className="whitespace-pre-wrap text-gray-600">{application.cover_letter}</p>
              </div>
            </div>
          )}

          {/* Internal Notes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Internal Notes</h2>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={saveNotes}
              placeholder="Add notes about this candidate..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">Notes are saved automatically</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Position</h2>
            <div className="space-y-3">
              <p className="font-semibold text-gray-900">{application.job_postings?.title}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Briefcase className="h-4 w-4" />
                <span>{application.job_postings?.department}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{application.job_postings?.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{application.job_postings?.employment_type}</span>
              </div>
            </div>
            <Link
              href={`/dashboard/jobs/${application.job_id}`}
              className="inline-flex items-center text-[#FF6B35] text-sm mt-4 hover:underline"
            >
              View Job Details
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Applied</span>
                <span className="font-medium">{formatDate(application.created_at)}</span>
              </div>
              {application.reviewed_at && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Reviewed</span>
                  <span className="font-medium">{formatDate(application.reviewed_at)}</span>
                </div>
              )}
              {application.reviewer?.full_name && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Reviewed By</span>
                  <span className="font-medium">{application.reviewer.full_name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Update Status</h2>
            <div className="space-y-2">
              {statusOrder.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={updating || application.status === s}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium text-left transition-colors ${application.status === s
                      ? "bg-[#FF6B35] text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    } disabled:opacity-50`}
                >
                  {statusConfig[s]?.label}
                </button>
              ))}
              <hr className="my-2" />
              <button
                onClick={() => updateStatus("rejected")}
                disabled={updating || application.status === "rejected"}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium text-left bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
