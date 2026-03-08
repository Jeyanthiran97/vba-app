"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getStatusColor, formatDate, slugify, EVENT_CATEGORIES, EVENT_LEVELS } from "@/lib/utils";
import { Calendar, Plus, Edit, Trash2 } from "lucide-react";
import type { Event } from "@/lib/types";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState({ title: "", description: "", event_date: "", end_date: "", venue_name: "", venue_address: "", category: "tournament", level: "district", status: "upcoming" });
  const supabase = createClient();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
    setEvents((data || []) as Event[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    const slug = slugify(form.title + "-" + form.event_date);
    if (editing) {
      await supabase.from("events").update({ ...form, slug }).eq("id", editing.id);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("events").insert([{ ...form, slug, created_by: user?.id }]);
    }
    setShowForm(false); setEditing(null);
    setForm({ title: "", description: "", event_date: "", end_date: "", venue_name: "", venue_address: "", category: "tournament", level: "district", status: "upcoming" });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await supabase.from("events").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2545]">Events</h1>
          <p className="text-gray-500 text-sm mt-1">{events.filter(e => e.status === "upcoming").length} upcoming</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr>{["Title", "Date", "Venue", "Category", "Level", "Status", "Actions"].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="text-center py-12 text-gray-400">Loading...</td></tr>
              : events.length === 0 ? <tr><td colSpan={7} className="text-center py-12 text-gray-400"><Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />No events yet</td></tr>
              : events.map((ev, i) => (
                <tr key={ev.id} className={`${i % 2 ? "bg-gray-50" : ""} hover:bg-blue-50 transition-colors`}>
                  <td className="table-cell font-semibold text-[#0B2545] max-w-xs truncate">{ev.title}</td>
                  <td className="table-cell text-sm">{formatDate(ev.event_date)}</td>
                  <td className="table-cell text-gray-500 text-sm">{ev.venue_name}</td>
                  <td className="table-cell capitalize text-xs">{ev.category.replace("_", " ")}</td>
                  <td className="table-cell capitalize text-xs">{ev.level}</td>
                  <td className="table-cell"><span className={`badge text-xs capitalize ${getStatusColor(ev.status)}`}>{ev.status}</span></td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(ev); setForm({ title: ev.title, description: ev.description || "", event_date: ev.event_date, end_date: ev.end_date || "", venue_name: ev.venue_name, venue_address: ev.venue_address || "", category: ev.category, level: ev.level, status: ev.status }); setShowForm(true); }} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(ev.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-[#0B2545] mb-5">{editing ? "Edit Event" : "Create Event"}</h2>
            <div className="space-y-4">
              <div><label className="label">Event Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input" placeholder="Event name" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Start Date *</label><input type="date" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} className="input" /></div>
                <div><label className="label">End Date</label><input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className="input" /></div>
              </div>
              <div><label className="label">Venue Name *</label><input value={form.venue_name} onChange={e => setForm({ ...form, venue_name: e.target.value })} className="input" placeholder="Venue / hall name" /></div>
              <div><label className="label">Venue Address</label><input value={form.venue_address} onChange={e => setForm({ ...form, venue_address: e.target.value })} className="input" placeholder="Full address" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input">
                    {EVENT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Level</label>
                  <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="input">
                    {EVENT_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input">
                  <option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div><label className="label">Description</label><textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input resize-none" placeholder="Event details..." /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handleSave} className="flex-1 btn-primary">Save Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
