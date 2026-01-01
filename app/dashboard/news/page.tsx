"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Newspaper,
  Calendar,
  Eye,
  EyeOff,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  User,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  author_id: string;
  category: string;
  tags: string[];
  status: "draft" | "pending" | "published" | "archived";
  is_published: boolean;
  published_at: string;
  views: number;
  created_at: string;
  profiles?: { full_name: string };
}

const statusConfig = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700", icon: Edit },
  pending: { label: "Pending Review", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  published: { label: "Published", color: "bg-green-100 text-green-700", icon: CheckCircle },
  archived: { label: "Archived", color: "bg-red-100 text-red-700", icon: XCircle },
};

const categories = [
  "Company News",
  "Industry Updates",
  "Press Release",
  "Events",
  "Projects",
  "Awards",
];

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchPosts();
  }, [statusFilter, categoryFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("news_posts")
        .select(`*, profiles:author_id (full_name)`)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: NewsPost["status"]) => {
    try {
      const updates: any = { status: newStatus };
      
      if (newStatus === "published") {
        updates.is_published = true;
        updates.published_at = new Date().toISOString();
      } else {
        updates.is_published = false;
      }

      const { error } = await supabase
        .from("news_posts")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                status: newStatus,
                is_published: newStatus === "published",
                published_at:
                  newStatus === "published"
                    ? new Date().toISOString()
                    : p.published_at,
              }
            : p
        )
      );
      setActionMenuId(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase.from("news_posts").delete().eq("id", id);
      if (error) throw error;
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt?.toLowerCase().includes(query) ||
      post.category?.toLowerCase().includes(query)
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
          <h1 className="text-2xl font-bold text-gray-900">News & Updates</h1>
          <p className="text-gray-600">Manage company news and announcements</p>
        </div>
        <Link
          href="/dashboard/news/new"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Create Post</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
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
            <option value="pending">Pending</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35] mx-auto" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-8 text-center">
            <Newspaper className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No posts found</p>
            <Link
              href="/dashboard/news/new"
              className="inline-flex items-center space-x-2 mt-4 text-[#FF6B35] hover:underline"
            >
              <Plus className="h-4 w-4" />
              <span>Create your first post</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPosts.map((post) => {
              const status = statusConfig[post.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={post.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {post.featured_image_url ? (
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Newspaper className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {post.title}
                        </h3>
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          <span>{status.label}</span>
                        </span>
                      </div>

                      {post.excerpt && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{post.profiles?.full_name || "Unknown"}</span>
                        </span>
                        {post.category && (
                          <span className="px-2 py-0.5 bg-gray-100 rounded">
                            {post.category}
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(post.created_at)}</span>
                        </span>
                        {post.is_published && (
                          <span className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{post.views} views</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActionMenuId(
                            actionMenuId === post.id ? null : post.id
                          )
                        }
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>

                      {actionMenuId === post.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setActionMenuId(null)}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                            <Link
                              href={`/dashboard/news/${post.id}`}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Edit className="h-4 w-4" />
                              <span>Edit</span>
                            </Link>
                            {post.is_published && (
                              <Link
                                href={`/news/${post.slug}`}
                                target="_blank"
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span>View Live</span>
                              </Link>
                            )}
                            <hr className="my-1" />
                            {post.status === "draft" && (
                              <button
                                onClick={() => updateStatus(post.id, "pending")}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 text-yellow-600"
                              >
                                <Clock className="h-4 w-4" />
                                <span>Submit for Review</span>
                              </button>
                            )}
                            {post.status === "pending" && (
                              <button
                                onClick={() => updateStatus(post.id, "published")}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 text-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Publish</span>
                              </button>
                            )}
                            {post.status === "published" && (
                              <button
                                onClick={() => updateStatus(post.id, "archived")}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 text-orange-600"
                              >
                                <EyeOff className="h-4 w-4" />
                                <span>Unpublish</span>
                              </button>
                            )}
                            <hr className="my-1" />
                            <button
                              onClick={() => setDeleteConfirm(post.id)}
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
              );
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{posts.length}</p>
          <p className="text-sm text-gray-500">Total Posts</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-600">
            {posts.filter((p) => p.status === "published").length}
          </p>
          <p className="text-sm text-gray-500">Published</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">
            {posts.filter((p) => p.status === "pending").length}
          </p>
          <p className="text-sm text-gray-500">Pending Review</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">
            {posts.reduce((sum, p) => sum + (p.views || 0), 0)}
          </p>
          <p className="text-sm text-gray-500">Total Views</p>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Post?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deletePost(deleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
