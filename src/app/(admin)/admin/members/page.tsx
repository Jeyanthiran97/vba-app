"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getStatusColor, formatDate, WEIGHT_CLASSES } from "@/lib/utils";
import { Users, Plus, Search, Edit, Trash2, UserCheck } from "lucide-react";
import type { Member } from "@/lib/types";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState({ full_name: "", nic: "", date_of_birth: "", gender: "male", weight_class_kg: "", age_category: "senior", club: "", coach_name: "", phone: "", status: "active" });
  const supabase = createClient();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("members").select("*").order("full_name");
    setMembers((data || []) as Member[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (editing) {
      await supabase.from("members").update(form).eq("id", editing.id);
    } else {
      const year = new Date().getFullYear();
      const count = members.length + 1;
      const registration_no = `VBA-${year}-${String(count).padStart(3, "0")}`;
      await supabase.from("members").insert([{ ...form, registration_no }]);
    }
    setShowForm(false); setEditing(null);
    setForm({ full_name: "", nic: "", date_of_birth: "", gender: "male", weight_class_kg: "", age_category: "senior", club: "", coach_name: "", phone: "", status: "active" });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deactivate this member?")) return;
    await supabase.from("members").update({ status: "inactive" }).eq("id", id);
    load();
  };

  const filtered = members.filter(m => m.full_name.toLowerCase().includes(search.toLowerCase()) || m.registration_no.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2545]">Members</h1>
          <p className="text-gray-500 text-sm mt-1">{members.filter(m => m.status === "active").length} active athletes</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" placeholder="Search by name or registration number..." />
      </div>

      {/* Table */}
      <div className="admin-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                {["Reg No", "Name", "Gender", "Weight Class", "Club", "Status", "Actions"].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No members found
                </td></tr>
              ) : filtered.map((m, i) => (
                <tr key={m.id} className={`${i % 2 === 0 ? "" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}>
                  <td className="table-cell font-mono text-xs text-[#0B2545] font-bold">{m.registration_no}</td>
                  <td className="table-cell font-semibold">{m.full_name}</td>
                  <td className="table-cell capitalize">{m.gender}</td>
                  <td className="table-cell">{m.weight_class_kg}kg</td>
                  <td className="table-cell text-gray-500">{m.club || "—"}</td>
                  <td className="table-cell">
                    <span className={`badge text-xs capitalize ${getStatusColor(m.status)}`}>{m.status}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditing(m); setForm({ full_name: m.full_name, nic: m.nic, date_of_birth: m.date_of_birth, gender: m.gender, weight_class_kg: String(m.weight_class_kg), age_category: m.age_category, club: m.club || "", coach_name: m.coach_name || "", phone: m.phone || "", status: m.status }); setShowForm(true); }} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-[#0B2545] mb-5">{editing ? "Edit Member" : "Add New Member"}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="label">Full Name *</label><input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="input" placeholder="Full legal name" /></div>
                <div><label className="label">NIC *</label><input value={form.nic} onChange={e => setForm({ ...form, nic: e.target.value })} className="input" placeholder="NIC number" /></div>
                <div><label className="label">Date of Birth *</label><input type="date" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} className="input" /></div>
                <div>
                  <label className="label">Gender *</label>
                  <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="input">
                    <option value="male">Male</option><option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="label">Weight Class (kg) *</label>
                  <select value={form.weight_class_kg} onChange={e => setForm({ ...form, weight_class_kg: e.target.value })} className="input">
                    <option value="">Select...</option>
                    {WEIGHT_CLASSES.map(w => <option key={w} value={w.replace("kg", "")}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Age Category</label>
                  <select value={form.age_category} onChange={e => setForm({ ...form, age_category: e.target.value })} className="input">
                    <option value="youth">Youth</option><option value="junior">Junior</option><option value="senior">Senior</option><option value="master">Master</option>
                  </select>
                </div>
                <div><label className="label">Club</label><input value={form.club} onChange={e => setForm({ ...form, club: e.target.value })} className="input" placeholder="Club name" /></div>
                <div><label className="label">Coach Name</label><input value={form.coach_name} onChange={e => setForm({ ...form, coach_name: e.target.value })} className="input" placeholder="Coach's name" /></div>
                <div className="col-span-2"><label className="label">Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input" placeholder="+94 XX XXX XXXX" /></div>
                <div>
                  <label className="label">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input">
                    <option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handleSave} className="flex-1 btn-primary">Save Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
