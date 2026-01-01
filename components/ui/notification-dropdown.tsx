"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Check, X } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export interface Notification {
    id: string;
    title: string;
    message: string;
    created_at: string;
    is_read: boolean;
    link?: string;
    type?: string;
}

interface NotificationDropdownProps {
    notifications: Notification[];
    unreadCount: number;
    onMarkAsRead: (id: string) => void;
    isLoading?: boolean;
}

export function NotificationDropdown({
    notifications,
    unreadCount,
    onMarkAsRead,
    isLoading = false,
}: NotificationDropdownProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    className="z-50 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 mt-2 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                    sideOffset={5}
                    align="end"
                >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                    <Bell className="h-6 w-6 text-gray-300" />
                                </div>
                                <p className="text-sm text-gray-500 font-medium">No new notifications</p>
                                <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "p-4 hover:bg-gray-50 transition-colors relative group",
                                            !notification.is_read ? "bg-blue-50/30" : ""
                                        )}
                                    >
                                        {!notification.is_read && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onMarkAsRead(notification.id);
                                                }}
                                                className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                                title="Mark as read"
                                            >
                                                <Check className="h-3 w-3" />
                                            </button>
                                        )}

                                        <Link
                                            href={notification.link || "#"}
                                            className="block"
                                            onClick={() => {
                                                if (!notification.is_read) onMarkAsRead(notification.id);
                                                setOpen(false);
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn("text-sm text-gray-900 truncate", !notification.is_read && "font-semibold")}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-1.5">
                                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                    </p>
                                                </div>
                                                {!notification.is_read && (
                                                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-2 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
                        <Link
                            href="/dashboard/notifications"
                            onClick={() => setOpen(false)}
                            className="block w-full text-center py-2 text-xs font-semibold text-gray-600 hover:text-primary transition-colors"
                        >
                            View all notifications
                        </Link>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
