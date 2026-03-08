"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2 } from "lucide-react";
import type { Sponsor } from "@/lib/types";

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", logo_url: "", website: "", tier: "partner", is_active: true });
  const supabase = createClient();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("sponsors").select("*").order("tier").order("sort_order");
    setSponsors((data || []) as Sponsor[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    await supabase.from("sponsors").insert([form]);
    setShowForm(false);
    setForm({ name: "", logo_url: "", website: "", tier: "partner", is_active: true });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this sponsor?")) return;
    await supabase.from("sponsors").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0B2545]">Sponsors</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm px-4 py-2"><Plus className="w-4 h-4" /> Add Sponsor</button>
      </div>
      <div className="space-y-3">
        {loading ? <p className="text-center py-12 text-gray-400">Loading...</p>
          : sponsors.map(s => (
            <div key={s.id} className="admin-card flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {s.logo_url ? <img src={s.logo_url} alt={s.name} className="w-full h-full object-contain" /> : <span className="text-xs text-gray-400">No logo</span>}
                </div>
                <div>
                  <div className="font-bold text-[#0B2545]">{s.name}</div>
                  <div className="text-sm text-gray-500 capitalize">{s.tier} sponsor</div>
                </div>
              </div>
              <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-[#0B2545] mb-5">Add Sponsor</h2>
            <div className="space-y-4">
              <div><label className="label">Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" placeholder="Organisation name" /></div>
              <div><label className="label">Logo URL *</label><input value={form.logo_url} onChange={e => setForm({ ...form, logo_url: e.target.value })} className="input" placeholder="https://..." /></div>
              <div><label className="label">Website</label><input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="input" placeholder="https://..." /></div>
              <div>
                <label className="label">Tier</label>
                <select value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })} className="input">
                  <option value="gold">Gold</option><option value="silver">Silver</option><option value="bronze">Bronze</option><option value="partner">Partner</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handleSave} className="flex-1 btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
