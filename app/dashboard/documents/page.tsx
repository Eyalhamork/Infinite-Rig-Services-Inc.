"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Upload,
  FolderArchive,
  FileText,
  File,
  Image,
  Download,
  Share2,
  Trash2,
  MoreHorizontal,
  Eye,
  Lock,
  Calendar,
  User,
  X,
  Link as LinkIcon,
  Facebook,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface InternalDocument {
  id: string;
  title: string;
  description: string;
  storage_path: string;
  file_type: string;
  file_size: number;
  category: string;
  is_confidential: boolean;
  created_by: string;
  created_at: string;
  profiles?: { full_name: string };
}

interface Client {
  id: string;
  company_name: string;
  primary_contact_id: string;
}

const categories = [
  "License",
  "Certificate",
  "Policy",
  "Contract",
  "Insurance",
  "Report",
  "Manual",
  "Other",
];

const fileIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  xls: File,
  xlsx: File,
  jpg: Image,
  jpeg: Image,
  png: Image,
  default: File,
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<InternalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showUpload, setShowUpload] = useState(false);
  const [showShareClient, setShowShareClient] = useState<InternalDocument | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [shareNote, setShareNote] = useState("");
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    category: "Other",
    is_confidential: true,
    file: null as File | null,
  });
  const supabase = createClient();

  useEffect(() => {
    fetchDocuments();
    fetchClients();
  }, [categoryFilter]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("id, company_name, primary_contact_id")
        .order("company_name");
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("internal_documents")
        .select(`*, profiles:created_by (full_name)`)
        .order("created_at", { ascending: false });

      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload file to VAULT storage
      const fileExt = uploadForm.file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const storagePath = `${uploadForm.category.toLowerCase()}/${fileName}`; // Organized by category

      const { error: uploadError } = await supabase.storage
        .from("vault")
        .upload(storagePath, uploadForm.file);

      if (uploadError) throw uploadError;

      // Create internal document record
      const { error: insertError } = await supabase
        .from("internal_documents")
        .insert({
          title: uploadForm.title,
          description: uploadForm.description,
          storage_path: storagePath,
          file_type: uploadForm.file.type,
          file_size: uploadForm.file.size,
          category: uploadForm.category,
          is_confidential: uploadForm.is_confidential,
          created_by: user.id,
        });

      if (insertError) throw insertError;

      setShowUpload(false);
      setUploadForm({
        title: "",
        description: "",
        category: "Other",
        is_confidential: true,
        file: null,
      });
      fetchDocuments();
      toast.success("Document uploaded to Vault");
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast.error("Upload failed", { description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (doc: InternalDocument) => {
    if (!confirm("Are you sure you want to delete this document from the Vault?")) return;

    try {
      // 1. Delete from DB
      const { error } = await supabase
        .from("internal_documents")
        .delete()
        .eq("id", doc.id);

      if (error) throw error;

      // 2. Delete from Storage (Optional cleanup)
      await supabase.storage.from("vault").remove([doc.storage_path]);

      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      setActionMenuId(null);
      toast.success("Document deleted");
    } catch (error: any) {
      console.error("Error deleting document:", error);
      toast.error("Delete failed", { description: error.message });
    }
  };

  const handleDownload = async (doc: InternalDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from("vault")
        .createSignedUrl(doc.storage_path, 60); // Valid for 60 seconds

      if (error) throw error;
      window.open(data.signedUrl, "_blank");
    } catch (error: any) {
      console.error("Error downloading document:", error);
      toast.error("Download failed", { description: error.message });
    }
  };

  const handleShareWithClient = async () => {
    if (!showShareClient || !selectedClientId) {
      toast.error("Please select a client");
      return;
    }

    setSharing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if already shared
      const { data: existing } = await supabase
        .from("client_document_shares")
        .select("id")
        .eq("client_id", selectedClientId)
        .eq("internal_doc_id", showShareClient.id)
        .single();

      if (existing) {
        toast.error("Document already shared with this client");
        return;
      }

      // Create share
      const { error } = await supabase
        .from("client_document_shares")
        .insert({
          client_id: selectedClientId,
          internal_doc_id: showShareClient.id,
          note: shareNote || null,
          granted_by: user.id,
        });

      if (error) throw error;

      const clientName = clients.find(c => c.id === selectedClientId)?.company_name;
      toast.success(`Document shared with ${clientName}`);
      setShowShareClient(null);
      setSelectedClientId("");
      setShareNote("");
    } catch (error: any) {
      console.error("Error sharing document:", error);
      toast.error("Failed to share document", { description: error.message });
    } finally {
      setSharing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (fileType: string) => {
    const ext = fileType?.split("/").pop()?.toLowerCase() || "";
    return fileIcons[ext] || fileIcons.default;
  };

  const filteredDocuments = documents.filter((doc) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(query) ||
      doc.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Hub</h1>
          <p className="text-gray-600">Company documents and legal files</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors"
        >
          <Upload className="h-5 w-5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))
        ) : filteredDocuments.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-8 text-center">
            <FolderArchive className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No documents found</p>
          </div>
        ) : (
          filteredDocuments.map((doc) => {
            const FileIcon = getFileIcon(doc.file_type);
            return (
              <div
                key={doc.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex items-center space-x-1">
                    {doc.is_confidential && (
                      <span className="p-1.5 bg-red-100 text-red-600 rounded" title="Confidential">
                        <Lock className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <div className="relative">
                      <button
                        onClick={() => setActionMenuId(actionMenuId === doc.id ? null : doc.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {actionMenuId === doc.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setActionMenuId(null)}
                          />
                          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                            <button
                              onClick={() => handleDownload(doc)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleDownload(doc)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Download className="h-4 w-4" />
                              <span>Download</span>
                            </button>
                            <button
                              onClick={() => {
                                setShowShareClient(doc);
                                setActionMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 text-blue-600"
                            >
                              <Share2 className="h-4 w-4" />
                              <span>Share with Client</span>
                            </button>
                            <hr className="my-1" />
                            <button
                              onClick={() => deleteDocument(doc)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 flex items-center space-x-2 text-red-600"
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

                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {doc.title}
                </h3>
                {doc.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {doc.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {doc.category}
                  </span>
                  <span>{formatFileSize(doc.file_size)}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{doc.profiles?.full_name || "Unknown"}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(doc.created_at).toLocaleDateString()}
                    </span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowUpload(false)} />
          <div className="relative bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
              <button
                onClick={() => setShowUpload(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File *
                </label>
                <input
                  type="file"
                  required
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
                />
              </div>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uploadForm.is_confidential}
                  onChange={(e) => setUploadForm({ ...uploadForm, is_confidential: e.target.checked })}
                  className="w-4 h-4 text-[#FF6B35] rounded focus:ring-[#FF6B35]"
                />
                <span className="text-sm text-gray-700">Mark as confidential (admin only)</span>
              </label>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2.5 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share with Client Modal */}
      {showShareClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowShareClient(null)} />
          <div className="relative bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Share with Client</h2>
              <button
                onClick={() => setShowShareClient(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Document</p>
              <p className="font-semibold text-gray-900">{showShareClient.title}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Client *
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none bg-white"
                >
                  <option value="">Choose a client...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.company_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note (optional)
                </label>
                <textarea
                  value={shareNote}
                  onChange={(e) => setShareNote(e.target.value)}
                  placeholder="e.g., Your requested insurance certificate"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-4 mt-4 border-t">
              <button
                type="button"
                onClick={() => setShowShareClient(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleShareWithClient}
                disabled={sharing || !selectedClientId}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sharing ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Sharing...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    Share Document
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
