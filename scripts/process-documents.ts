/**
 * Document Processor for RAG
 *
 * This script processes company documents and generates embeddings
 * using Google Gemini, then stores them in Supabase for vector search.
 *
 * Run with: npx tsx scripts/process-documents.ts
 *
 * Make sure to set environment variables:
 * - GOOGLE_API_KEY
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load environment variables if running locally
require("dotenv").config({ path: ".env.local" });

// Initialize clients
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// Configuration
const CHUNK_SIZE = 800; // Characters per chunk (adjusted for better context)
const CHUNK_OVERLAP = 150; // Overlap between chunks
const DOCUMENTS_DIR = "./documents";
const RATE_LIMIT_DELAY = 500; // ms between API calls

interface DocumentChunk {
  content: string;
  metadata: {
    source: string;
    type: string;
    chunk_index: number;
    total_chunks: number;
  };
}

interface ProcessedDocument {
  filename: string;
  content: string;
  metadata: {
    source: string;
    type: string;
  };
}

/**
 * Main processing function
 */
async function processDocuments() {
  console.log("🚀 Starting document processing with Google Gemini...\n");

  // Verify environment variables
  if (!process.env.GOOGLE_API_KEY) {
    console.error("❌ GOOGLE_API_KEY is not set");
    process.exit(1);
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL is not set");
    process.exit(1);
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY is not set");
    process.exit(1);
  }

  try {
    // 1. Load documents
    const documents = await loadDocuments(DOCUMENTS_DIR);
    console.log(`📄 Loaded ${documents.length} documents\n`);

    if (documents.length === 0) {
      console.log("⚠️  No documents found to process");
      return;
    }

    // 2. Clear existing embeddings
    console.log("🗑️  Clearing existing embeddings...");
    const { error: clearError } = await supabase
      .from("document_embeddings")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

    if (clearError) {
      console.warn("Warning clearing embeddings:", clearError.message);
    }
    console.log("✅ Cleared existing embeddings\n");

    // 3. Split into chunks
    const chunks = splitIntoChunks(documents, CHUNK_SIZE, CHUNK_OVERLAP);
    console.log(`✂️  Created ${chunks.length} chunks\n`);

    // 4. Generate embeddings and store
    console.log("🔄 Generating embeddings with Gemini...\n");
    let processed = 0;
    let failed = 0;

    for (const chunk of chunks) {
      try {
        // Generate embedding using Gemini
        const embedding = await generateEmbedding(chunk.content);

        // Store in database
        const { error } = await supabase.from("document_embeddings").insert({
          content: chunk.content,
          embedding: embedding,
          metadata: chunk.metadata,
          source_file: chunk.metadata.source,
          chunk_index: chunk.metadata.chunk_index,
        });

        if (error) {
          console.error(`   ❌ Error storing chunk: ${error.message}`);
          failed++;
        } else {
          processed++;
          if (processed % 5 === 0 || processed === chunks.length) {
            console.log(
              `   📊 Progress: ${processed}/${chunks.length} chunks processed`
            );
          }
        }

        // Rate limiting
        await sleep(RATE_LIMIT_DELAY);
      } catch (error: any) {
        console.error(`   ❌ Error processing chunk: ${error.message}`);
        failed++;
      }
    }

    console.log(`\n✅ Successfully processed ${processed} chunks`);
    if (failed > 0) {
      console.log(`⚠️  Failed to process ${failed} chunks`);
    }
    console.log("\n🎉 Document processing complete!");
  } catch (error: any) {
    console.error("❌ Error processing documents:", error.message);
    process.exit(1);
  }
}

/**
 * Load all documents from directory
 */
async function loadDocuments(dirPath: string): Promise<ProcessedDocument[]> {
  const documents: ProcessedDocument[] = [];

  if (!fs.existsSync(dirPath)) {
    console.error(`❌ Directory ${dirPath} does not exist`);
    return documents;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    // Process .txt and .md files, skip .ts files
    if (
      stat.isFile() &&
      (file.endsWith(".md") || file.endsWith(".txt")) &&
      !file.endsWith(".ts")
    ) {
      try {
        const content = fs.readFileSync(filePath, "utf-8");

        // Skip empty files
        if (content.trim().length < 50) {
          console.log(`   ⏭️  Skipping ${file} (too short)`);
          continue;
        }

        documents.push({
          filename: file,
          content: content,
          metadata: {
            source: file,
            type: path.extname(file).slice(1),
          },
        });
        console.log(`   ✅ Loaded: ${file} (${content.length} chars)`);
      } catch (error: any) {
        console.error(`   ❌ Error loading ${file}: ${error.message}`);
      }
    }
  }

  return documents;
}

/**
 * Split documents into overlapping chunks
 */
function splitIntoChunks(
  documents: ProcessedDocument[],
  chunkSize: number,
  overlap: number
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];

  for (const doc of documents) {
    const content = doc.content;

    // Split by paragraphs first, then by size
    const paragraphs = content.split(/\n\n+/);
    let currentChunk = "";
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
      // If adding this paragraph exceeds chunk size
      if (currentChunk.length + paragraph.length > chunkSize && currentChunk) {
        // Save current chunk
        if (currentChunk.trim().length > 50) {
          chunks.push({
            content: currentChunk.trim(),
            metadata: {
              ...doc.metadata,
              chunk_index: chunkIndex,
              total_chunks: 0, // Will be updated later
            },
          });
          chunkIndex++;
        }

        // Start new chunk with overlap
        const words = currentChunk.split(" ");
        const overlapWords = words.slice(-Math.floor(overlap / 5));
        currentChunk = overlapWords.join(" ") + "\n\n" + paragraph;
      } else {
        currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
      }
    }

    // Don't forget the last chunk
    if (currentChunk.trim().length > 50) {
      chunks.push({
        content: currentChunk.trim(),
        metadata: {
          ...doc.metadata,
          chunk_index: chunkIndex,
          total_chunks: chunkIndex + 1,
        },
      });
    }

    // Update total chunks count
    const docChunks = chunks.filter(
      (c) => c.metadata.source === doc.metadata.source
    );
    docChunks.forEach((c) => {
      c.metadata.total_chunks = docChunks.length;
    });
  }

  return chunks;
}

/**
 * Generate embedding using Google Gemini
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

/**
 * Sleep helper for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Run the processor
processDocuments();
