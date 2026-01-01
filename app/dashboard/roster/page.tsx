"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    Download,
    MoreHorizontal,
    Plus,
    QrCode,
    Calendar,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Employee, EmploymentStatus } from "@/types/database";
import EmployeePhoto from "@/components/EmployeePhoto";
import { isCardExpired } from "@/lib/utils";

export default function StaffRosterPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [departments, setDepartments] = useState<string[]>([]);
    const supabase = createClient();

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("employees")
                .select("*")
                .order("full_name", { ascending: true });

            if (error) throw error;

            const empData = data as Employee[] || [];
            setEmployees(empData);

            // Extract unique departments for filter
            const uniqueDepts = Array.from(new Set(empData.map(e => e.department))).sort();
            setDepartments(uniqueDepts);

        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter((emp) => {
        // Search filter
        const matchesSearch = !searchQuery ||
            emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.position.toLowerCase().includes(searchQuery.toLowerCase());

        // Department filter
        const matchesDept = departmentFilter === "all" || emp.department === departmentFilter;

        // Status filter
        const matchesStatus = statusFilter === "all" || emp.employment_status === statusFilter;

        return matchesSearch && matchesDept && matchesStatus;
    });

    const formatDate = (date: string | null) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getStatusBadge = (status: EmploymentStatus, expiryDate: string | null) => {
        const expired = isCardExpired(expiryDate);

        if (expired) {
            return (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                    <AlertCircle className="h-3 w-3" />
                    <span>Card Expired</span>
                </span>
            );
        }

        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        <CheckCircle className="h-3 w-3" />
                        <span>Active</span>
                    </span>
                );
            case 'inactive':
                return (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        <AlertCircle className="h-3 w-3" />
                        <span>Inactive</span>
                    </span>
                );
            case 'terminated':
                return (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        <XCircle className="h-3 w-3" />
                        <span>Terminated</span>
                    </span>
                );
            default:
                return null;
        }
    };

    // Open the verification page for this employee (this is where QR codes on ID badges point to)
    const handleViewVerification = (id: string) => {
        window.open(`/verify/${id}`, '_blank');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Staff Roster</h1>
                    <p className="text-gray-600">Master list of all employees and ID verification status</p>
                </div>
                {/* Placeholder for Add Employee - functionality to be implemented if needed */}
                {/* <button className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#004E89] text-white rounded-lg hover:bg-[#003d6b] transition-colors">
          <Plus className="h-5 w-5" />
          <span>Add New Staff</span>
        </button> */}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Total Staff</p>
                    <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Active IDs</p>
                    <p className="text-2xl font-bold text-green-600">
                        {employees.filter(e => e.employment_status === 'active' && !isCardExpired(e.card_expiry_date)).length}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Expired Cards</p>
                    <p className="text-2xl font-bold text-amber-600">
                        {employees.filter(e => isCardExpired(e.card_expiry_date)).length}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Departments</p>
                    <p className="text-2xl font-bold text-[#004E89]">{departments.length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or position..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004E89] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="relative min-w-[180px]">
                            <select
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004E89] focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
                            >
                                <option value="all">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="relative min-w-[150px]">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004E89] focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="terminated">Terminated</option>
                            </select>
                            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID Number</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Card Expiry</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                // Skeleton rows
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                                <div className="space-y-2">
                                                    <div className="w-32 h-4 bg-gray-200 rounded" />
                                                    <div className="w-24 h-3 bg-gray-200 rounded" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><div className="w-24 h-4 bg-gray-200 rounded" /></td>
                                        <td className="px-6 py-4"><div className="w-32 h-4 bg-gray-200 rounded" /></td>
                                        <td className="px-6 py-4"><div className="w-20 h-6 bg-gray-200 rounded-full" /></td>
                                        <td className="px-6 py-4"><div className="w-24 h-4 bg-gray-200 rounded" /></td>
                                        <td className="px-6 py-4"></td>
                                    </tr>
                                ))
                            ) : filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No employees found matching your filters
                                    </td>
                                </tr>
                            ) : (
                                filteredEmployees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-3">
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100">
                                                    <EmployeePhoto
                                                        src={employee.photo_url || '/images/employees/placeholder.svg'}
                                                        alt={employee.full_name}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{employee.full_name}</div>
                                                    <div className="text-xs text-[#FF6B35]">{employee.position}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                                {employee.employee_id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">{employee.department}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(employee.employment_status, employee.card_expiry_date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`flex items-center space-x-1.5 text-sm ${isCardExpired(employee.card_expiry_date) ? 'text-amber-600 font-medium' : 'text-gray-600'}`}>
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{formatDate(employee.card_expiry_date)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleViewVerification(employee.employee_id)}
                                                    className="p-2 text-gray-400 hover:text-[#004E89] hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Verification Page"
                                                >
                                                    <QrCode className="h-4 w-4" />
                                                </button>
                                                {/* <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
