"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  Briefcase,
  Newspaper,
  FolderArchive,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Mail,
  ClipboardList,
  UserCircle,
  BadgeCheck,
  Inbox,
  FolderKanban,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  NotificationDropdown,
  type Notification
} from "@/components/ui/notification-dropdown";
import { cn } from "@/lib/utils";

type UserRole = "super_admin" | "management" | "editor" | "support" | "client";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
  badge?: number;
}

const defaultNavItems: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["super_admin", "management", "editor", "support"],
  },
  {
    label: "Service Inbox",
    href: "/dashboard/requests",
    icon: Inbox,
    roles: ["super_admin", "management"],
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
    roles: ["super_admin", "management"],
  },
  {
    label: "Applications",
    href: "/dashboard/applications",
    icon: FileText,
    roles: ["super_admin", "management", "editor"],
  },
  {
    label: "Contact Submissions",
    href: "/dashboard/contacts",
    icon: Mail,
    roles: ["super_admin", "management"],
  },
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
    roles: ["super_admin", "management", "editor", "support"],
  },
  {
    label: "Job Postings",
    href: "/dashboard/jobs",
    icon: Briefcase,
    roles: ["super_admin", "management", "editor"],
  },
  {
    label: "News & Updates",
    href: "/dashboard/news",
    icon: Newspaper,
    roles: ["super_admin", "management", "editor"],
  },
  {
    label: "Documents",
    href: "/dashboard/documents",
    icon: FolderArchive,
    roles: ["super_admin", "management"],
  },
  {
    label: "User Accounts",
    href: "/dashboard/employees",
    icon: Users,
    roles: ["super_admin", "management"],
  },
  {
    label: "Staff Roster",
    href: "/dashboard/roster",
    icon: BadgeCheck,
    roles: ["super_admin", "management"],
  },
  {
    label: "Clients",
    href: "/dashboard/clients",
    icon: Building2,
    roles: ["super_admin", "management"],
  },
  {
    label: "User Management",
    href: "/dashboard/users",
    icon: UserCircle,
    roles: ["super_admin"],
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["super_admin", "management", "editor", "support"],
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("editor");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [notificationsCount, setNotificationsCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);

  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const fetchBadges = async (userId?: string) => {
    // Need userId to fetch notifications.
    // If not passed, try getting from auth (though this function is called in useEffect where we have user)
    // We'll rely on the caller passing it or using the state if available, 
    // but best to just pass it from useEffect.

    // Actually, in the current flow, we can just use the supabase auth.getUser within, 
    // or better yet, make this accept userId.
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      userId = user.id;
    }

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("type")
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) throw error;

      // Group counts by type
      const counts = (data || []).reduce((acc: Record<string, number>, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
        return acc;
      }, {});

      setNavItems((prevItems) =>
        prevItems.map((item) => {
          if (item.label === "Applications") {
            return { ...item, badge: counts["application"] || 0 };
          }
          if (item.label === "Messages") {
            // Assuming type 'message' covers project_messages
            return { ...item, badge: counts["message"] || 0 };
          }
          if (item.label === "Service Inbox") {
            return { ...item, badge: counts["service_request"] || 0 };
          }
          return item;
        })
      );
    } catch (error) {
      console.error("Error fetching badges:", error);
    }
  };

  const fetchNotifications = async (userId: string) => {
    // Get unread count
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    setNotificationsCount(count || 0);

    // Get recent notifications
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (data) {
      setNotifications(data as Notification[]);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUserRole(profile.role as UserRole);
        setUserName(profile.full_name || "User");
        setUserEmail(profile.email);
      }

      await fetchNotifications(user.id);
      await fetchNotifications(user.id);
      await fetchBadges(user.id);
    };

    fetchUser();

    // Set up real-time subscription for badges
    const channel = supabase
      .channel("dashboard-badges")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        async (payload) => {
          // We need to re-fetch badges for the specific user. 
          // Ideally we check payload.new.user_id but for simplicity we just refetch.
          const { data: { user } } = await supabase.auth.getUser();
          if (user) fetchBadges(user.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  const handleMarkAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (!error) {
      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setNotificationsCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-navy-900 text-white transition-all duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center h-16 px-4 border-b border-white/10 relative",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <Link href="/dashboard" className={cn("flex items-center space-x-2", isCollapsed ? "hidden" : "flex")}>
            <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center font-bold shrink-0">
              IRS
            </div>
            {!isCollapsed && <span className="font-semibold whitespace-nowrap">Dashboard</span>}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors hidden lg:flex absolute right-4",
              isCollapsed ? "right-1/2 translate-x-1/2 top-4 bg-[#FF6B35] hover:bg-[#FF6B35]/90" : ""
            )}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4 text-white" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <TooltipProvider delayDuration={0}>
          <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-8rem)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/30">
            {filteredNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              const LinkContent = (
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center rounded-lg transition-colors relative group",
                    isCollapsed ? "justify-center px-2 py-3" : "justify-between px-3 py-2.5",
                    isActive
                      ? "bg-[#FF6B35] text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <div className={cn("flex items-center", !isCollapsed && "space-x-3")}>
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                  </div>
                  {!isCollapsed && (item.badge || 0) > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && (item.badge || 0) > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1A1A2E]" />
                  )}
                </Link>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      {LinkContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-black text-white border-white/20 font-medium">
                      {item.label}
                      {(item.badge || 0) > 0 && <span className="ml-2 text-[10px] bg-red-500 px-1.5 rounded-full">{item.badge}</span>}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={item.href}>{LinkContent}</div>;
            })}
          </nav>
        </TooltipProvider>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-navy-900">
          {/* Back to Main Site */}
          {!isCollapsed ? (
            <Link
              href="/"
              className="flex items-center space-x-2 px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm mb-2"
            >
              <Home className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Back to Main Site</span>
            </Link>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/"
                    className="flex items-center justify-center px-2 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors mb-2"
                  >
                    <Home className="h-4 w-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-black text-white border-white/20">Back to Main Site</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">
              {filteredNavItems.find(
                (item) =>
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href))
              )?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationDropdown
              notifications={notifications}
              unreadCount={notificationsCount}
              onMarkAsRead={handleMarkAsRead}
            />

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <UserAvatar
                  user={{ full_name: userName, email: userEmail, role: userRole }}
                  className="w-8 h-8"
                />
                <ChevronDown className="h-4 w-4" />
              </button>

              {profileDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {userName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {userEmail}
                      </p>
                    </div>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setProfileDropdown(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
