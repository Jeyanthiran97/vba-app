"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getMedalEmoji, WEIGHT_CLASSES } from "@/lib/utils";
import { Medal, Plus, Trash2 } from "lucide-react";
import type { Achievement } from "@/lib/types";

export default function AdminAchievementsPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ year: new Date().getFullYear(), athlete_name: "", weight_class: "", gender: "male", event_name: "", event_location: "", medal: "gold", notes: "" });
  const supabase = createClient();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("achievements").select("*").order("year", { ascending: false });
    setItems((data || []) as Achievement[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    await supabase.from("achievements").insert([form]);
    setShowForm(false);
    setForm({ year: new Date().getFullYear(), athlete_name: "", weight_class: "", gender: "male", event_name: "", event_location: "", medal: "gold", notes: "" });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this achievement?")) return;
    await supabase.from("achievements").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2545]">Achievements</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} total records</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <Plus className="w-4 h-4" /> Add Achievement
        </button>
      </div>

      <div className="space-y-2">
        {loading ? <p className="text-center py-12 text-gray-400">Loading...</p>
          : items.length === 0 ? (
            <div className="text-center py-24 text-gray-400 admin-card">
              <Medal className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No achievements recorded yet</p>
            </div>
          ) : items.map((a, i) => (
            <div key={a.id} className="admin-card flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{getMedalEmoji(a.medal)}</div>
                <div>
                  <div className="font-bold text-[#0B2545]">{a.athlete_name} <span className="text-gray-400 font-normal text-sm">— {a.weight_class} {a.gender}</span></div>
                  <div className="text-sm text-gray-600">{a.event_name} · {a.event_location}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-[#C8952A]">{a.year}</span>
                <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-[#0B2545] mb-5">Add Achievement</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Year *</label><input type="number" value={form.year} onChange={e => setForm({ ...form, year: +e.target.value })} className="input" /></div>
                <div>
                  <label className="label">Medal *</label>
                  <select value={form.medal} onChange={e => setForm({ ...form, medal: e.target.value })} className="input">
                    <option value="gold">🥇 Gold</option><option value="silver">🥈 Silver</option><option value="bronze">🥉 Bronze</option><option value="4th">4th Place</option><option value="participated">Participated</option>
                  </select>
                </div>
              </div>
              <div><label className="label">Athlete Name *</label><input value={form.athlete_name} onChange={e => setForm({ ...form, athlete_name: e.target.value })} className="input" placeholder="Full name" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Weight Class *</label>
                  <select value={form.weight_class} onChange={e => setForm({ ...form, weight_class: e.target.value })} className="input">
                    <option value="">Select...</option>
                    {WEIGHT_CLASSES.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Gender</label>
                  <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="input">
                    <option value="male">Male</option><option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div><label className="label">Event Name *</label><input value={form.event_name} onChange={e => setForm({ ...form, event_name: e.target.value })} className="input" placeholder="Competition / championship name" /></div>
              <div><label className="label">Event Location *</label><input value={form.event_location} onChange={e => setForm({ ...form, event_location: e.target.value })} className="input" placeholder="City, Country" /></div>
              <div><label className="label">Notes</label><input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input" placeholder="Optional notes" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handleSave} className="flex-1 btn-primary">Save Achievement</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
