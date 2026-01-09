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
  User,
  Download,
  Eye,
  File,
  FileImage,
  FileSpreadsheet,
  Activity,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

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
  budget: number;
  notes: string;
  contract_value?: number;
  tracking_code?: string;
}

interface Milestone {
  id: string;
  milestone_name: string;
  description: string;
  due_date: string;
  completion_date: string;
  is_completed: boolean;
  is_custom?: boolean;
  status?: string;
}

interface ProjectDocument {
  id: string;
  title: string;
  description: string;
  storage_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

interface ProjectUpdate {
  id: string;
  update_type: string;
  title: string;
  description: string;
  created_at: string;
  profiles?: { full_name: string };
}

type TabType = "overview" | "contract" | "documents" | "milestones" | "updates";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  useEffect(() => {
    async function fetchProject() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // Get client record
        const { data: client } = await supabase
          .from("clients")
          .select("id")
          .eq("primary_contact_id", user.id)
          .single();

        if (!client) {
          router.push("/portal");
          return;
        }

        // Fetch project (verify it belongs to this client)
        const { data: projectData } = await supabase
          .from("projects")
          .select("*")
          .eq("id", params.id)
          .eq("client_id", client.id)
          .single();

        if (!projectData) {
          router.push("/portal/projects");
          return;
        }

        setProject(projectData);

        // Fetch milestones
        const { data: milestonesData } = await supabase
          .from("project_milestones")
          .select("*")
          .eq("project_id", params.id)
          .order("sort_order", { ascending: true })
          .order("due_date", { ascending: true });

        setMilestones(milestonesData || []);

        // Fetch project documents
        const { data: docsData } = await supabase
          .from("project_documents")
          .select("*")
          .eq("project_id", params.id)
          .eq("is_client_visible", true)
          .order("created_at", { ascending: false });

        setDocuments(docsData || []);

        // Fetch project updates (activity feed)
        const { data: updatesData } = await supabase
          .from("project_updates")
          .select(`*, profiles:created_by(full_name)`)
          .eq("project_id", params.id)
          .eq("is_client_visible", true)
          .order("created_at", { ascending: false })
          .limit(20);

        setUpdates(updatesData || []);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [params.id, router]);

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "planning":
        return "bg-yellow-100 text-yellow-700";
      case "on_hold":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in_progress":
        return <TrendingUp className="w-5 h-5" />;
      case "completed":
        return <CheckCircle2 className="w-5 h-5" />;
      case "planning":
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const calculateProgress = () => {
    if (milestones.length === 0) return 0;
    const completed = milestones.filter((m) => m.is_completed).length;
    return Math.round((completed / milestones.length) * 100);
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType?.toLowerCase() || "";
    if (type.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes("image") || type.includes("png") || type.includes("jpg"))
      return <FileImage className="w-5 h-5 text-blue-500" />;
    if (type.includes("sheet") || type.includes("excel") || type.includes("csv"))
      return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "N/A";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const handleDownload = async (doc: ProjectDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from("projects")
        .createSignedUrl(doc.storage_path, 60);

      if (error) throw error;
      window.open(data.signedUrl, "_blank");
    } catch (error: any) {
      console.error("Error downloading document:", error);
      toast.error("Download failed", { description: error.message });
    }
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "milestone_complete":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "document_added":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "status_change":
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-white rounded-2xl h-64"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Project not found</p>
        <Link href="/portal/projects" className="text-primary hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: Building2 },
    { id: "contract" as TabType, label: "Contract", icon: DollarSign },
    { id: "documents" as TabType, label: "Documents", icon: FileText, count: documents.length },
    { id: "milestones" as TabType, label: "Milestones", icon: CheckCircle2, count: milestones.length },
    { id: "updates" as TabType, label: "Updates", icon: Activity, count: updates.length },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/portal/projects"
        className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Projects
      </Link>

      {/* Project Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-navy-900 to-navy-800 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{project.project_name}</h1>
                {project.project_code && (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {project.project_code}
                  </span>
                )}
              </div>
              <p className="text-gray-300">{project.description}</p>
            </div>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                project.status
              )}`}
            >
              {getStatusIcon(project.status)}
              {project.status.replace("_", " ")}
            </span>
          </div>

          {project.tracking_code && (
            <div className="mt-4 flex items-center gap-2">
              <div className="text-sm text-gray-300">Public Tracking Code:</div>
              <div className="bg-white/10 px-3 py-1 rounded-lg font-mono text-sm tracking-widest flex items-center gap-2">
                {project.tracking_code}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(project.tracking_code!);
                    toast.success("Code copied to clipboard");
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FileText className="w-3 h-3" />
                </button>
                <Link
                  href={`/tracking?id=${project.tracking_code}`}
                  target="_blank"
                  className="text-primary hover:text-white transition-colors ml-2 flex items-center gap-1 text-xs uppercase font-bold"
                >
                  Track <Eye className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Project Progress
            </span>
            <span className="text-sm font-bold text-primary">
              {calculateProgress()}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-gold h-2 rounded-full transition-all duration-500"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100">
          <nav className="flex overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
                    }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {project.location && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Location
                    </p>
                    <p className="font-semibold text-navy-900">{project.location}</p>
                  </div>
                </div>
              )}

              {project.vessel_name && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Ship className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Vessel
                    </p>
                    <p className="font-semibold text-navy-900">
                      {project.vessel_name}
                    </p>
                  </div>
                </div>
              )}

              {project.start_date && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Timeline
                    </p>
                    <p className="font-semibold text-navy-900">
                      {new Date(project.start_date).toLocaleDateString()}
                      {project.end_date &&
                        ` - ${new Date(project.end_date).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
              )}

              {project.service_type && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Service Type
                    </p>
                    <p className="font-semibold text-navy-900 capitalize">
                      {project.service_type}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contracts Tab */}
          {activeTab === "contract" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy-900">Contract Terms</h3>
                    <p className="text-gray-500 text-sm">Summary of agreed service terms and value</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contract Value</label>
                      <p className="text-3xl font-bold text-navy-900 mt-1">
                        {formatCurrency(project.contract_value || project.budget)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Service Period</label>
                      <p className="text-lg font-medium text-navy-800 mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(project.start_date).toLocaleDateString()}
                        <span className="text-gray-400">-</span>
                        {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Ongoing'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Service Scope</label>
                      <p className="text-gray-700 mt-1 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {getStatusIcon(project.status)}
                          {project.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  onClick={() => toast.info('Requesting full contract PDF copy from Admin...')}
                >
                  <FileText className="w-4 h-4" />
                  Request Contract PDF
                </button>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div>
              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                          {getFileIcon(doc.file_type)}
                        </div>
                        <div>
                          <p className="font-medium text-navy-900">{doc.title}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 text-gray-500 hover:text-primary hover:bg-white rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 text-white bg-primary hover:bg-orange-600 rounded-lg transition-colors"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No documents available yet</p>
                </div>
              )}
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === "milestones" && (
            <div>
              {milestones.length > 0 ? (
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${milestone.is_completed
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-400"
                          }`}
                      >
                        {milestone.is_completed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-semibold ${milestone.is_completed
                              ? "text-green-700"
                              : "text-navy-900"
                              }`}
                          >
                            {milestone.milestone_name}
                          </h3>
                          {milestone.is_custom && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
                              Custom
                            </span>
                          )}
                          {milestone.status && milestone.status !== 'pending' && (
                            <span className={`px-2 py-0.5 text-xs rounded-full uppercase tracking-wider font-bold ${milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
                                milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                  milestone.status === 'skipped' ? 'bg-gray-100 text-gray-500 line-through' :
                                    milestone.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                      'bg-gray-100 text-gray-600'
                              }`}>
                              {milestone.status.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                        {milestone.description && (
                          <p className="text-gray-500 text-sm mt-1">
                            {milestone.description}
                          </p>
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No milestones defined yet</p>
                </div>
              )}
            </div>
          )}

          {/* Updates Tab */}
          {activeTab === "updates" && (
            <div>
              {updates.length > 0 ? (
                <div className="space-y-4">
                  {updates.map((update) => (
                    <div
                      key={update.id}
                      className="flex items-start gap-3 p-4 border-l-4 border-gray-200 bg-gray-50 rounded-r-xl"
                    >
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        {getUpdateIcon(update.update_type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-navy-900">{update.title}</p>
                        {update.description && (
                          <p className="text-gray-500 text-sm mt-1">{update.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span>{new Date(update.created_at).toLocaleString()}</span>
                          {update.profiles?.full_name && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {update.profiles.full_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No updates yet</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/portal/messages"
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-navy-900">Send Message</h3>
              <p className="text-sm text-gray-500">
                Contact the project team
              </p>
            </div>
          </Link>

          <Link
            href="/portal/documents"
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-navy-900">Company Files</h3>
              <p className="text-sm text-gray-500">
                View shared company documents
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
