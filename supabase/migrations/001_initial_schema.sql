-- ============================================================
-- VBA App — Full Database Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── members ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS members (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name        text NOT NULL,
  nic              text NOT NULL UNIQUE,
  date_of_birth    date NOT NULL,
  gender           text NOT NULL CHECK (gender IN ('male', 'female')),
  weight_class_kg  numeric(5,2) NOT NULL,
  age_category     text NOT NULL CHECK (age_category IN ('youth', 'junior', 'senior', 'master')) DEFAULT 'senior',
  club             text,
  coach_name       text,
  phone            text,
  email            text,
  address          text,
  photo_url        text,
  registration_no  text NOT NULL UNIQUE,
  basl_id          text,
  status           text NOT NULL CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ── events ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  slug           text NOT NULL UNIQUE,
  description    text,
  event_date     date NOT NULL,
  end_date       date,
  venue_name     text NOT NULL,
  venue_address  text,
  category       text NOT NULL CHECK (category IN ('tournament','championship','training_camp','selection_trial','friendly','other')) DEFAULT 'tournament',
  level          text NOT NULL CHECK (level IN ('district','provincial','national','international')) DEFAULT 'district',
  status         text NOT NULL CHECK (status IN ('upcoming','ongoing','completed','cancelled')) DEFAULT 'upcoming',
  cover_image    text,
  created_by     uuid REFERENCES auth.users(id),
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ── results ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS results (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id        uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  weight_class    text NOT NULL,
  bout_number     int NOT NULL,
  round           text NOT NULL CHECK (round IN ('preliminary','quarterfinal','semifinal','final')),
  red_member_id   uuid NOT NULL REFERENCES members(id),
  blue_member_id  uuid NOT NULL REFERENCES members(id),
  winner_id       uuid REFERENCES members(id),
  method          text NOT NULL CHECK (method IN ('KO','TKO','PTS','RSC','WO','DQ','NO_CONTEST')),
  red_score       int,
  blue_score      int,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ── rankings ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rankings (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id      uuid NOT NULL REFERENCES members(id),
  weight_class   text NOT NULL,
  gender         text NOT NULL CHECK (gender IN ('male', 'female')),
  rank_position  int NOT NULL,
  points         int NOT NULL DEFAULT 0,
  wins           int NOT NULL DEFAULT 0,
  losses         int NOT NULL DEFAULT 0,
  bouts          int NOT NULL DEFAULT 0,
  last_updated   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(member_id, weight_class, gender)
);

-- ── news ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  slug         text NOT NULL UNIQUE,
  excerpt      text,
  content      text NOT NULL DEFAULT '',
  cover_image  text,
  category     text NOT NULL CHECK (category IN ('tournament','achievement','general','announcement')) DEFAULT 'general',
  status       text NOT NULL CHECK (status IN ('draft','published','archived')) DEFAULT 'draft',
  published_at timestamptz,
  author_id    uuid REFERENCES auth.users(id),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- ── achievements ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS achievements (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year            int NOT NULL,
  member_id       uuid REFERENCES members(id),
  athlete_name    text NOT NULL,
  weight_class    text NOT NULL,
  gender          text NOT NULL CHECK (gender IN ('male', 'female')),
  event_name      text NOT NULL,
  event_location  text NOT NULL,
  medal           text NOT NULL CHECK (medal IN ('gold','silver','bronze','4th','participated')),
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ── gallery_albums ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_albums (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       uuid REFERENCES events(id) ON DELETE SET NULL,
  title          text NOT NULL,
  cover_photo_id uuid,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ── gallery_photos ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_photos (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id      uuid NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
  storage_path  text NOT NULL,
  public_url    text NOT NULL,
  caption       text,
  sort_order    int NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Add FK for cover_photo_id after gallery_photos is created
ALTER TABLE gallery_albums
  ADD CONSTRAINT fk_cover_photo FOREIGN KEY (cover_photo_id) REFERENCES gallery_photos(id) ON DELETE SET NULL;

-- ── sponsors ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sponsors (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  logo_url    text NOT NULL,
  website     text,
  tier        text NOT NULL CHECK (tier IN ('gold','silver','bronze','partner')) DEFAULT 'partner',
  sort_order  int NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── contact_submissions ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text NOT NULL,
  subject    text NOT NULL,
  message    text NOT NULL,
  is_read    boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── Indexes ────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_results_event ON results(event_id);
CREATE INDEX IF NOT EXISTS idx_rankings_class_gender ON rankings(weight_class, gender);
CREATE INDEX IF NOT EXISTS idx_achievements_year ON achievements(year DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_read ON contact_submissions(is_read);

-- ── updated_at trigger ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ─────────────────────────────────────────
ALTER TABLE members             ENABLE ROW LEVEL SECURITY;
ALTER TABLE events              ENABLE ROW LEVEL SECURITY;
ALTER TABLE results             ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings            ENABLE ROW LEVEL SECURITY;
ALTER TABLE news                ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements        ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums      ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors            ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read members" ON members FOR SELECT USING (status = 'active');
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read results" ON results FOR SELECT USING (true);
CREATE POLICY "Public read rankings" ON rankings FOR SELECT USING (true);
CREATE POLICY "Public read published news" ON news FOR SELECT USING (status = 'published');
CREATE POLICY "Public read achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public read gallery albums" ON gallery_albums FOR SELECT USING (true);
CREATE POLICY "Public read gallery photos" ON gallery_photos FOR SELECT USING (true);
CREATE POLICY "Public read active sponsors" ON sponsors FOR SELECT USING (is_active = true);

-- Public insert for contact form
CREATE POLICY "Public insert contact" ON contact_submissions FOR INSERT WITH CHECK (true);

-- Authenticated (admin) full access
CREATE POLICY "Admin all members" ON members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all results" ON results FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all rankings" ON rankings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all news" ON news FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all achievements" ON achievements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all gallery albums" ON gallery_albums FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all gallery photos" ON gallery_photos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all sponsors" ON sponsors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all contacts" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');

-- ── Sample seed data ───────────────────────────────────────────
INSERT INTO achievements (year, athlete_name, weight_class, gender, event_name, event_location, medal) VALUES
  (2023, 'K. Rajendran', '60kg', 'male', 'South Asian Games 2023', 'Bhagalpur, India', 'bronze'),
  (2022, 'S. Kumari', '52kg', 'female', 'ASBC Asian Junior Championships', 'Dubai, UAE', 'silver'),
  (2022, 'A. Thileepan', '75kg', 'male', 'ASBC Asian U22 Boxing', 'Tashkent, Uzbekistan', 'bronze'),
  (2019, 'V. Pratheepan', '81kg', 'male', '13th South Asian Games', 'Kathmandu, Nepal', 'gold')
ON CONFLICT DO NOTHING;

-- ── Done! ──────────────────────────────────────────────────────
-- Next steps:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Create your first admin user with email + password
-- 3. That user will have full access via the authenticated role policies above
