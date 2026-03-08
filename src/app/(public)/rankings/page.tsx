import { createClient } from "@/lib/supabase/server";
import { WEIGHT_CLASSES } from "@/lib/utils";
import { Trophy } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Rankings" };

export default async function RankingsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("rankings")
    .select("*, member:members(full_name, club, photo_url)")
    .order("rank_position");
  const rankings = data || [];

  const maleRankings = rankings.filter((r: any) => r.gender === "male");
  const femaleRankings = rankings.filter((r: any) => r.gender === "female");

  const RankingTable = ({ data, gender }: { data: any[]; gender: string }) => {
    const weightClasses = [...new Set(data.map((r: any) => r.weight_class))];
    if (data.length === 0) return (
      <div className="text-center py-12 text-gray-400">
        <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>No {gender} rankings yet.</p>
      </div>
    );
    return (
      <div className="space-y-8">
        {weightClasses.map(wc => {
          const classRankings = data.filter((r: any) => r.weight_class === wc);
          return (
            <div key={wc}>
              <h3 className="font-bold text-[#0B2545] text-lg mb-3">{wc}</h3>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr>
                      <th className="table-header w-12">Rank</th>
                      <th className="table-header">Athlete</th>
                      <th className="table-header text-center">Club</th>
                      <th className="table-header text-center">Points</th>
                      <th className="table-header text-center">W</th>
                      <th className="table-header text-center">L</th>
                      <th className="table-header text-center">Bouts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classRankings.map((r: any) => (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="table-cell text-center font-bold">
                          {r.rank_position === 1 ? "🥇" : r.rank_position === 2 ? "🥈" : r.rank_position === 3 ? "🥉" : r.rank_position}
                        </td>
                        <td className="table-cell font-semibold text-[#0B2545]">{r.member?.full_name || "—"}</td>
                        <td className="table-cell text-center text-gray-500">{r.member?.club || "—"}</td>
                        <td className="table-cell text-center font-bold text-[#C8952A]">{r.points}</td>
                        <td className="table-cell text-center text-green-600">{r.wins}</td>
                        <td className="table-cell text-center text-red-500">{r.losses}</td>
                        <td className="table-cell text-center text-gray-400">{r.bouts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="section-title">District Rankings</h1>
      <p className="section-subtitle">Vavuniya Boxing Association — official standings</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-bold text-[#0B2545] mb-6 flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full" /> Male Rankings
          </h2>
          <RankingTable data={maleRankings} gender="male" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#0B2545] mb-6 flex items-center gap-2">
            <span className="w-3 h-3 bg-pink-500 rounded-full" /> Female Rankings
          </h2>
          <RankingTable data={femaleRankings} gender="female" />
        </div>
      </div>
    </div>
  );
}
