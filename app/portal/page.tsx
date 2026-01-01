"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import VerificationModal from "@/components/ui/VerificationModal";
import {
  FolderKanban,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Calendar,
  Briefcase,
  Layers,
  MoreHorizontal
} from "lucide-react";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DashboardStats {
  activeProjects: number;
  totalProjects: number;
  unreadMessages: number;
  sharedDocuments: number;
  serviceRequests: number;
}

interface RecentProject {
  id: string;
  project_name: string;
  status: string;
  updated_at: string;
}

interface RecentMessage {
  id: string;
  message: string;
  sender_name: string;
  created_at: string;
  project_name: string;
}

export default function PortalDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    totalProjects: 0,
    unreadMessages: 0,
    sharedDocuments: 0,
    serviceRequests: 0,
  });
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);

  const [loading, setLoading] = useState(true);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setShowVerifiedModal(true);
      // Clean up the URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("verified");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Get client's company
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!profile) return;

        // Get client record
        const { data: client } = await supabase
          .from("clients")
          .select("id")
          .eq("primary_contact_id", user.id)
          .single();

        if (client) {
          // Fetch projects
          const { data: projects, count: projectCount } = await supabase
            .from("projects")
            .select("*", { count: "exact" })
            .eq("client_id", client.id);

          const activeCount =
            projects?.filter((p) => p.status === "in_progress").length || 0;

          // Fetch recent projects
          const { data: recent } = await supabase
            .from("projects")
            .select("id, project_name, status, updated_at")
            .eq("client_id", client.id)
            .order("updated_at", { ascending: false })
            .limit(5);

          setRecentProjects(recent || []);

          // Fetch documents count
          const { count: docCount } = await supabase
            .from("documents")
            .select("*", { count: "exact", head: true })
            .eq("client_id", client.id);

          // Fetch messages count (simplified)
          const { count: msgCount } = await supabase
            .from("project_messages")
            .select("*", { count: "exact", head: true })
            .in(
              "project_id",
              projects?.map((p) => p.id) || []
            )
            .eq("is_read", false);

          // Fetch Service Requests count
          const { count: requestCount } = await supabase
            .from("service_requests")
            .select("*", { count: "exact", head: true })
            .eq("client_id", client.id)
            .neq("status", "cancelled");

          setStats({
            activeProjects: activeCount,
            totalProjects: projectCount || 0,
            unreadMessages: msgCount || 0,
            sharedDocuments: docCount || 0,
            serviceRequests: requestCount || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "planning":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "on_hold":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in_progress":
        return <TrendingUp className="w-3.5 h-3.5" />;
      case "completed":
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "planning":
        return <Clock className="w-3.5 h-3.5" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 animate-pulse h-40"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Premium Welcome Header with Navy/Gold Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
              Client Portal
            </h1>
            <p className="text-gray-300 max-w-xl text-lg font-light">
              Welcome back. Track your active projects, review documents, and connect with our team.
            </p>
          </div>
          <div className="hidden md:block">
            <Link
              href="/quote"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-orange-500 rounded-xl font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all text-white"
            >
              <Calendar className="w-5 h-5 mr-2" />
              New Request
            </Link>
          </div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/portal/projects"
          className="relative group bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <FolderKanban className="w-6 h-6 text-blue-600" />
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Active Projects</p>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold text-navy-900 group-hover:text-blue-600 transition-colors">
                {stats.activeProjects}
              </p>
              <span className="text-base text-gray-400 font-normal">
                / {stats.totalProjects}
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/portal/requests"
          className="relative group bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <Layers className="w-6 h-6 text-amber-600" />
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Service Requests</p>
            <p className="text-3xl font-bold text-navy-900 group-hover:text-amber-600 transition-colors">
              {stats.serviceRequests}
            </p>
          </div>
        </Link>

        <Link
          href="/portal/messages"
          className="relative group bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Unread Messages</p>
            <p className="text-3xl font-bold text-navy-900 group-hover:text-emerald-600 transition-colors">
              {stats.unreadMessages}
            </p>
          </div>
        </Link>

        {/* Support Card - Styled with Soft Gray */}
        <div className="relative group overflow-hidden rounded-2xl p-6 bg-gray-100 text-navy-900 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Briefcase className="w-6 h-6 text-navy-900" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-sm text-gray-500 mb-1">Need Assistance?</p>
            <p className="text-xl font-bold mb-1">Support Line</p>
            <p className="text-primary font-mono text-lg font-semibold">+231 88 191 5322</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-navy-900">Recent Projects</h2>
              <p className="text-gray-500 text-sm mt-1">Status updates and activity</p>
            </div>
            <Link
              href="/portal/projects"
              className="text-sm font-medium text-primary hover:text-orange-600 transition-colors"
            >
              View Dashboard
            </Link>
          </div>

          {recentProjects.length > 0 ? (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/portal/projects/${project.id}`}
                  className="group flex items-center justify-between p-4 rounded-2xl hover:bg-navy-50 border border-transparent hover:border-navy-100 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FolderKanban className="w-5 h-5 text-navy-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy-900 group-hover:text-primary transition-colors">
                        {project.project_name}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mt-0.5">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        Updated {new Date(project.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {getStatusIcon(project.status)}
                    {project.status.replace("_", " ")}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary sm:hidden" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-gray-50/50 border border-dashed border-gray-200">
              <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-900 font-medium">No projects yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Contact us to start your first project
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions / Mobile Only mainly */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-navy-900 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <Link
                href="/quote"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-orange-500 rounded-2xl text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">Request Quote</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link
                href="/portal/messages"
                className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-navy-900">Send Message</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
              </Link>

              <Link
                href="/portal/documents"
                className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-navy-900">View Documents</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <VerificationModal
        isOpen={showVerifiedModal}
        onClose={() => setShowVerifiedModal(false)}
        title="Email Verified Successfully"
        message="Your email has been confirmed. You now have full access to your client portal."
        actionLabel="Continue to Dashboard"
        onAction={() => setShowVerifiedModal(false)}
      />
    </div >
  );
}
