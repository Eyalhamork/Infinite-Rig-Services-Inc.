import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import {
  generateEmbedding,
  generateChatResponse,
  shouldHandoffToHuman,
  getHandoffMessage,
} from "@/lib/gemini";
import { generateHaikuResponse } from "@/lib/haiku";

// Supabase client with service role for database operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  messages: Message[];
  conversationId?: string;
  userId?: string;
  visitorEmail?: string;
  visitorName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, conversationId, userId, visitorEmail, visitorName } = body;

    // Validate request
    const latestUserMessage = messages[messages.length - 1];
    if (!latestUserMessage || latestUserMessage.role !== "user") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }

    const userQuery = latestUserMessage.content;

    // Check if user wants to talk to a human
    if (shouldHandoffToHuman(userQuery)) {
      const handoffMessage = getHandoffMessage();

      // Update conversation for handoff if it exists
      if (conversationId) {
        await supabase
          .from("chat_conversations")
          .update({
            handoff_requested: true,
            handoff_requested_at: new Date().toISOString(),
            is_bot_conversation: false,
          })
          .eq("id", conversationId);

        // Save messages
        await saveMessages(conversationId, userQuery, handoffMessage, userId);
      }

      return NextResponse.json({
        message: handoffMessage,
        conversationId: conversationId || generateConversationId(),
        handoffRequested: true,
      });
    }

    // Step 1: Search for relevant documents using vector similarity
    let relevantDocs: any[] = [];
    try {
      relevantDocs = await searchRelevantDocuments(userQuery);
    } catch (error) {
      console.error("Vector document search error:", error);
    }

    // Fallback to local documents search if vector search returned nothing
    if (!relevantDocs || relevantDocs.length === 0) {
      try {
        relevantDocs = searchLocalDocuments(userQuery);
      } catch (localErr) {
        console.error("Local document fallback search error:", localErr);
      }
    }

    // Step 2: Generate AI response with context
    let aiResponse: string;
    const hasAnthropicKey = !!(
      (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim() !== "" && process.env.ANTHROPIC_API_KEY !== "your-anthropic-api-key") ||
      (process.env.CLAUDE_API_KEY && process.env.CLAUDE_API_KEY.trim() !== "")
    );

    try {
      const context = (relevantDocs || []).map((doc) => ({
        content: doc.content,
        source: doc.source_file || "Company Document",
        similarity: doc.similarity ?? doc.score,
      }));

      console.log("Generating response with", context.length, "context documents");

      if (hasAnthropicKey) {
        console.log("Using Claude Haiku for chat completion");
        aiResponse = await generateHaikuResponse(messages, context);
      } else {
        console.log("ANTHROPIC_API_KEY not detected; trying fallback model");
        aiResponse = await generateChatResponse(messages, context);
      }
    } catch (error: any) {
      console.error("AI response error:", error?.message || error);
      console.error("Full error:", JSON.stringify(error, null, 2));

      if (!hasAnthropicKey) {
        aiResponse =
          "The AI assistant is primed for Claude Haiku! Please provide or add your `ANTHROPIC_API_KEY` in `.env.local` to start chatting with the documentation-trained assistant.";
      } else {
        aiResponse =
          "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or contact us directly at info@infiniterigservices.com or +231 88 191 5322.";
      }
    }

    // Step 3: Manage conversation
    let activeConversationId = conversationId;

    if (!activeConversationId) {
      // Create new conversation
      const { data: newConversation, error: convError } = await supabase
        .from("chat_conversations")
        .insert({
          user_id: userId || null,
          visitor_email: visitorEmail || null,
          visitor_name: visitorName || null,
          is_bot_conversation: true,
          status: "active",
          started_at: new Date().toISOString(),
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (convError) {
        console.error("Error creating conversation:", convError);
      } else {
        activeConversationId = newConversation.id;
      }
    }

    // Step 4: Save messages to database
    if (activeConversationId) {
      await saveMessages(activeConversationId, userQuery, aiResponse, userId);

      // Update last_message_at
      await supabase
        .from("chat_conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", activeConversationId);
    }

    return NextResponse.json({
      message: aiResponse,
      conversationId: activeConversationId || generateConversationId(),
      sources: relevantDocs.map((doc) => doc.source_file).filter(Boolean),
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}

/**
 * Search for relevant documents using vector similarity
 */
async function searchRelevantDocuments(query: string, limit: number = 5) {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Call the match_documents function
    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: limit,
    });

    if (error) {
      console.error("Vector search error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Document search error:", error);
    return [];
  }
}

/**
 * Fallback keyword search on local documentation files
 */
function searchLocalDocuments(query: string, limit: number = 5): any[] {
  try {
    const docsDir = path.join(process.cwd(), "documents");
    if (!fs.existsSync(docsDir)) return [];

    const files = fs.readdirSync(docsDir).filter((f) => f.endsWith(".txt") || f.endsWith(".md"));
    const stopWords = new Set(["what", "is", "the", "and", "or", "to", "in", "for", "with", "about", "are", "you", "tell", "me"]);
    const queryWords = query
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));

    if (queryWords.length === 0) return [];

    const matches: { content: string; source_file: string; score: number }[] = [];

    for (const file of files) {
      const filePath = path.join(docsDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const paragraphs = fileContent.split(/\r?\n\s*\r?\n/).filter((p) => p.trim().length > 30);

      for (const p of paragraphs) {
        const pLower = p.toLowerCase();
        let score = 0;
        for (const word of queryWords) {
          if (pLower.includes(word)) {
            score += 1;
          }
        }
        if (score > 0) {
          matches.push({
            content: p.trim(),
            source_file: file,
            score,
          });
        }
      }
    }

    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, limit);
  } catch (err) {
    console.error("Local document fallback error:", err);
    return [];
  }
}

/**
 * Save messages to the database
 */
async function saveMessages(
  conversationId: string,
  userMessage: string,
  aiResponse: string,
  userId?: string
) {
  try {
    // Save user message
    await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      sender_type: "user",
      sender_id: userId || null,
      message: userMessage,
      created_at: new Date().toISOString(),
    });

    // Save AI response
    await supabase.from("chat_messages").insert({
      conversation_id: conversationId,
      sender_type: "bot",
      sender_id: null,
      message: aiResponse,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error saving messages:", error);
  }
}

/**
 * Generate a unique conversation ID
 */
function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * GET endpoint to retrieve conversation history
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID required" },
        { status: 400 }
      );
    }

    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}
