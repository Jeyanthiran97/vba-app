import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, getStatusColor } from "@/lib/utils";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import type { Event } from "@/lib/types";

export const metadata: Metadata = { title: "Events" };
export const revalidate = 60;

export default async function EventsPage() {
  const supabase = createClient();
  const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
  const events = (data || []) as Event[];

  const upcoming = events.filter(e => e.status === "upcoming" || e.status === "ongoing");
  const past = events.filter(e => e.status === "completed" || e.status === "cancelled");

  const EventCard = ({ event }: { event: Event }) => (
    <Link href={`/events/${event.id}`} className="card group p-5 flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className={`badge text-xs ${getStatusColor(event.status)} capitalize`}>{event.status}</span>
        <span className="badge bg-gray-100 text-gray-600 text-xs capitalize">{event.level}</span>
      </div>
      <h3 className="font-bold text-gray-900 mb-3 group-hover:text-[#0B2545] transition-colors line-clamp-2 flex-1">{event.title}</h3>
      <div className="space-y-1.5 text-sm text-gray-500">
        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#C8952A]" />{formatDate(event.event_date)}</div>
        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#C8952A]" />{event.venue_name}</div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400 capitalize">{event.category.replace("_", " ")}</span>
        <span className="text-xs text-[#0B2545] font-semibold flex items-center gap-1">Details <ArrowRight className="w-3 h-3" /></span>
      </div>
    </Link>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="section-title">Events</h1>
      <p className="section-subtitle">Boxing tournaments, camps, and trials in Vavuniya district</p>

      {upcoming.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-[#0B2545] mb-5 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Upcoming & Ongoing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-600 mb-5">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {past.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <div className="text-center py-24 text-gray-400">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-semibold mb-2">No events yet</h3>
          <p>Events will appear here once they are added.</p>
        </div>
      )}
    </div>
  );
}
