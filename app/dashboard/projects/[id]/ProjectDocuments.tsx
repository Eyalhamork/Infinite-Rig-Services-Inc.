
"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
    FileText,
    Upload,
    Download,
    Trash2,
    Eye,
    File,
    FileImage,
    FileSpreadsheet,
    Loader2,
    X,
    Lock,
    Globe
} from "lucide-react";
import { toast } from "sonner";

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ProjectDocument {
    id: string;
    title: string;
    description: string;
    storage_path: string;
    file_type: string;
    file_size: number;
    is_client_visible: boolean;
    uploaded_by: string;
    created_at: string;
    profiles?: { full_name: string };
}

interface ProjectDocumentsProps {
    projectId: string;
}

export default function ProjectDocuments({ projectId }: ProjectDocumentsProps) {
    const [documents, setDocuments] = useState<ProjectDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Upload Form State
    const [uploadForm, setUploadForm] = useState({
        title: "",
        description: "",
        is_client_visible: true,
        file: null as File | null,
    });

    useEffect(() => {
        fetchDocuments();
    }, [projectId]);

    const fetchDocuments = async () => {
        try {
            const { data, error } = await supabase
                .from("project_documents")
                .select(`
          *,
          profiles:uploaded_by(full_name)
        `)
                .eq("project_id", projectId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setDocuments(data || []);
        } catch (error) {
            console.error("Error fetching documents:", error);
            toast.error("Failed to load documents");
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

            // 1. Upload to Storage
            const fileExt = uploadForm.file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${projectId}/documents/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("projects")
                .upload(filePath, uploadForm.file);

            if (uploadError) throw uploadError;

            // 2. Create DB Record
            const { error: dbError } = await supabase
                .from("project_documents")
                .insert({
                    project_id: projectId,
                    title: uploadForm.title,
                    description: uploadForm.description,
                    storage_path: filePath,
                    file_type: uploadForm.file.type || "application/octet-stream",
                    file_size: uploadForm.file.size,
                    is_client_visible: uploadForm.is_client_visible,
                    uploaded_by: user.id
                });

            if (dbError) throw dbError;

            // 3. Log Activity
            await supabase.from("project_updates").insert({
                project_id: projectId,
                update_type: "document_added",
                title: "Document Added",
                description: `New document uploaded: ${uploadForm.title}`,
                created_by: user.id,
                is_client_visible: uploadForm.is_client_visible
            });

            // 4. Notify Client (if visible)
            if (uploadForm.is_client_visible) {
                // Get client ID from project
                const { data: project } = await supabase
                    .from("projects")
                    .select("client:clients(primary_contact_id)")
                    .eq("id", projectId)
                    .single();

                const client = project?.client as any; // Cast to bypass strict array check if it occurs
                const contactId = Array.isArray(client) ? client[0]?.primary_contact_id : client?.primary_contact_id;

                if (contactId) {
                    await supabase.from("notifications").insert({
                        user_id: contactId,
                        type: "document",
                        title: "New Project Document",
                        message: `A new document "${uploadForm.title}" has been added to your project.`,
                        link: `/portal/projects/${projectId}?tab=documents`
                    });
                }
            }

            toast.success("Document uploaded successfully");
            setShowUploadModal(false);
            setUploadForm({
                title: "",
                description: "",
                is_client_visible: true,
                file: null,
            });
            fetchDocuments();
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error("Upload failed", { description: error.message });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (doc: ProjectDocument) => {
        if (!confirm("Are you sure you want to delete this document?")) return;

        try {
            // 1. Delete from Storage
            const { error: storageError } = await supabase.storage
                .from("projects")
                .remove([doc.storage_path]);

            if (storageError) console.warn("Storage deletion warning:", storageError);

            // 2. Delete from DB
            const { error: dbError } = await supabase
                .from("project_documents")
                .delete()
                .eq("id", doc.id);

            if (dbError) throw dbError;

            toast.success("Document deleted");
            setDocuments(documents.filter(d => d.id !== doc.id));
        } catch (error: any) {
            toast.error("Delete failed", { description: error.message });
        }
    };

    const handleDownload = async (doc: ProjectDocument) => {
        try {
            const { data, error } = await supabase.storage
                .from("projects")
                .createSignedUrl(doc.storage_path, 3600);

            if (error) throw error;
            window.open(data.signedUrl, "_blank");
        } catch (error) {
            toast.error("Download failed");
        }
    };

    const getFileIcon = (fileType: string) => {
        const type = fileType?.toLowerCase() || "";
        if (type.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />;
        if (type.includes("image")) return <FileImage className="w-5 h-5 text-blue-500" />;
        if (type.includes("sheet") || type.includes("excel")) return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
        return <File className="w-5 h-5 text-gray-500" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gray-400" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Project Documents</h3>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                >
                    <Upload className="w-4 h-4" />
                    Upload Document
                </button>
            </div>

            {documents.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No documents uploaded yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    {getFileIcon(doc.file_type)}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">{doc.title}</h4>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                                        <span>{formatFileSize(doc.file_size)}</span>
                                        <span>•</span>
                                        <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span className={`flex items-center gap-1 ${doc.is_client_visible ? "text-green-600" : "text-amber-600"}`}>
                                            {doc.is_client_visible ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                            {doc.is_client_visible ? "Visible to Client" : "Internal Only"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDownload(doc)}
                                    className="p-2 text-gray-400 hover:text-primary hover:bg-orange-50 rounded-lg transition-colors"
                                    title="Download"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(doc)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Upload Document</h3>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={uploadForm.title}
                                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                    placeholder="e.g., Final Survey Report"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                <textarea
                                    value={uploadForm.description}
                                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                                <input
                                    type="file"
                                    required
                                    onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                            </div>

                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    checked={uploadForm.is_client_visible}
                                    onChange={(e) => setUploadForm({ ...uploadForm, is_client_visible: e.target.checked })}
                                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                                />
                                <div className="text-sm">
                                    <span className="font-medium text-gray-900 block">Visible to Client</span>
                                    <span className="text-gray-500">Client will be notified of this upload</span>
                                </div>
                            </label>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                    {uploading ? "Uploading..." : "Upload"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
