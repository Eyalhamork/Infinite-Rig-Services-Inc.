"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import {
  Search,
  MessageSquare,
  Send,
  Building2,
  Clock,
  User,
  ChevronLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Client {
  id: string;
  company_name: string;
  primary_contact_id: string;
  profiles?: {
    full_name: string;
    email: string;
    avatar_url?: string;
    role: string;
  };
}

interface Message {
  id: string;
  client_id: string;
  sender_id: string;
  sender_type: "client" | "staff";
  message: string;
  is_read: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
  };
  project_id?: string;
  project?: {
    project_name: string;
  };
}

interface ConversationPreview {
  client: Client;
  lastMessage: Message | null;
  unreadCount: number;
}

interface Project {
  id: string;
  project_name: string;
}

const GENERAL_PROJECT_ID = "general";

function MessagesContent() {
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const urlClientId = searchParams.get('client_id');

  const [clientProjects, setClientProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>(GENERAL_PROJECT_ID);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
      await fetchConversations();

      // Mark message notifications as read
      if (user) {
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("user_id", user.id)
          .eq("type", "message");
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchMessages(selectedClient.id);
      markMessagesAsRead(selectedClient.id);
      fetchClientProjects(selectedClient.id);
    }
  }, [selectedClient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      // Fetch all clients with their contact info
      const { data: clients, error: clientsError } = await supabase
        .from("clients")
        .select(`
          id,
          company_name,
          primary_contact_id,
          profiles:primary_contact_id (full_name, email, avatar_url, role)
        `)
        .eq("is_active", true);

      if (clientsError) throw clientsError;

      // Fetch latest message and unread count for each client
      const conversationPreviews: ConversationPreview[] = [];

      for (const client of clients || []) {
        const { data: lastMsg } = await supabase
          .from("project_messages")
          .select("*")
          .eq("client_id", client.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        const { count: unreadCount } = await supabase
          .from("project_messages")
          .select("*", { count: "exact", head: true })
          .eq("client_id", client.id)
          .eq("is_read", false)
          .eq("sender_type", "client");

        conversationPreviews.push({
          client: client as unknown as Client,
          lastMessage: lastMsg || null,
          unreadCount: unreadCount || 0,
        });
      }

      // Sort by last message time, then unread
      conversationPreviews.sort((a, b) => {
        if (a.unreadCount !== b.unreadCount) return b.unreadCount - a.unreadCount;
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime();
      });

      setConversations(conversationPreviews);

      // Auto-select client if in URL
      if (urlClientId) {
        // Find in loaded clients
        const targetClient = clients?.find(c => c.id === urlClientId);
        if (targetClient) {
          setSelectedClient(targetClient as unknown as Client);
        } else {
          // If not in list (maybe inactive?), fetch directly
          const { data: directClient } = await supabase
            .from("clients")
            .select(`
                 id,
                 company_name,
                 primary_contact_id,
                 profiles:primary_contact_id (full_name, email, avatar_url, role)
               `)
            .eq("id", urlClientId)
            .single();

          if (directClient) {
            setSelectedClient(directClient as unknown as Client);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from("project_messages")
        .select(`
          *,
          profiles:sender_id (full_name),
          project:projects(project_name)
        `)
        .eq("client_id", clientId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchClientProjects = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("id, project_name")
        .eq("client_id", clientId)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setClientProjects(data || []);

      // Reset to General Project when switching clients
      setSelectedProject(GENERAL_PROJECT_ID);

    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const markMessagesAsRead = async (clientId: string) => {
    try {
      await supabase
        .from("project_messages")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("client_id", clientId)
        .eq("sender_type", "client")
        .eq("is_read", false);

      setConversations((prev) =>
        prev.map((c) =>
          c.client.id === clientId ? { ...c, unreadCount: 0 } : c
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedClient || !currentUserId) return;

    setSendingMessage(true);
    try {
      const { data, error } = await supabase
        .from("project_messages")
        .insert({
          client_id: selectedClient.id,
          sender_id: currentUserId,
          sender_type: "staff",
          message: newMessage.trim(),
          project_id: selectedProject === GENERAL_PROJECT_ID ? null : selectedProject,
        })
        .select(`*, profiles:sender_id (full_name), project:projects(project_name)`)
        .single();

      if (error) throw error;

      setMessages((prev) => [...prev, data]);
      setNewMessage("");

      // Update conversation preview
      setConversations((prev) =>
        prev.map((c) =>
          c.client.id === selectedClient.id
            ? { ...c, lastMessage: data }
            : c
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return d.toLocaleDateString("en-US", { weekday: "short" });
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      c.client.company_name.toLowerCase().includes(query) ||
      c.client.profiles?.full_name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Conversations List */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col ${selectedClient ? "hidden md:flex" : "flex"
          }`}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-3 p-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No conversations yet</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.client.id}
                onClick={() => setSelectedClient(conv.client)}
                className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${selectedClient?.id === conv.client.id ? "bg-orange-50" : ""
                  }`}
              >
                <div className="relative">
                  <UserAvatar
                    user={conv.client.profiles ? { ...conv.client.profiles, role: conv.client.profiles.role || 'client' } : { full_name: conv.client.company_name, role: 'client' }}
                    className="w-12 h-12 text-sm font-semibold"
                  />
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B35] text-white text-xs rounded-full flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 truncate">
                      {conv.client.company_name}
                    </p>
                    {conv.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatTime(conv.lastMessage.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conv.client.profiles?.full_name}
                  </p>
                  {conv.lastMessage && (
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conv.lastMessage.sender_type === "staff" && "You: "}
                      {conv.lastMessage.message}
                    </p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col ${selectedClient ? "flex" : "hidden md:flex"
          }`}
      >
        {selectedClient ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
              <button
                onClick={() => setSelectedClient(null)}
                className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <UserAvatar
                user={selectedClient.profiles ? { ...selectedClient.profiles, role: selectedClient.profiles.role || 'client' } : { full_name: selectedClient.company_name, role: 'client' }}
                className="w-10 h-10 text-sm font-semibold"
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {selectedClient.company_name}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedClient.profiles?.full_name}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No messages yet</p>
                  <p className="text-sm text-gray-400">
                    Start the conversation
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_type === "staff" ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${msg.sender_type === "staff"
                        ? "bg-[#FF6B35] text-white rounded-br-md"
                        : "bg-white text-gray-900 rounded-bl-md shadow-sm"
                        }`}
                    >
                      {msg.sender_type === "client" && (
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          {msg.profiles?.full_name}
                        </p>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${msg.sender_type === "staff"
                          ? "text-white/70"
                          : "text-gray-400"
                          }`}
                      >
                        {formatTime(msg.created_at)}
                      </p>
                      {msg.project && (
                        <p className="text-[10px] mt-1 text-gray-400 text-right italic">
                          via {msg.project.project_name}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={sendMessage}
              className="p-4 border-t border-gray-200 bg-white"
            >
              <div className="flex flex-col gap-3">
                {/* Project Context Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Context:</span>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="w-[200px] h-8 text-xs bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Select context" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={GENERAL_PROJECT_ID}>General Support</SelectItem>
                      {clientProjects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.project_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sendingMessage}
                    className="p-3 bg-[#FF6B35] text-white rounded-full hover:bg-[#e55a2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-600">
                Select a conversation
              </p>
              <p className="text-gray-500">
                Choose a client to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div>Loading conversations...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
