import { createClient } from "@/lib/supabase/server";
import { Users, Calendar, Newspaper, MessageSquare, Trophy, Medal } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard | VBA" };

export default async function DashboardPage() {
  const supabase = createClient();
  const [members, events, news, contacts, achievements] = await Promise.all([
    supabase.from("members").select("id", { count: "exact" }).eq("status", "active"),
    supabase.from("events").select("id", { count: "exact" }).in("status", ["upcoming", "ongoing"]),
    supabase.from("news").select("id", { count: "exact" }).eq("status", "published"),
    supabase.from("contact_submissions").select("id", { count: "exact" }).eq("is_read", false),
    supabase.from("achievements").select("id", { count: "exact" }),
  ]);

  const stats = [
    { label: "Active Members", value: members.count ?? 0, icon: Users, color: "bg-blue-50 text-blue-700", href: "/admin/members" },
    { label: "Upcoming Events", value: events.count ?? 0, icon: Calendar, color: "bg-green-50 text-green-700", href: "/admin/events" },
    { label: "Published Articles", value: news.count ?? 0, icon: Newspaper, color: "bg-purple-50 text-purple-700", href: "/admin/news" },
    { label: "Unread Enquiries", value: contacts.count ?? 0, icon: MessageSquare, color: "bg-red-50 text-red-700", href: "/admin/contacts" },
    { label: "Achievements", value: achievements.count ?? 0, icon: Medal, color: "bg-yellow-50 text-yellow-700", href: "/admin/achievements" },
  ];

  const quickActions = [
    { label: "Add Member", href: "/admin/members/new", icon: Users },
    { label: "Create Event", href: "/admin/events/new", icon: Calendar },
    { label: "Write Article", href: "/admin/news/new", icon: Newspaper },
    { label: "Add Achievement", href: "/admin/achievements", icon: Trophy },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0B2545]">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to the VBA Admin Panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="admin-card hover:shadow-md transition-shadow cursor-pointer">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-card mb-8">
        <h2 className="font-bold text-[#0B2545] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-[#E8EFF8] hover:text-[#0B2545] transition-colors text-center"
            >
              <div className="w-10 h-10 bg-[#0B2545] rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Guide */}
      <div className="admin-card bg-gradient-to-r from-[#0B2545] to-[#1A4A8A] text-white">
        <h2 className="font-bold mb-2">Getting Started</h2>
        <p className="text-gray-300 text-sm mb-4">Set up your association data to populate the public website.</p>
        <ol className="space-y-2 text-sm text-gray-300">
          {["Add your registered athletes in Members", "Create upcoming events in Events", "Enter past competition Results to generate Rankings", "Add news articles to publish on the site", "Upload event photos in Gallery"].map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#C8952A] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
