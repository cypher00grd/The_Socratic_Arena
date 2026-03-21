-- Create private_arenas table for invite-based debate rooms
CREATE TABLE IF NOT EXISTS private_arenas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  arena_code text UNIQUE NOT NULL,
  topic_id uuid,
  topic_title text NOT NULL,
  creator_id uuid NOT NULL,
  joiner_id uuid,
  creator_stance text,
  joiner_stance text,
  status text NOT NULL DEFAULT 'waiting',
  match_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Index for fast code lookups
CREATE INDEX IF NOT EXISTS idx_private_arenas_code ON private_arenas (arena_code);

-- Index for cleanup of expired arenas
CREATE INDEX IF NOT EXISTS idx_private_arenas_status_created ON private_arenas (status, created_at);

-- Disable RLS for simplicity (backend uses service key)
ALTER TABLE private_arenas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for service role" ON private_arenas FOR ALL USING (true) WITH CHECK (true);
