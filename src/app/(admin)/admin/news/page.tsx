"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getStatusColor, formatDate, slugify } from "@/lib/utils";
import { Newspaper, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import type { NewsArticle } from "@/lib/types";

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", category: "general", status: "draft" });
  const supabase = createClient();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });
    setArticles((data || []) as NewsArticle[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    const slug = slugify(form.title);
    const published_at = form.status === "published" ? new Date().toISOString() : null;
    if (editing) {
      await supabase.from("news").update({ ...form, slug, published_at }).eq("id", editing.id);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("news").insert([{ ...form, slug, published_at, author_id: user?.id }]);
    }
    setShowForm(false); setEditing(null);
    setForm({ title: "", excerpt: "", content: "", category: "general", status: "draft" });
    load();
  };

  const togglePublish = async (article: NewsArticle) => {
    const newStatus = article.status === "published" ? "draft" : "published";
    const published_at = newStatus === "published" ? new Date().toISOString() : null;
    await supabase.from("news").update({ status: newStatus, published_at }).eq("id", article.id);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    await supabase.from("news").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2545]">News & Articles</h1>
          <p className="text-gray-500 text-sm mt-1">{articles.filter(a => a.status === "published").length} published</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <Plus className="w-4 h-4" /> Write Article
        </button>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>{["Title", "Category", "Status", "Published", "Actions"].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading...</td></tr>
            ) : articles.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">
                <Newspaper className="w-8 h-8 mx-auto mb-2 opacity-30" />No articles yet
              </td></tr>
            ) : articles.map((a, i) => (
              <tr key={a.id} className={`${i % 2 ? "bg-gray-50" : ""} hover:bg-blue-50 transition-colors`}>
                <td className="table-cell font-semibold text-[#0B2545] max-w-xs truncate">{a.title}</td>
                <td className="table-cell capitalize"><span className="badge bg-[#E8EFF8] text-[#0B2545] text-xs">{a.category}</span></td>
                <td className="table-cell"><span className={`badge text-xs capitalize ${getStatusColor(a.status)}`}>{a.status}</span></td>
                <td className="table-cell text-gray-400 text-xs">{a.published_at ? formatDate(a.published_at) : "—"}</td>
                <td className="table-cell">
                  <div className="flex gap-2">
                    <button onClick={() => togglePublish(a)} className={`p-1.5 rounded-lg transition-colors ${a.status === "published" ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                      {a.status === "published" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => { setEditing(a); setForm({ title: a.title, excerpt: a.excerpt || "", content: a.content, category: a.category, status: a.status }); setShowForm(true); }} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-[#0B2545] mb-5">{editing ? "Edit Article" : "New Article"}</h2>
            <div className="space-y-4">
              <div><label className="label">Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input" placeholder="Article headline" /></div>
              <div><label className="label">Excerpt</label><input value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="input" placeholder="Short summary (shown in cards)" /></div>
              <div><label className="label">Content *</label><textarea rows={10} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="input resize-none" placeholder="Article content..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input">
                    <option value="general">General</option><option value="tournament">Tournament</option><option value="achievement">Achievement</option><option value="announcement">Announcement</option>
                  </select>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input">
                    <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handleSave} className="flex-1 btn-primary">Save Article</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
