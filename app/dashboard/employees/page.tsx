"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Users,
  Mail,
  Phone,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Briefcase,
  Shield,
  UserCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@/types/database";
import { UserAvatar } from "@/components/ui/user-avatar";

interface StaffProfile {
  id: string; // profile id
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  role: UserRole;
  department: string;
  employee_details?: {
    id: string;
    position: string;
    is_public: boolean;
    employee_id: string;
  }[];
}

export default function UserAccountsPage() {
  const [users, setUsers] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [departments, setDepartments] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch profiles that are NOT clients or applicants (i.e., Staff)
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(`
          *,
          employee_details(id, position, is_public, employee_id)
        `)
        .in('role', ['super_admin', 'management', 'editor', 'support'])
        .order("full_name", { ascending: true });

      if (error) throw error;

      const staffData = (profiles as any[]).map(p => ({
        ...p,
        // Ensure employee_details is handled if it's an array or object
        employee_details: Array.isArray(p.employee_details) ? p.employee_details : (p.employee_details ? [p.employee_details] : [])
      }));

      setUsers(staffData);

      // Extract unique departments
      const uniqueDepts = Array.from(new Set(staffData.map(u => u.department).filter(Boolean))) as string[];
      setDepartments(uniqueDepts.sort());

    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = !searchQuery ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === "all" || user.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-700';
      case 'management': return 'bg-purple-100 text-purple-700';
      case 'editor': return 'bg-blue-100 text-blue-700';
      case 'support': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Accounts</h1>
          <p className="text-gray-600">Overview of staff with dashboard access</p>
        </div>
        <Link
          href="/dashboard/users"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors"
        >
          <Users className="h-5 w-5" />
          <span>Manage Users</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          <p className="text-sm text-gray-500">Total Staff Accounts</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-blue-600">
            {departments.length}
          </p>
          <p className="text-sm text-gray-500">Departments</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-purple-600">
            {users.filter(u => u.role === 'management' || u.role === 'super_admin').length}
          </p>
          <p className="text-sm text-gray-500">Management</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-green-600">
            {users.filter(u => u.employee_details && u.employee_details.length > 0 && u.employee_details[0].is_public).length}
          </p>
          <p className="text-sm text-gray-500">Public Profiles</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
            />
          </div>
          <div className="relative min-w-[200px]">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse h-64"></div>
          ))
        ) : filteredUsers.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-12 text-center text-gray-500">
            <UserCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No staff accounts found.</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center">

              <div className="relative mb-4">
                <UserAvatar
                  user={user}
                  className="w-20 h-20 text-xl font-bold"
                />
                <div className={`absolute -bottom-1 -right-1 p-1 bg-white rounded-full`}>
                  <div className={`w-4 h-4 rounded-full ${user.employee_details?.[0]?.is_public ? 'bg-green-500' : 'bg-gray-300'}`} title={user.employee_details?.[0]?.is_public ? 'Publicly Visible' : 'Hidden from Team Page'}></div>
                </div>
              </div>

              {/* Name & Role */}
              <h3 className="text-lg font-bold text-gray-900 mb-1">{user.full_name}</h3>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${getRoleBadgeColor(user.role)}`}>
                {user.role.replace('_', ' ')}
              </span>

              {/* Details */}
              <div className="w-full space-y-2 mt-2 text-sm">
                <div className="flex items-center justify-center text-gray-500 gap-2">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span className="truncate max-w-[150px]">{user.employee_details?.[0]?.position || "No position set"}</span>
                </div>
                {user.department && (
                  <div className="flex items-center justify-center text-gray-500 gap-2">
                    <Users className="h-3.5 w-3.5" />
                    <span>{user.department}</span>
                  </div>
                )}
                <div className="flex items-center justify-center text-gray-500 gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate max-w-[150px]">{user.email}</span>
                </div>
              </div>

              {/* Footer / Team Page status */}
              <div className="mt-6 pt-4 border-t border-gray-100 w-full">
                <p className="text-xs text-gray-400 mb-2">Team Page Status</p>
                {user.employee_details && user.employee_details.length > 0 ? (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${user.employee_details[0].is_public ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
                    {user.employee_details[0].is_public ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {user.employee_details[0].is_public ? 'Visible' : 'Hidden'}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 italic">No Employee Detail Record</span>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

