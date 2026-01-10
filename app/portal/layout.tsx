"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Building2,
  User,
  ClipboardList,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  avatar_url?: string;
  role: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const defaultNavigation: NavItem[] = [
  { name: "Overview", href: "/portal", icon: LayoutDashboard },
  { name: "My Requests", href: "/portal/requests", icon: ClipboardList },
  { name: "Projects", href: "/portal/projects", icon: FolderKanban },
  { name: "Messages", href: "/portal/messages", icon: MessageSquare },
  { name: "Company Files", href: "/portal/documents", icon: FileText },
  { name: "Settings", href: "/portal/settings", icon: Settings },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsCount, setNotificationsCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [navigation, setNavigation] = useState<NavItem[]>(defaultNavigation);
  const pathname = usePathname();
  const router = useRouter();

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

  const fetchBadges = async (userId: string) => {
    try {
      // Fetch unread notifications for this user
      const { data, error } = await supabase
        .from("notifications")
        .select("type")
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) throw error;

      // Group by type
      const counts = (data || []).reduce((acc: Record<string, number>, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
        return acc;
      }, {});

      setNavigation(prev => prev.map(item => {
        if (item.name === "Messages") {
          // 'message' notifications
          return { ...item, badge: counts["message"] || 0 };
        }
        if (item.name === "My Requests") {
          // 'service_request' notifications
          return { ...item, badge: counts["service_request"] || 0 };
        }
        return item;
      }));

    } catch (error) {
      console.error("Error fetching badges:", error);
    }
  }


  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          router.push("/login");
          return;
        }

        // Get user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (profile) {
          // Verify user is a client
          if (profile.role !== "client") {
            router.push("/dashboard");
            return;
          }

          setUser({
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name || "Client User",
            company_name: profile.company_name,
            avatar_url: profile.avatar_url,
            role: profile.role,
          });

          await fetchNotifications(authUser.id);
          await fetchBadges(authUser.id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    getUser();

    // Set up real-time subscription
    const channel = supabase
      .channel("portal-badges")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        async (payload) => {
          // Re-fetch badges
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            fetchBadges(user.id);
            fetchNotifications(user.id); // Update dropdown too
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const handleMarkAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (!error) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-white shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "h-20 flex items-center px-6 border-b border-gray-100 relative",
          isCollapsed ? "justify-center px-0" : "justify-between"
        )}>
          <Link href="/portal" className={cn("flex items-center space-x-3", isCollapsed ? "hidden" : "flex")}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-lg font-bold text-navy-900">IRS</span>
                <span className="text-xs text-gray-500 block -mt-1">
                  Client Portal
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors hidden lg:flex absolute right-4",
              isCollapsed ? "right-1/2 translate-x-1/2 top-4 bg-primary text-white hover:bg-primary/90" : "text-gray-500"
            )}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Company Info */}
        {!isCollapsed && user?.company_name && (
          <div className="px-6 py-4 border-b border-gray-100 transition-opacity duration-300">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Company
            </p>
            <p className="font-semibold text-navy-900 truncate">
              {user.company_name}
            </p>
          </div>
        )}

        {/* Navigation */}
        <TooltipProvider delayDuration={0}>
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;

              const LinkContent = (
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center rounded-xl transition-all relative group",
                    isCollapsed ? "justify-center p-3" : "justify-between px-4 py-3",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <div className={cn("flex items-center", !isCollapsed && "space-x-3")}>
                    <item.icon
                      className={cn(
                        "w-5 h-5 shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                      )}
                    />
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>
                  {!isCollapsed && (item.badge || 0) > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && (item.badge || 0) > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </Link>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>
                      {LinkContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-navy-900 text-white border-navy-800 font-medium">
                      {item.name}
                      {(item.badge || 0) > 0 && <span className="ml-2 text-[10px] bg-red-500 px-1.5 rounded-full">{item.badge}</span>}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={item.name}>{LinkContent}</div>;
            })}
          </nav>
        </TooltipProvider>

        {/* Bottom Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Support Card - Styled with Soft Gray */}
          {!isCollapsed && (
            <div className="mb-3 bg-gray-100 rounded-2xl p-4 text-navy-900 transition-opacity duration-300 border border-gray-200">
              <h4 className="font-semibold mb-1">Need Help?</h4>
              <p className="text-sm text-gray-500 mb-3">
                Contact your project manager or support team.
              </p>
              <Link
                href="/portal/messages"
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Send Message
              </Link>
            </div>
          )}

          {/* Back to Main Site */}
          {!isCollapsed ? (
            <Link
              href="/"
              className="flex items-center space-x-2 px-4 py-2 mb-3 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-xl transition-colors text-sm"
            >
              <Home className="h-4 w-4" />
              <span>Back to Main Site</span>
            </Link>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/"
                    className="flex items-center justify-center p-3 mb-3 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <Home className="h-4 w-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-navy-900 text-white border-navy-800">Back to Main Site</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}


        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:pl-20" : "lg:pl-72"
      )}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            {/* Page Title - Hidden on mobile */}
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-navy-900">
                {navigation.find((n) => n.href === pathname)?.name || "Portal"}
              </h1>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <NotificationDropdown
                notifications={notifications}
                unreadCount={notificationsCount}
                onMarkAsRead={handleMarkAsRead}
              />

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <UserAvatar
                    user={user}
                    className="w-8 h-8 bg-primary/10 text-primary"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.full_name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <Link
                        href="/portal/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2 text-gray-400" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
