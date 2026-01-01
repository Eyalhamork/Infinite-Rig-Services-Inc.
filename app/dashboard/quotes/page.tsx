"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ClipboardList,
  Mail,
  Phone,
  Building2,
  Calendar,
  Eye,
  CheckCircle,
  Archive,
  MoreHorizontal,
  X,
  FileText,
  Anchor,
  Package,
  Briefcase,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface QuoteSubmission {
  id: string;
  created_at: string;
  service_area: string;
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  project_requirements: string | null;
  status: "new" | "reviewed" | "quoted" | "archived";
}

const statusConfig = {
  new: { label: "New", color: "bg-yellow-100 text-yellow-700" },
  reviewed: { label: "Reviewed", color: "bg-blue-100 text-blue-700" },
  quoted: { label: "Quoted", color: "bg-green-100 text-green-700" },
  archived: { label: "Archived", color: "bg-gray-100 text-gray-500" },
};

const serviceIcons: Record<string, React.ElementType> = {
  offshore: Anchor,
  supply: Package,
  manning: Briefcase,
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [selectedQuote, setSelectedQuote] = useState<QuoteSubmission | null>(
    null
  );
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchQuotes();
  }, [statusFilter, serviceFilter]);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("quote_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (serviceFilter !== "all") {
        query = query.eq("service_area", serviceFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    id: string,
    newStatus: QuoteSubmission["status"]
  ) => {
    try {
      const { error } = await supabase
        .from("quote_submissions")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
      );
      setActionMenuId(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const viewQuote = async (quote: QuoteSubmission) => {
    setSelectedQuote(quote);
    if (quote.status === "new") {
      await updateStatus(quote.id, "reviewed");
    }
  };

  const filteredQuotes = quotes.filter((quote) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      quote.full_name.toLowerCase().includes(query) ||
      quote.email.toLowerCase().includes(query) ||
      quote.company_name?.toLowerCase().includes(query) ||
      quote.service_area.toLowerCase().includes(query)
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

  const getServiceLabel = (service: string) => {
    const labels: Record<string, string> = {
      offshore: "Offshore Services",
      supply: "Supply Chain & Logistics",
      manning: "Manning Services",
    };
    return labels[service] || service;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quote Requests</h1>
          <p className="text-gray-600">Service quote requests from potential clients</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            {quotes.filter((q) => q.status === "new").length} new
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
              placeholder="Search by name, email, or company..."
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
            <option value="reviewed">Reviewed</option>
            <option value="quoted">Quoted</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none bg-white"
          >
            <option value="all">All Services</option>
            <option value="offshore">Offshore Services</option>
            <option value="supply">Supply Chain</option>
            <option value="manning">Manning Services</option>
          </select>
        </div>
      </div>

      {/* Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          ))
        ) : filteredQuotes.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-8 text-center">
            <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No quote requests found</p>
          </div>
        ) : (
          filteredQuotes.map((quote) => {
            const ServiceIcon =
              serviceIcons[quote.service_area] || ClipboardList;
            return (
              <div
                key={quote.id}
                onClick={() => viewQuote(quote)}
                className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${
                  quote.status === "new"
                    ? "border-l-yellow-500"
                    : quote.status === "quoted"
                    ? "border-l-green-500"
                    : "border-l-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        quote.service_area === "offshore"
                          ? "bg-blue-100 text-blue-600"
                          : quote.service_area === "supply"
                          ? "bg-green-100 text-green-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      <ServiceIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {quote.full_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getServiceLabel(quote.service_area)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusConfig[quote.status].color
                    }`}
                  >
                    {statusConfig[quote.status].label}
                  </span>
                </div>

                {quote.company_name && (
                  <p className="text-sm text-gray-600 mb-2 flex items-center space-x-1">
                    <Building2 className="h-3 w-3" />
                    <span>{quote.company_name}</span>
                  </p>
                )}

                <p className="text-sm text-gray-500 mb-3 flex items-center space-x-1">
                  <Mail className="h-3 w-3" />
                  <span>{quote.email}</span>
                </p>

                {quote.project_requirements && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {quote.project_requirements}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {formatDate(quote.created_at)}
                  </span>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActionMenuId(
                          actionMenuId === quote.id ? null : quote.id
                        );
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {actionMenuId === quote.id && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionMenuId(null);
                          }}
                        />
                        <div className="absolute right-0 bottom-full mb-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(quote.id, "quoted");
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Mark Quoted</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(quote.id, "archived");
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
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedQuote(null)}
          />
          <div className="relative bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Quote Request Details</h2>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                    selectedQuote.service_area === "offshore"
                      ? "bg-blue-100 text-blue-600"
                      : selectedQuote.service_area === "supply"
                      ? "bg-green-100 text-green-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {(() => {
                    const Icon =
                      serviceIcons[selectedQuote.service_area] || ClipboardList;
                    return <Icon className="h-8 w-8" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedQuote.full_name}
                  </h3>
                  <p className="text-gray-600">
                    {getServiceLabel(selectedQuote.service_area)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedQuote.email}</p>
                </div>
                {selectedQuote.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedQuote.phone}</p>
                  </div>
                )}
                {selectedQuote.company_name && (
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium">{selectedQuote.company_name}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-medium">
                    {formatDate(selectedQuote.created_at)}
                  </p>
                </div>
              </div>

              {selectedQuote.project_requirements && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Project Requirements
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedQuote.project_requirements}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 pt-4 border-t">
                <a
                  href={`mailto:${selectedQuote.email}?subject=Re: Quote Request - ${getServiceLabel(selectedQuote.service_area)}`}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Send Quote</span>
                </a>
                {selectedQuote.phone && (
                  <a
                    href={`tel:${selectedQuote.phone}`}
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
