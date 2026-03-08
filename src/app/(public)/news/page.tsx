import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Newspaper, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import type { NewsArticle } from "@/lib/types";

export const metadata: Metadata = { title: "News & Announcements" };
export const revalidate = 120;

export default async function NewsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  const articles = (data || []) as NewsArticle[];
  const categories = ["all", "tournament", "achievement", "general", "announcement"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="section-title">News & Announcements</h1>
        <p className="section-subtitle">Latest updates from Vavuniya Boxing Association</p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Newspaper className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-semibold mb-2">No articles published yet</h3>
          <p>Check back soon for updates.</p>
        </div>
      ) : (
        <>
          {/* Featured */}
          <Link href={`/news/${articles[0].slug}`} className="card group flex flex-col md:flex-row gap-0 mb-8 overflow-hidden">
            <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-[#0B2545] to-[#1A4A8A] flex items-center justify-center overflow-hidden">
              {articles[0].cover_image ? (
                <img src={articles[0].cover_image} alt={articles[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <Newspaper className="w-20 h-20 text-white/20" />
              )}
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <span className="badge bg-[#E8EFF8] text-[#0B2545] w-fit mb-3 capitalize">{articles[0].category}</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#0B2545] transition-colors line-clamp-3">{articles[0].title}</h2>
              {articles[0].excerpt && <p className="text-gray-500 mb-4 line-clamp-3">{articles[0].excerpt}</p>}
              <p className="text-sm text-gray-400 mb-4">{formatDate(articles[0].published_at || articles[0].created_at)}</p>
              <span className="text-[#0B2545] font-semibold flex items-center gap-1 text-sm">Read more <ArrowRight className="w-4 h-4" /></span>
            </div>
          </Link>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(1).map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`} className="card group">
                <div className="h-44 bg-gradient-to-br from-[#0B2545] to-[#1A4A8A] flex items-center justify-center overflow-hidden">
                  {article.cover_image ? (
                    <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <Newspaper className="w-10 h-10 text-white/20" />
                  )}
                </div>
                <div className="p-5">
                  <span className="badge bg-[#E8EFF8] text-[#0B2545] text-xs mb-2 capitalize">{article.category}</span>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#0B2545] transition-colors">{article.title}</h3>
                  {article.excerpt && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>}
                  <p className="text-xs text-gray-400">{formatDate(article.published_at || article.created_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
