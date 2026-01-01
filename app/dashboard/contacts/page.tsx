"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Mail,
  Phone,
  Building2,
  Calendar,
  Eye,
  CheckCircle,
  MessageSquare,
  Archive,
  MoreHorizontal,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ContactSubmission {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  company: string | null;
  phone: string | null;
  subject: string;
  message: string;
  status: "new" | "read" | "responded" | "archived";
}

const statusConfig = {
  new: { label: "New", color: "bg-yellow-100 text-yellow-700" },
  read: { label: "Read", color: "bg-blue-100 text-blue-700" },
  responded: { label: "Responded", color: "bg-green-100 text-green-700" },
  archived: { label: "Archived", color: "bg-gray-100 text-gray-500" },
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] =
    useState<ContactSubmission | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchContacts();
  }, [statusFilter]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    id: string,
    newStatus: ContactSubmission["status"]
  ) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      setActionMenuId(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const viewContact = async (contact: ContactSubmission) => {
    setSelectedContact(contact);
    if (contact.status === "new") {
      await updateStatus(contact.id, "read");
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      contact.full_name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.subject.toLowerCase().includes(query) ||
      contact.company?.toLowerCase().includes(query)
    );
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Contact Submissions
          </h1>
          <p className="text-gray-600">
            Messages from website visitors
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            {contacts.filter((c) => c.status === "new").length} new
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
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
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="responded">Responded</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Contacts List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35] mx-auto" />
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-8 text-center">
            <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No contact submissions found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  contact.status === "new" ? "bg-yellow-50/50" : ""
                }`}
                onClick={() => viewContact(contact)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                        contact.status === "new"
                          ? "bg-yellow-500"
                          : "bg-[#004E89]"
                      }`}
                    >
                      {contact.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900">
                          {contact.full_name}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            statusConfig[contact.status].color
                          }`}
                        >
                          {statusConfig[contact.status].label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium mt-0.5">
                        {contact.subject}
                      </p>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {contact.message}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{contact.email}</span>
                        </span>
                        {contact.company && (
                          <span className="flex items-center space-x-1">
                            <Building2 className="h-3 w-3" />
                            <span>{contact.company}</span>
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(contact.created_at)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActionMenuId(
                          actionMenuId === contact.id ? null : contact.id
                        );
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {actionMenuId === contact.id && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionMenuId(null);
                          }}
                        />
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(contact.id, "responded");
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Mark Responded</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(contact.id, "archived");
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <Archive className="h-4 w-4 text-gray-500" />
                            <span>Archive</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedContact(null)}
          />
          <div className="relative bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Contact Details
              </h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-[#004E89] rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {selectedContact.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedContact.full_name}
                  </h3>
                  <p className="text-gray-600">{selectedContact.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedContact.company && (
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium">{selectedContact.company}</p>
                  </div>
                )}
                {selectedContact.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedContact.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium">{selectedContact.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Received</p>
                  <p className="font-medium">
                    {formatDate(selectedContact.created_at)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Message</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t">
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Reply via Email</span>
                </a>
                {selectedContact.phone && (
                  <a
                    href={`tel:${selectedContact.phone}`}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
