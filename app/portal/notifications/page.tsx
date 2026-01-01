"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import {
    Bell,
    CheckCircle2,
    MessageSquare,
    FileText,
    FolderKanban,
    Inbox,
    AlertCircle,
    Loader2,
    Check,
    Trash2,
    Filter,
} from "lucide-react";
import { toast } from "sonner";

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    link: string;
    is_read: boolean;
    created_at: string;
}

const typeIcons: Record<string, React.ElementType> = {
    message: MessageSquare,
    request: Inbox,
    request_approved: CheckCircle2,
    request_rejected: AlertCircle,
    request_info: AlertCircle,
    project: FolderKanban,
    project_update: FolderKanban,
    system: Bell,
};

const typeColors: Record<string, string> = {
    message: "bg-blue-100 text-blue-600",
    request: "bg-orange-100 text-orange-600",
    request_approved: "bg-green-100 text-green-600",
    request_rejected: "bg-red-100 text-red-600",
    request_info: "bg-yellow-100 text-yellow-600",
    project: "bg-indigo-100 text-indigo-600",
    project_update: "bg-indigo-100 text-indigo-600",
    system: "bg-gray-100 text-gray-600",
};

export default function ClientNotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchNotifications();
    }, []);

    async function fetchNotifications() {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("notifications")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setNotifications(data || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    }

    async function markAsRead(id: string) {
        try {
            const { error } = await supabase
                .from("notifications")
                .update({ is_read: true })
                .eq("id", id);

            if (error) throw error;

            setNotifications(
                notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            );
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    }

    async function markAllAsRead() {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from("notifications")
                .update({ is_read: true })
                .eq("user_id", user.id)
                .eq("is_read", false);

            if (error) throw error;

            setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
            toast.success("All notifications marked as read");
        } catch (error) {
            toast.error("Failed to mark all as read");
        }
    }

    async function deleteNotification(id: string) {
        try {
            const { error } = await supabase
                .from("notifications")
                .delete()
                .eq("id", id);

            if (error) throw error;

            setNotifications(notifications.filter((n) => n.id !== id));
            toast.success("Notification deleted");
        } catch (error) {
            toast.error("Failed to delete notification");
        }
    }

    const filteredNotifications =
        filter === "all"
            ? notifications
            : filter === "unread"
                ? notifications.filter((n) => !n.is_read)
                : notifications.filter((n) => n.type.startsWith(filter));

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    const formatTimeAgo = (date: string) => {
        const now = new Date();
        const then = new Date(date);
        const diffMs = now.getTime() - then.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return then.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Notifications</h1>
                    <p className="text-gray-500">
                        {unreadCount > 0
                            ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                            : "You're all caught up!"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-xl transition-colors"
                    >
                        <Check className="w-4 h-4" />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 overflow-x-auto">
                    <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {[
                        { value: "all", label: "All" },
                        { value: "unread", label: "Unread" },
                        { value: "message", label: "Messages" },
                        { value: "request", label: "Requests" },
                        { value: "project", label: "Projects" },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setFilter(opt.value)}
                            className={`px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${filter === opt.value
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications List */}
            {filteredNotifications.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                    {filteredNotifications.map((notification) => {
                        const Icon = typeIcons[notification.type] || Bell;
                        const colorClass = typeColors[notification.type] || typeColors.system;

                        return (
                            <div
                                key={notification.id}
                                className={`p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors ${!notification.is_read ? "bg-primary/5" : ""
                                    }`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}
                                >
                                    <Icon className="w-5 h-5" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p
                                                className={`font-medium ${!notification.is_read ? "text-navy-900" : "text-gray-700"
                                                    }`}
                                            >
                                                {notification.title}
                                            </p>
                                            {notification.message && (
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    {notification.message}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {formatTimeAgo(notification.created_at)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 mt-2">
                                        {notification.link && (
                                            <Link
                                                href={notification.link}
                                                onClick={() => !notification.is_read && markAsRead(notification.id)}
                                                className="text-sm text-primary hover:text-orange-600 font-medium"
                                            >
                                                View Details
                                            </Link>
                                        )}
                                        {!notification.is_read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="text-sm text-gray-500 hover:text-gray-700"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="text-sm text-gray-400 hover:text-red-500 ml-auto"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {!notification.is_read && (
                                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-navy-900 mb-2">
                        No notifications
                    </h3>
                    <p className="text-gray-500">
                        {filter !== "all"
                            ? "No notifications match your filter"
                            : "You'll see updates about your projects and requests here"}
                    </p>
                </div>
            )}
        </div>
    );
}
