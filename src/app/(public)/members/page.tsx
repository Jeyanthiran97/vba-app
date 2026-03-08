import { createClient } from "@/lib/supabase/server";
import { Users, UserCircle } from "lucide-react";
import type { Metadata } from "next";
import type { Member } from "@/lib/types";

export const metadata: Metadata = { title: "Member Directory" };

export default async function MembersPage() {
  const supabase = createClient();
  const { data } = await supabase.from("members").select("id, full_name, weight_class_kg, gender, age_category, club, registration_no").eq("status", "active").order("full_name");
  const members = (data || []) as Partial<Member>[];

  const male = members.filter(m => m.gender === "male");
  const female = members.filter(m => m.gender === "female");

  const Section = ({ title, data }: { title: string; data: Partial<Member>[] }) => (
    <div>
      <h2 className="text-xl font-bold text-[#0B2545] mb-4">{title} ({data.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map(m => (
          <div key={m.id} className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center flex-shrink-0">
              <UserCircle className="w-6 h-6 text-[#0B2545]" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 text-sm truncate">{m.full_name}</div>
              <div className="text-xs text-gray-500">{m.weight_class_kg}kg · {m.age_category}</div>
              {m.club && <div className="text-xs text-[#C8952A] truncate">{m.club}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="section-title">Member Directory</h1>
      <p className="section-subtitle">{members.length} registered athletes in Vavuniya District</p>
      {members.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>No members registered yet.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {male.length > 0 && <Section title="Male Athletes" data={male} />}
          {female.length > 0 && <Section title="Female Athletes" data={female} />}
        </div>
      )}
    </div>
  );
}
