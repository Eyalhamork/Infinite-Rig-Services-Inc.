"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Mail,
  ClipboardList,
  MessageSquare,
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  ArrowRight,
  Eye,
  MoreHorizontal,
  Activity,
  Calendar,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Stats {
  applications: number;
  contacts: number;
  quotes: number;
  pendingMessages: number;
  activeJobs: number;
  employees: number;
  serviceRequests: number;
}

interface RecentItem {
  id: string;
  type: "application" | "contact" | "quote" | "message" | "request";
  title: string;
  subtitle: string;
  time: string;
  status?: string;
  amount?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    applications: 0,
    contacts: 0,
    quotes: 0,
    pendingMessages: 0,
    activeJobs: 0,
    employees: 0,
    serviceRequests: 0,
  });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const [
          { count: applicationsCount },
          { count: contactsCount },
          { count: quotesCount },
          { count: messagesCount },
          { count: jobsCount },
          { count: employeesCount },
          { count: requestsCount },
        ] = await Promise.all([
          supabase
            .from("applications")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("contact_submissions")
            .select("*", { count: "exact", head: true })
            .eq("status", "new"),
          supabase
            .from("quote_submissions")
            .select("*", { count: "exact", head: true })
            .eq("status", "new"),
          supabase
            .from("project_messages")
            .select("*", { count: "exact", head: true })
            .eq("is_read", false),
          supabase
            .from("job_postings")
            .select("*", { count: "exact", head: true })
            .eq("status", "published"),
          supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .in("role", ["super_admin", "management", "editor", "support"]),
          supabase
            .from("service_requests")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
        ]);

        setStats({
          applications: applicationsCount || 0,
          contacts: contactsCount || 0,
          quotes: quotesCount || 0,
          pendingMessages: messagesCount || 0,
          activeJobs: jobsCount || 0,
          employees: employeesCount || 0,
          serviceRequests: requestsCount || 0,
        });

        // Fetch recent items
        const recent: RecentItem[] = [];

        // Recent applications
        const { data: applications } = await supabase
          .from("applications")
          .select("id, created_at, status, job_id, profiles(full_name)")
          .order("created_at", { ascending: false })
          .limit(3);

        applications?.forEach((app: any) => {
          recent.push({
            id: app.id,
            type: "application",
            title: app.profiles?.full_name || "Unknown Applicant",
            subtitle: "New job application",
            time: formatTimeAgo(app.created_at),
            status: app.status,
          });
        });

        // Recent contacts
        const { data: contacts } = await supabase
          .from("contact_submissions")
          .select("id, created_at, full_name, subject, status")
          .order("created_at", { ascending: false })
          .limit(3);

        contacts?.forEach((contact: any) => {
          recent.push({
            id: contact.id,
            type: "contact",
            title: contact.full_name,
            subtitle: contact.subject,
            time: formatTimeAgo(contact.created_at),
            status: contact.status,
          });
        });

        // Recent quotes
        const { data: quotes } = await supabase
          .from("quote_submissions")
          .select("id, created_at, full_name, service_area, status")
          .order("created_at", { ascending: false })
          .limit(3);

        quotes?.forEach((quote: any) => {
          recent.push({
            id: quote.id,
            type: "quote",
            title: quote.full_name,
            subtitle: `Quote request: ${quote.service_area}`,
            time: formatTimeAgo(quote.created_at),
            status: quote.status,
          });
        });

        // Recent Service Requests
        const { data: requests } = await supabase
          .from("service_requests")
          .select("id, created_at, service_type, status, clients(company_name)")
          .order("created_at", { ascending: false })
          .limit(3);

        requests?.forEach((req: any) => {
          recent.push({
            id: req.id,
            type: "request",
            title: req.clients?.company_name || "Unknown Client",
            subtitle: `Service Request: ${req.service_type}`,
            time: formatTimeAgo(req.created_at),
            status: req.status,
          });
        });

        // Sort by time and take latest
        recent.sort(
          (a, b) =>
            new Date(b.time).getTime() - new Date(a.time).getTime()
        );
        setRecentItems(recent.slice(0, 8));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString();
  };

  const statCards = [
    {
      label: "Service Requests",
      value: stats.serviceRequests,
      icon: Layers, // Changed icon to distinguish
      href: "/dashboard/requests",
      gradient: "from-amber-500 to-amber-600",
      shadow: "shadow-amber-500/20",
      text: "text-amber-600",
      bg: "bg-amber-50",
      trend: "New",
      trendUp: true
    },
    {
      label: "Applications",
      value: stats.applications,
      icon: FileText,
      href: "/dashboard/applications",
      gradient: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/20",
      text: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+12%",
      trendUp: true
    },
    {
      label: "New Contacts",
      value: stats.contacts,
      icon: Mail,
      href: "/dashboard/contacts",
      gradient: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/20",
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "+5%",
      trendUp: true
    },
    {
      label: "Active Jobs",
      value: stats.activeJobs,
      icon: Briefcase,
      href: "/dashboard/jobs",
      gradient: "from-indigo-500 to-indigo-600",
      shadow: "shadow-indigo-500/20",
      text: "text-indigo-600",
      bg: "bg-indigo-50",
      trend: "+8%",
      trendUp: true
    },
    {
      label: "Quote Requests",
      value: stats.quotes,
      icon: ClipboardList,
      href: "/dashboard/quotes",
      gradient: "from-violet-500 to-violet-600",
      shadow: "shadow-violet-500/20",
      text: "text-violet-600",
      bg: "bg-violet-50",
      trend: "+18%",
      trendUp: true
    },
    {
      label: "Messages",
      value: stats.pendingMessages,
      icon: MessageSquare,
      href: "/dashboard/messages",
      gradient: "from-orange-500 to-orange-600",
      shadow: "shadow-orange-500/20",
      text: "text-orange-600",
      bg: "bg-orange-50",
      trend: "-2%",
      trendUp: false
    },

    {
      label: "Team Members",
      value: stats.employees,
      icon: Users,
      href: "/dashboard/employees",
      gradient: "from-rose-500 to-rose-600",
      shadow: "shadow-rose-500/20",
      text: "text-rose-600",
      bg: "bg-rose-50",
      trend: "Steady",
      trendUp: true
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "application":
        return <FileText className="h-5 w-5" />;
      case "contact":
        return <Mail className="h-5 w-5" />;
      case "quote":
        return <ClipboardList className="h-5 w-5" />;
      case "message":
        return <MessageSquare className="h-5 w-5" />;
      case "request":
        return <Layers className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "application":
        return { bg: "bg-blue-100", text: "text-blue-600", icon: "text-blue-600" };
      case "contact":
        return { bg: "bg-emerald-100", text: "text-emerald-600", icon: "text-emerald-600" };
      case "quote":
        return { bg: "bg-violet-100", text: "text-violet-600", icon: "text-violet-600" };
      case "message":
        return { bg: "bg-orange-100", text: "text-orange-600", icon: "text-orange-600" };
      case "request":
        return { bg: "bg-amber-100", text: "text-amber-600", icon: "text-amber-600" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600", icon: "text-gray-600" };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
      case "submitted":
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "read":
      case "reviewing":
      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "responded":
      case "shortlisted":
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="h-40 bg-gray-100 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Premium Welcome Banner - Compacted */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#334155] p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1 tracking-tight">
              Dashboard Overview
            </h2>
            <p className="text-slate-300 text-base max-w-xl font-light">
              Welcome back. Here's a comprehensive look at your platform's performance.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium backdrop-blur-sm border border-white/10">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid-pattern.svg')] opacity-5" />
      </div>

      {/* Stats Grid - 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group relative bg-white overflow-hidden rounded-2xl p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-gray-100 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow} group-hover:scale-105 transition-transform duration-300`}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${stat.trendUp ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'}`}>
                {stat.trend}
              </div>
            </div>

            <div className="mt-2">
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight mb-0.5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all">
                {stat.value}
              </h3>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>

            {/* Hover Arrow */}
            <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <ArrowRight className={`h-4 w-4 ${stat.text}`} />
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Details */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <p className="text-gray-500 text-sm mt-1">Latest platform events</p>
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          {recentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <Clock className="h-6 w-6 text-gray-300" />
              </div>
              <p className="text-gray-900 font-medium">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentItems.map((item) => {
                const style = getTypeStyles(item.type);
                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="group flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.bg} ${style.text} group-hover:scale-105 transition-transform`}
                      >
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500">{item.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.status && (
                        <span
                          className={`hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      )}
                      <span className="text-xs font-medium text-gray-400 tabular-nums">
                        {item.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link
              href="/dashboard/notifications"
              className="flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              View all activity <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 h-fit sticky top-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>

          <div className="space-y-3">
            <Link
              href="/dashboard/jobs/new"
              className="flex items-center justify-between p-3.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-4 w-4" />
                </div>
                <span className="font-semibold text-sm">Post New Job</span>
              </div>
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-3 w-3" />
              </div>
            </Link>

            <Link
              href="/dashboard/documents/upload"
              className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-blue-100 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <FileText className="h-4 w-4" />
                </div>
                <span className="font-medium text-gray-900 text-sm">Upload Document</span>
              </div>
              <ArrowRight className="h-3 w-3 text-gray-300 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/dashboard/news/new"
              className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-blue-100 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <span className="font-medium text-gray-900 text-sm">Create News</span>
              </div>
              <ArrowRight className="h-3 w-3 text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/dashboard/employees/new"
              className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-purple-100 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  <Users className="h-4 w-4" />
                </div>
                <span className="font-medium text-gray-900 text-sm">Add Employee</span>
              </div>
              <ArrowRight className="h-3 w-3 text-gray-300 group-hover:text-purple-500 transform group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <h4 className="font-semibold text-slate-800 mb-2 flex items-center text-sm">
              <ShieldCheck className="w-4 h-4 mr-2 text-slate-500" />
              System Status
            </h4>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Database</span>
              <span className="flex items-center text-green-600 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
