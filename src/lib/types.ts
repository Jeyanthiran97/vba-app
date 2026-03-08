export type Member = {
  id: string;
  full_name: string;
  nic: string;
  date_of_birth: string;
  gender: "male" | "female";
  weight_class_kg: number;
  age_category: "youth" | "junior" | "senior" | "master";
  club: string | null;
  coach_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  photo_url: string | null;
  registration_no: string;
  basl_id: string | null;
  status: "active" | "inactive" | "suspended";
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  venue_name: string;
  venue_address: string | null;
  category: "tournament" | "championship" | "training_camp" | "selection_trial" | "friendly" | "other";
  level: "district" | "provincial" | "national" | "international";
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  cover_image: string | null;
  created_by: string;
  created_at: string;
};

export type Result = {
  id: string;
  event_id: string;
  weight_class: string;
  bout_number: number;
  round: "preliminary" | "quarterfinal" | "semifinal" | "final";
  red_member_id: string;
  blue_member_id: string;
  winner_id: string | null;
  method: "KO" | "TKO" | "PTS" | "RSC" | "WO" | "DQ" | "NO_CONTEST";
  red_score: number | null;
  blue_score: number | null;
  notes: string | null;
  created_at: string;
  red_member?: Member;
  blue_member?: Member;
  winner?: Member;
};

export type Ranking = {
  id: string;
  member_id: string;
  weight_class: string;
  gender: "male" | "female";
  rank_position: number;
  points: number;
  wins: number;
  losses: number;
  bouts: number;
  last_updated: string;
  member?: Member;
};

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: "tournament" | "achievement" | "general" | "announcement";
  status: "draft" | "published" | "archived";
  published_at: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
};

export type Achievement = {
  id: string;
  year: number;
  member_id: string | null;
  athlete_name: string;
  weight_class: string;
  gender: "male" | "female";
  event_name: string;
  event_location: string;
  medal: "gold" | "silver" | "bronze" | "4th" | "participated";
  notes: string | null;
  created_at: string;
};

export type GalleryAlbum = {
  id: string;
  event_id: string | null;
  title: string;
  cover_photo_id: string | null;
  created_at: string;
  photos?: GalleryPhoto[];
};

export type GalleryPhoto = {
  id: string;
  album_id: string;
  storage_path: string;
  public_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};

export type Sponsor = {
  id: string;
  name: string;
  logo_url: string;
  website: string | null;
  tier: "gold" | "silver" | "bronze" | "partner";
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};
