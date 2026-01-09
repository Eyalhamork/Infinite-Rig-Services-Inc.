"use client";

import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  Send,
  MessageSquare,
  User,
  Search,
  Clock,
  CheckCheck,
} from "lucide-react";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Message {
  id: string;
  message: string;
  sender_id: string;
  sender_name: string;
  sender_type: "client" | "staff";
  created_at: string;
  is_read: boolean;
  project_id: string;
  project_name?: string;
}

interface Project {
  id: string;
  project_name: string;
}

export default function PortalMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        setUserId(user.id);

        // Get client record
        const { data: client } = await supabase
          .from("clients")
          .select("id")
          .eq("primary_contact_id", user.id)
          .single();

        if (client) {
          setClientId(client.id);
          // Fetch projects
          const { data: projectsData } = await supabase
            .from("projects")
            .select("id, project_name")
            .eq("client_id", client.id)
            .order("updated_at", { ascending: false });

          setProjects(projectsData || []);

          if (projectsData && projectsData.length > 0) {
            setSelectedProject(projectsData[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchMessages() {
      if (!selectedProject) return;

      try {
        const { data } = await supabase
          .from("project_messages")
          .select(
            `
            *,
            sender:profiles!project_messages_sender_id_fkey(full_name)
          `
          )
          .eq("project_id", selectedProject)
          .order("created_at", { ascending: true });

        const formattedMessages =
          data?.map((msg: any) => ({
            ...msg,
            sender_name: msg.sender?.full_name || "Unknown",
            sender_type: msg.sender_id === userId ? "client" : "staff",
          })) || [];

        setMessages(formattedMessages);

        // Mark messages as read
        if (userId) {
          await supabase
            .from("project_messages")
            .update({ is_read: true })
            .eq("project_id", selectedProject)
            .neq("sender_id", userId);


          // Mark message notifications as read
          await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", userId)
            .eq("type", "message");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }

    fetchMessages();
  }, [selectedProject, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedProject || !userId || !clientId) return;

    setSending(true);

    try {
      const { error } = await supabase.from("project_messages").insert({
        project_id: selectedProject,
        client_id: clientId,
        sender_id: userId,
        sender_type: "client",
        message: newMessage.trim(),
        is_read: false,
      });

      if (error) throw error;

      // Add message to local state
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          message: newMessage.trim(),
          sender_id: userId,
          sender_name: "You",
          sender_type: "client",
          created_at: new Date().toISOString(),
          is_read: true,
          project_id: selectedProject,
        },
      ]);

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-12rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col md:flex-row gap-6">
      {/* Projects Sidebar */}
      <div className="w-full md:w-72 bg-white rounded-2xl shadow-sm border border-gray-100 flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-navy-900">Project Conversations</h2>
        </div>

        <div className="overflow-y-auto max-h-[calc(100%-60px)]">
          {projects.length > 0 ? (
            <div className="p-2">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project.id)}
                  className={`w-full text-left p-3 rounded-xl transition-colors ${selectedProject === project.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-gray-50 text-gray-700"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedProject === project.id
                        ? "bg-primary text-white"
                        : "bg-gray-100"
                        }`}
                    >
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="font-medium truncate">
                      {project.project_name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No projects yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        {selectedProject ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-bold text-navy-900">
                {projects.find((p) => p.id === selectedProject)?.project_name}
              </h2>
              <p className="text-sm text-gray-500">
                Send messages to your project team
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === userId
                      ? "justify-end"
                      : "justify-start"
                      }`}
                  >
                    <div
                      className={`max-w-[70%] ${message.sender_id === userId
                        ? "order-2"
                        : "order-1"
                        }`}
                    >
                      {message.sender_id !== userId && (
                        <p className="text-xs text-gray-500 mb-1 px-1">
                          {message.sender_name}
                        </p>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-3 ${message.sender_id === userId
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-900"
                          }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-1 mt-1 px-1 ${message.sender_id === userId
                          ? "justify-end"
                          : "justify-start"
                          }`}
                      >
                        <span className="text-xs text-gray-400">
                          {new Date(message.created_at).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                        {message.sender_id === userId && (
                          <CheckCheck
                            className={`w-4 h-4 ${message.is_read
                              ? "text-blue-500"
                              : "text-gray-400"
                              }`}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-sm text-gray-400">
                      Start a conversation with your project team
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows={1}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="w-12 h-12 bg-primary hover:bg-orange-600 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a project to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
