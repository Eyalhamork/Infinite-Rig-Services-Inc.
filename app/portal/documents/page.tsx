"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  FileText,
  Download,
  Search,
  File,
  FileImage,
  FileSpreadsheet,
  Calendar,
  Building2,
  Eye,
  Lock,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SharedDocument {
  id: string;
  title: string;
  description: string;
  storage_path: string;
  file_type: string;
  file_size: number;
  category: string;
  created_at: string;
  share_note?: string;
  share_date?: string;
  source: "direct" | "project";
  project_name?: string;
}

export default function CompanyFilesPage() {
  const [documents, setDocuments] = useState<SharedDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<SharedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Get client record
        const { data: client } = await supabase
          .from("clients")
          .select("id")
          .eq("primary_contact_id", user.id)
          .single();

        if (!client) return;

        // Fetch documents shared directly with client (via client_document_shares)
        const { data: directShares, error: directError } = await supabase
          .from("client_document_shares")
          .select(`
            id,
            note,
            granted_at,
            internal_doc:internal_documents(
              id, title, description, storage_path, file_type, file_size, category, created_at
            )
          `)
          .eq("client_id", client.id);

        if (directError) {
          console.error("Error fetching direct shares:", directError);
        }

        // Fetch documents shared via project_vault_access
        const { data: projectShares, error: projectError } = await supabase
          .from("project_vault_access")
          .select(`
            id,
            granted_at,
            project:projects(id, project_name),
            internal_doc:internal_documents(
              id, title, description, storage_path, file_type, file_size, category, created_at
            )
          `)
          .in("project_id", (
            await supabase
              .from("projects")
              .select("id")
              .eq("client_id", client.id)
          ).data?.map(p => p.id) || []);

        if (projectError) {
          console.error("Error fetching project shares:", projectError);
        }

        // Format and combine documents
        const formattedDocs: SharedDocument[] = [];

        // Process direct shares
        (directShares || []).forEach((share: any) => {
          if (share.internal_doc) {
            formattedDocs.push({
              id: share.internal_doc.id,
              title: share.internal_doc.title,
              description: share.internal_doc.description,
              storage_path: share.internal_doc.storage_path,
              file_type: share.internal_doc.file_type,
              file_size: share.internal_doc.file_size,
              category: share.internal_doc.category,
              created_at: share.internal_doc.created_at,
              share_note: share.note,
              share_date: share.granted_at,
              source: "direct",
            });
          }
        });

        // Process project shares
        (projectShares || []).forEach((share: any) => {
          if (share.internal_doc) {
            // Avoid duplicates
            if (!formattedDocs.find(d => d.id === share.internal_doc.id)) {
              formattedDocs.push({
                id: share.internal_doc.id,
                title: share.internal_doc.title,
                description: share.internal_doc.description,
                storage_path: share.internal_doc.storage_path,
                file_type: share.internal_doc.file_type,
                file_size: share.internal_doc.file_size,
                category: share.internal_doc.category,
                created_at: share.internal_doc.created_at,
                share_date: share.granted_at,
                source: "project",
                project_name: share.project?.project_name,
              });
            }
          }
        });

        // Sort by share date (most recent first)
        formattedDocs.sort((a, b) =>
          new Date(b.share_date || b.created_at).getTime() -
          new Date(a.share_date || a.created_at).getTime()
        );

        setDocuments(formattedDocs);
        setFilteredDocuments(formattedDocs);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  useEffect(() => {
    let filtered = [...documents];

    if (searchQuery) {
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDocuments(filtered);
  }, [searchQuery, documents]);

  const handleDownload = async (doc: SharedDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from("vault")
        .createSignedUrl(doc.storage_path, 60);

      if (error) throw error;
      window.open(data.signedUrl, "_blank");
    } catch (error: any) {
      console.error("Error downloading document:", error);
      toast.error("Download failed", { description: error.message });
    }
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType?.toLowerCase() || "";
    if (type.includes("pdf")) return <FileText className="w-6 h-6 text-red-500" />;
    if (type.includes("image") || type.includes("png") || type.includes("jpg"))
      return <FileImage className="w-6 h-6 text-blue-500" />;
    if (type.includes("sheet") || type.includes("excel") || type.includes("csv"))
      return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "N/A";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Company Files</h1>
        <p className="text-gray-500">
          Documents shared with you by Infinite Rig Services
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Documents List */}
      {filteredDocuments.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      {getFileIcon(doc.file_type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900 mb-1">
                        {doc.title}
                      </h3>
                      {doc.share_note && (
                        <p className="text-primary text-sm mb-2 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {doc.share_note}
                        </p>
                      )}
                      {doc.description && (
                        <p className="text-gray-500 text-sm mb-2 line-clamp-1">
                          {doc.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {doc.category}
                        </span>
                        {doc.source === "project" && doc.project_name && (
                          <span className="text-blue-600 flex items-center gap-1 text-xs">
                            <Building2 className="w-3 h-3" />
                            {doc.project_name}
                          </span>
                        )}
                        <span className="text-gray-400">
                          {formatFileSize(doc.file_size)}
                        </span>
                        <span className="text-gray-400 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(doc.share_date || doc.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:flex-shrink-0">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden md:inline">View</span>
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden md:inline">Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-navy-900 mb-2">
            No company documents yet
          </h3>
          <p className="text-gray-500">
            {searchQuery
              ? "Try adjusting your search"
              : "Documents shared by Infinite Rig Services will appear here"}
          </p>
        </div>
      )}
    </div>
  );
}
