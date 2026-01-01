"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Building2,
  Mail,
  Phone,
  Globe,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  MessageSquare,
  FolderOpen,
  X,
  User,
  MapPin,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Client {
  id: string;
  company_name: string;
  industry: string;
  primary_contact_id: string;
  address: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  contract_start_date: string;
  contract_end_date: string;
  is_active: boolean;
  notes: string;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
    phone: string;
    avatar_url: string;
  };
  _count?: {
    projects: number;
    messages: number;
  };
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchClients();
  }, [statusFilter]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("clients")
        .select(`
          *,
          profiles:primary_contact_id (full_name, email, phone, avatar_url)
        `)
        .order("company_name", { ascending: true });

      if (statusFilter === "active") {
        query = query.eq("is_active", true);
      } else if (statusFilter === "inactive") {
        query = query.eq("is_active", false);
      }

      const { data, error } = await query;

      // Debug logging
      console.log("[Clients Page] Query result:", { data, error });

      if (error) throw error;

      // Get counts for each client
      const clientsWithCounts = await Promise.all(
        (data || []).map(async (client) => {
          const { count: projectCount } = await supabase
            .from("projects")
            .select("*", { count: "exact", head: true })
            .eq("client_id", client.id);

          const { count: messageCount } = await supabase
            .from("project_messages")
            .select("*", { count: "exact", head: true })
            .eq("client_id", client.id)
            .eq("is_read", false);

          return {
            ...client,
            _count: {
              projects: projectCount || 0,
              messages: messageCount || 0,
            },
          };
        })
      );

      console.log("[Clients Page] Clients with counts:", clientsWithCounts);
      setClients(clientsWithCounts);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleClientStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("clients")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_active: !currentStatus } : c))
      );
      setActionMenuId(null);
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  const deleteClient = async (id: string) => {
    if (!confirm("Are you sure? This will also delete all projects and messages for this client.")) return;

    try {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
      setClients((prev) => prev.filter((c) => c.id !== id));
      setActionMenuId(null);
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const filteredClients = clients.filter((client) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      client.company_name.toLowerCase().includes(query) ||
      client.industry?.toLowerCase().includes(query) ||
      client.profiles?.full_name?.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query)
    );
  });

  const formatDate = (date: string) => {
    if (!date) return "N/A";
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
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600">Manage client companies and contacts</p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Client</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
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
            <option value="all">All Clients</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35] mx-auto" />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-8 text-center">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No clients found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Industry
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Activity
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {client.profiles?.avatar_url ? (
                          <img
                            src={client.profiles.avatar_url}
                            alt={client.company_name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-[#004E89] rounded-lg flex items-center justify-center text-white font-semibold">
                            {client.company_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">
                            {client.company_name}
                          </p>
                          {client.country && (
                            <p className="text-sm text-gray-500 flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{client.country}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {client.profiles?.full_name || "No contact"}
                      </p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">
                        {client.industry || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${client.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {client.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center space-x-1 text-gray-600">
                          <FolderOpen className="h-4 w-4" />
                          <span>{client._count?.projects || 0}</span>
                        </span>
                        {(client._count?.messages || 0) > 0 && (
                          <span className="flex items-center space-x-1 text-orange-600">
                            <MessageSquare className="h-4 w-4" />
                            <span>{client._count?.messages}</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/dashboard/messages?client=${client.id}`}
                          className="p-2 text-gray-600 hover:text-[#FF6B35] hover:bg-gray-100 rounded-lg"
                          title="Messages"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Link>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActionMenuId(
                                actionMenuId === client.id ? null : client.id
                              )
                            }
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          {actionMenuId === client.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setActionMenuId(null)}
                              />
                              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                                <Link
                                  href={`/dashboard/clients/${client.id}`}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span>Edit</span>
                                </Link>
                                <button
                                  onClick={() =>
                                    toggleClientStatus(client.id, client.is_active)
                                  }
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                                >
                                  {client.is_active ? (
                                    <>
                                      <X className="h-4 w-4" />
                                      <span>Deactivate</span>
                                    </>
                                  ) : (
                                    <>
                                      <Building2 className="h-4 w-4" />
                                      <span>Activate</span>
                                    </>
                                  )}
                                </button>
                                <hr className="my-1" />
                                <button
                                  onClick={() => deleteClient(client.id)}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
          <p className="text-sm text-gray-500">Total Clients</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-600">
            {clients.filter((c) => c.is_active).length}
          </p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">
            {clients.reduce((sum, c) => sum + (c._count?.projects || 0), 0)}
          </p>
          <p className="text-sm text-gray-500">Total Projects</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-orange-600">
            {clients.reduce((sum, c) => sum + (c._count?.messages || 0), 0)}
          </p>
          <p className="text-sm text-gray-500">Pending Messages</p>
        </div>
      </div>
    </div>
  );
}
