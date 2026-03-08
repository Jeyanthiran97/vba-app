import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, getMedalEmoji } from "@/lib/utils";
import { Trophy, Calendar, Users, Medal, ArrowRight, MapPin } from "lucide-react";
import type { NewsArticle, Event, Achievement } from "@/lib/types";

async function getHomeData() {
  const supabase = createClient();
  const [newsRes, eventsRes, achievementsRes, membersRes] = await Promise.all([
    supabase.from("news").select("*").eq("status", "published").order("published_at", { ascending: false }).limit(3),
    supabase.from("events").select("*").in("status", ["upcoming", "ongoing"]).order("event_date").limit(3),
    supabase.from("achievements").select("*").order("year", { ascending: false }).limit(4),
    supabase.from("members").select("id", { count: "exact" }).eq("status", "active"),
  ]);
  return {
    news: (newsRes.data || []) as NewsArticle[],
    events: (eventsRes.data || []) as Event[],
    achievements: (achievementsRes.data || []) as Achievement[],
    memberCount: membersRes.count || 0,
  };
}

export default async function HomePage() {
  const { news, events, achievements, memberCount } = await getHomeData();

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center hero-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/hero-bg.jpg')] bg-cover bg-center" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
          <div className="w-full h-full bg-[url('/boxing-silhouette.png')] bg-no-repeat bg-right bg-contain" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 text-white">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="w-2 h-2 bg-[#C8952A] rounded-full animate-pulse" />
              Vavuniya District · Northern Province · Sri Lanka
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
              Vavuniya<br />
              <span className="text-[#C8952A]">Boxing</span><br />
              Association
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Nurturing champions from the Northern Province. Building discipline, strength, and national pride in every bout.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/events" className="btn-primary flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Upcoming Events
              </Link>
              <Link href="/achievements" className="btn-outline-white flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Our Achievements
              </Link>
            </div>
          </div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="fill-white">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: memberCount || "50+", label: "Registered Athletes", icon: Users, color: "text-[#0B2545]" },
              { value: achievements.length > 0 ? `${achievements.length}+` : "20+", label: "International Medals", icon: Medal, color: "text-[#C8952A]" },
              { value: events.length > 0 ? events.length : "5+", label: "Upcoming Events", icon: Calendar, color: "text-blue-600" },
              { value: "2013", label: "Est. by BASL", icon: Trophy, color: "text-green-600" },
            ].map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="stat-card">
                <Icon className={`w-8 h-8 ${color} mx-auto mb-2`} />
                <div className={`text-3xl font-black ${color} mb-1`}>{value}</div>
                <div className="text-xs text-gray-500 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest News ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="section-title">Latest News</h2>
              <p className="section-subtitle">Stay updated with VBA announcements</p>
            </div>
            <Link href="/news" className="hidden sm:flex items-center gap-1 text-[#0B2545] font-semibold text-sm hover:text-[#C8952A] transition-colors">
              All News <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {news.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No news published yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="card group">
                  <div className="h-48 bg-gradient-to-br from-[#0B2545] to-[#1A4A8A] flex items-center justify-center overflow-hidden">
                    {article.cover_image ? (
                      <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <Trophy className="w-12 h-12 text-white/30" />
                    )}
                  </div>
                  <div className="p-5">
                    <span className="badge bg-[#E8EFF8] text-[#0B2545] text-xs mb-3">{article.category}</span>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#0B2545] transition-colors">{article.title}</h3>
                    {article.excerpt && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>}
                    <p className="text-xs text-gray-400">{formatDate(article.published_at || article.created_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-6 sm:hidden">
            <Link href="/news" className="btn-secondary inline-flex items-center gap-2">
              View All News <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="section-title">Upcoming Events</h2>
              <p className="section-subtitle">Don&apos;t miss these boxing tournaments</p>
            </div>
            <Link href="/events" className="hidden sm:flex items-center gap-1 text-[#0B2545] font-semibold text-sm hover:text-[#C8952A] transition-colors">
              All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {events.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No upcoming events. Follow us to stay informed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`} className="card group p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`badge text-xs ${event.status === "ongoing" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                      {event.status === "ongoing" ? "🔴 LIVE" : "Upcoming"}
                    </span>
                    <span className="badge bg-gray-100 text-gray-600 text-xs capitalize">{event.level}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 group-hover:text-[#0B2545] transition-colors line-clamp-2">{event.title}</h3>
                  <div className="space-y-1.5 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#C8952A]" />
                      {formatDate(event.event_date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C8952A]" />
                      {event.venue_name}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 capitalize">{event.category.replace("_", " ")}</span>
                    <span className="text-xs text-[#0B2545] font-semibold flex items-center gap-1">
                      View Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Recent Achievements ── */}
      {achievements.length > 0 && (
        <section className="py-16 bg-[#0B2545] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">International Achievements</h2>
                <p className="text-gray-400 text-lg">VBA athletes on the world stage</p>
              </div>
              <Link href="/achievements" className="hidden sm:flex items-center gap-1 text-[#C8952A] font-semibold text-sm hover:text-gold-light transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((a) => (
                <div key={a.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 hover:bg-white/20 transition-colors">
                  <div className="text-4xl mb-3">{getMedalEmoji(a.medal)}</div>
                  <div className="font-bold text-white mb-1">{a.athlete_name}</div>
                  <div className="text-sm text-gray-400 mb-2">{a.weight_class} · {a.gender}</div>
                  <div className="text-sm text-[#C8952A] font-medium">{a.event_name}</div>
                  <div className="text-xs text-gray-500 mt-1">{a.event_location} · {a.year}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-16 bg-gradient-to-r from-[#C8952A] to-[#F5C842]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Join Vavuniya Boxing Association</h2>
          <p className="text-white/90 text-lg mb-8">
            Are you a boxer or club in Vavuniya District? Register with us and compete at district, provincial, and national level.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-[#0B2545] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#1A4A8A] transition-colors shadow-lg">
            Get In Touch <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
