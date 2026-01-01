"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  X,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm the Infinite Rig Services AI assistant. I can help you with information about our services, careers, safety policies, and more. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call to OpenAI/Google
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     messages: [...messages, userMessage],
      //     conversationId: 'session-id'
      //   })
      // });
      // const data = await response.json();

      // Simulated response - replace with actual API response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "This is a placeholder response. The actual AI integration will be added using OpenAI or Google API. I'll be able to answer questions about offshore services, careers, safety policies, and more!",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "system",
        content:
          "Sorry, I encountered an error. Please try again or contact support.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Hello! I'm the Infinite Rig Services AI assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    setShowHandoff(false);
  };

  const handleHandoffToHuman = () => {
    setShowHandoff(true);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F4] via-white to-[#F4F4F4]">
      <div className="container mx-auto px-4 py-8 max-w-6xl h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#B8860B] rounded-full flex items-center justify-center">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1A1A2E]">
                  AI Assistant
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-600">
                    Online - Ready to help
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleNewChat}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">New Chat</span>
              </button>
              <button
                onClick={handleHandoffToHuman}
                className="px-4 py-2 bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-lg transition-colors"
              >
                <span className="hidden sm:inline">Talk to Human</span>
                <span className="sm:hidden">Support</span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 bg-white shadow-lg overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } ${message.role === "system" ? "justify-center" : ""}`}
            >
              {message.role === "system" ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
                  <div className="flex items-center space-x-2 text-yellow-800">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div
                  className={`flex space-x-3 max-w-3xl ${
                    message.role === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-[#004E89]"
                        : "bg-gradient-to-br from-[#FF6B35] to-[#B8860B]"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1">
                    <div
                      className={`rounded-2xl p-4 ${
                        message.role === "user"
                          ? "bg-[#004E89] text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>

                    {/* Timestamp and Actions */}
                    <div
                      className={`flex items-center space-x-3 mt-2 text-xs text-gray-500 ${
                        message.role === "user" ? "justify-end" : ""
                      }`}
                    >
                      <span>{formatTime(message.timestamp)}</span>
                      {message.role === "assistant" && (
                        <div className="flex items-center space-x-2">
                          <button className="hover:text-green-600 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button className="hover:text-red-600 transition-colors">
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-3xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#B8860B] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-b-2xl shadow-lg p-6 border-t border-gray-200">
          {showHandoff && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Request sent to support team
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      A human support agent will join this conversation shortly.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHandoff(false)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none resize-none"
                rows={1}
                style={{ minHeight: "56px", maxHeight: "200px" }}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-14 h-14 bg-[#FF6B35] hover:bg-[#ff5722] text-white rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setInput("Tell me about your offshore services")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
            >
              Offshore Services
            </button>
            <button
              onClick={() => setInput("What job positions are available?")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
            >
              Job Openings
            </button>
            <button
              onClick={() => setInput("Tell me about your safety policies")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
            >
              Safety Policies
            </button>
            <button
              onClick={() => setInput("How do I apply for a position?")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
            >
              Application Process
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
