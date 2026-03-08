import { createClient } from "@/lib/supabase/server";
import { formatDate, getStatusColor } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Trophy } from "lucide-react";
import type { Event } from "@/lib/types";

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("events").select("*").eq("id", params.id).single();
  if (!data) notFound();
  const event = data as Event;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/events" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0B2545] mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Link>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`badge text-xs capitalize ${getStatusColor(event.status)}`}>{event.status}</span>
        <span className="badge bg-gray-100 text-gray-600 text-xs capitalize">{event.level}</span>
        <span className="badge bg-[#E8EFF8] text-[#0B2545] text-xs capitalize">{event.category.replace("_", " ")}</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-[#0B2545] mb-6">{event.title}</h1>
      <div className="bg-gray-50 rounded-xl p-5 space-y-3 mb-8">
        <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-[#C8952A]" /><span className="font-medium">{formatDate(event.event_date)}{event.end_date && ` – ${formatDate(event.end_date)}`}</span></div>
        <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-[#C8952A]" /><span>{event.venue_name}{event.venue_address && ` — ${event.venue_address}`}</span></div>
      </div>
      {event.description && <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</div>}
      {event.status === "completed" && (
        <div className="mt-8 p-5 bg-[#0B2545] text-white rounded-xl flex items-center gap-3">
          <Trophy className="w-6 h-6 text-[#C8952A]" />
          <div>
            <div className="font-bold">Event Completed</div>
            <div className="text-sm text-gray-400">Results will be published soon.</div>
          </div>
        </div>
      )}
    </div>
  );
}
