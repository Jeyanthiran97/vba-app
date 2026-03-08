"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { MessageSquare, Mail, CheckCheck } from "lucide-react";
import type { ContactSubmission } from "@/lib/types";

export default function AdminContactsPage() {
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const supabase = createClient();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    setItems((data || []) as ContactSubmission[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await supabase.from("contact_submissions").update({ is_read: true }).eq("id", id);
    load();
  };

  const unread = items.filter(i => !i.is_read).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B2545]">Enquiries</h1>
        <p className="text-gray-500 text-sm mt-1">{unread} unread messages</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card p-0 overflow-hidden">
          {loading ? <p className="text-center py-12 text-gray-400">Loading...</p>
            : items.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No enquiries yet</p>
              </div>
            ) : items.map((item, i) => (
              <button key={item.id} onClick={() => { setSelected(item); if (!item.is_read) markRead(item.id); }}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors flex items-start gap-3 ${selected?.id === item.id ? "bg-blue-50" : i % 2 ? "bg-gray-50" : ""}`}>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.is_read ? "bg-gray-300" : "bg-[#C8952A]"}`} />
                <div className="min-w-0">
                  <div className={`text-sm truncate ${!item.is_read ? "font-bold text-[#0B2545]" : "font-medium text-gray-700"}`}>{item.name}</div>
                  <div className="text-xs text-gray-500 truncate">{item.subject}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{formatDate(item.created_at)}</div>
                </div>
              </button>
            ))}
        </div>

        <div className="admin-card">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#0B2545]">{selected.subject}</h3>
                {!selected.is_read && (
                  <button onClick={() => markRead(selected.id)} className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2.5 py-1.5 rounded-lg hover:bg-green-100">
                    <CheckCheck className="w-3.5 h-3.5" /> Mark Read
                  </button>
                )}
              </div>
              <div className="space-y-2 text-sm mb-6">
                <p><span className="font-medium text-gray-600">From:</span> {selected.name}</p>
                <p><span className="font-medium text-gray-600">Email:</span> <a href={`mailto:${selected.email}`} className="text-[#0B2545] underline">{selected.email}</a></p>
                <p><span className="font-medium text-gray-600">Received:</span> {formatDate(selected.created_at)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.message}</div>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn-primary flex items-center gap-2 mt-4 text-sm">
                <Mail className="w-4 h-4" /> Reply via Email
              </a>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
