-- =====================================================
-- PGVECTOR EMBEDDINGS MIGRATION
-- Enable vector search for RAG chatbot
-- =====================================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Document embeddings table for RAG
CREATE TABLE IF NOT EXISTS document_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding vector(768), -- Gemini text-embedding-004 dimension
  metadata JSONB DEFAULT '{}',
  source_file VARCHAR(255),
  chunk_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast similarity search
CREATE INDEX IF NOT EXISTS document_embeddings_embedding_idx
ON document_embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Index on source file for filtering
CREATE INDEX IF NOT EXISTS document_embeddings_source_idx
ON document_embeddings(source_file);

-- RPC function for similarity search
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  source_file VARCHAR(255),
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    de.id,
    de.content,
    de.metadata,
    de.source_file,
    1 - (de.embedding <=> query_embedding) as similarity
  FROM document_embeddings de
  WHERE 1 - (de.embedding <=> query_embedding) > match_threshold
  ORDER BY de.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Function to clear all embeddings (for reprocessing)
CREATE OR REPLACE FUNCTION clear_embeddings()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM document_embeddings;
END;
$$;

-- Update timestamp trigger
CREATE TRIGGER update_document_embeddings_updated_at
BEFORE UPDATE ON document_embeddings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS policies
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for document processing)
CREATE POLICY "Service role can manage embeddings" ON document_embeddings
  FOR ALL USING (true);

-- Allow authenticated users to read embeddings
CREATE POLICY "Authenticated users can read embeddings" ON document_embeddings
  FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- Update chat tables for better tracking
-- =====================================================

-- Add last_message_at to chat_conversations if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_conversations'
    AND column_name = 'last_message_at'
  ) THEN
    ALTER TABLE chat_conversations ADD COLUMN last_message_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Add handoff_requested to chat_conversations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_conversations'
    AND column_name = 'handoff_requested'
  ) THEN
    ALTER TABLE chat_conversations ADD COLUMN handoff_requested BOOLEAN DEFAULT false;
    ALTER TABLE chat_conversations ADD COLUMN handoff_requested_at TIMESTAMPTZ;
  END IF;
END $$;
