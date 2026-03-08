import { createClient } from "@/lib/supabase/server";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import type { Sponsor } from "@/lib/types";

export const metadata: Metadata = { title: "Sponsors & Partners" };
export const revalidate = 3600;

export default async function SponsorsPage() {
  const supabase = createClient();
  const { data } = await supabase.from("sponsors").select("*").eq("is_active", true).order("tier").order("sort_order");
  const sponsors = (data || []) as Sponsor[];
  const tiers = ["gold", "silver", "bronze", "partner"] as const;
  const tierLabels = { gold: "🥇 Gold Sponsors", silver: "🥈 Silver Sponsors", bronze: "🥉 Bronze Partners", partner: "Community Partners" };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="section-title">Sponsors & Partners</h1>
      <p className="section-subtitle">Organizations supporting boxing in Vavuniya District</p>
      {tiers.map(tier => {
        const tierSponsors = sponsors.filter(s => s.tier === tier);
        if (!tierSponsors.length) return null;
        return (
          <section key={tier} className="mb-12">
            <h2 className="text-xl font-bold text-[#0B2545] mb-6">{tierLabels[tier]}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tierSponsors.map(s => (
                <div key={s.id} className="card p-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 flex items-center justify-center mb-4">
                    <img src={s.logo_url} alt={s.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="font-bold text-gray-900 mb-2">{s.name}</div>
                  {s.website && (
                    <a href={s.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#0B2545] hover:text-[#C8952A] transition-colors">
                      Visit website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}
      {sponsors.length === 0 && (
        <div className="text-center py-24 text-gray-400">
          <p>Sponsor information will appear here once added.</p>
        </div>
      )}
    </div>
  );
}
