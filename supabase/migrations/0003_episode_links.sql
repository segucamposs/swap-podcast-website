-- Stores episode-specific platform URLs that the iTunes API can't provide.
-- One row per episode, keyed by the slug used in the site URL (/episodes/[slug]).

CREATE TABLE IF NOT EXISTS episode_links (
  slug        TEXT PRIMARY KEY,
  spotify_url TEXT,
  youtube_url TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Public read — episode links are not sensitive
ALTER TABLE episode_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "episode_links_public_read" ON episode_links
  FOR SELECT USING (true);

-- Only authenticated users (admin) can write
CREATE POLICY "episode_links_auth_write" ON episode_links
  FOR ALL USING (auth.role() = 'authenticated');

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER episode_links_updated_at
  BEFORE UPDATE ON episode_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed known episode links
INSERT INTO episode_links (slug, spotify_url, youtube_url) VALUES
  ('eduardo-martins',  'https://open.spotify.com/episode/0a7mdqRHodzaNNjolXBLrX', 'https://www.youtube.com/watch?v=eShX5CGSoZM'),
  ('ivan-briones',     'https://open.spotify.com/episode/2beHgq6vtulLULQaDCxawN', 'https://www.youtube.com/watch?v=bivuWBlQgYw'),
  ('francis-holway',   'https://open.spotify.com/episode/5tdnj2PcO9bcackZ82h6j0', 'https://www.youtube.com/watch?v=IX_Cs8HairM'),
  ('mauro-dominguez',  'https://open.spotify.com/episode/5HQZjW9fBd2w0zaTGLN7Uw', NULL),
  ('rafa-smith-estrada','https://open.spotify.com/episode/4dAljZkd2yaVXNmGmHEWce', NULL),
  ('bernardo-barcena', 'https://open.spotify.com/episode/4a1uoXvYVU5FOKbULGpJ8t', NULL)
ON CONFLICT (slug) DO UPDATE SET
  spotify_url = EXCLUDED.spotify_url,
  youtube_url = EXCLUDED.youtube_url;
