import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { NewsArticle } from "@/lib/types";

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("news").select("*").eq("slug", params.slug).eq("status", "published").single();
  if (!data) notFound();
  const article = data as NewsArticle;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/news" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0B2545] mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to News
      </Link>
      <div className="mb-4">
        <span className="badge bg-[#E8EFF8] text-[#0B2545] capitalize">{article.category}</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-[#0B2545] mb-4">{article.title}</h1>
      <p className="text-gray-400 text-sm mb-8">{formatDate(article.published_at || article.created_at)}</p>
      {article.cover_image && (
        <img src={article.cover_image} alt={article.title} className="w-full rounded-xl mb-8 object-cover max-h-96" />
      )}
      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
        {article.content}
      </div>
    </div>
  );
}
