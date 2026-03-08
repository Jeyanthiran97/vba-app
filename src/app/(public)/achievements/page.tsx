import { createClient } from "@/lib/supabase/server";
import { getMedalEmoji, getMedalColor } from "@/lib/utils";
import type { Metadata } from "next";
import type { Achievement } from "@/lib/types";

export const metadata: Metadata = { title: "International Achievements" };
export const revalidate = 3600;

export default async function AchievementsPage() {
  const supabase = createClient();
  const { data } = await supabase.from("achievements").select("*").order("year", { ascending: false });
  const achievements = (data || []) as Achievement[];

  const byYear = achievements.reduce((acc, a) => {
    if (!acc[a.year]) acc[a.year] = [];
    acc[a.year].push(a);
    return acc;
  }, {} as Record<number, Achievement[]>);

  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);
  const goldCount = achievements.filter(a => a.medal === "gold").length;
  const silverCount = achievements.filter(a => a.medal === "silver").length;
  const bronzeCount = achievements.filter(a => a.medal === "bronze").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="section-title">International Achievements</h1>
      <p className="section-subtitle">VBA athletes representing Sri Lanka on the world stage</p>

      {/* Medal tally */}
      <div className="grid grid-cols-3 gap-4 mb-12 max-w-lg">
        {[
          { label: "Gold", count: goldCount, emoji: "🥇", color: "border-yellow-400 bg-yellow-50" },
          { label: "Silver", count: silverCount, emoji: "🥈", color: "border-gray-400 bg-gray-50" },
          { label: "Bronze", count: bronzeCount, emoji: "🥉", color: "border-amber-600 bg-amber-50" },
        ].map(({ label, count, emoji, color }) => (
          <div key={label} className={`text-center p-4 rounded-xl border-2 ${color}`}>
            <div className="text-3xl mb-1">{emoji}</div>
            <div className="text-2xl font-black text-gray-900">{count}</div>
            <div className="text-sm text-gray-600">{label}</div>
          </div>
        ))}
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="text-6xl mb-4">🏅</div>
          <h3 className="text-xl font-semibold mb-2">No achievements recorded yet</h3>
          <p>Check back once results are entered.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {years.map(year => (
            <section key={year}>
              <h2 className="text-2xl font-bold text-[#0B2545] mb-4 pb-2 border-b-2 border-[#C8952A] w-fit">{year}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {byYear[year].map(a => (
                  <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${getMedalColor(a.medal)}`}>
                      {getMedalEmoji(a.medal)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-gray-900 truncate">{a.athlete_name}</div>
                      <div className="text-sm text-gray-500">{a.weight_class} · {a.gender}</div>
                      <div className="text-sm text-[#0B2545] font-medium mt-1">{a.event_name}</div>
                      <div className="text-xs text-gray-400">{a.event_location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
