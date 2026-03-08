"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  Trophy, Users, Calendar, Newspaper, Image, Medal,
  Star, BarChart2, MessageSquare, Settings, LogOut,
  LayoutDashboard, ChevronRight
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/members",   label: "Members",   icon: Users },
  { href: "/admin/events",    label: "Events",    icon: Calendar },
  { href: "/admin/news",      label: "News",      icon: Newspaper },
  { href: "/admin/results",   label: "Results",   icon: BarChart2 },
  { href: "/admin/rankings",  label: "Rankings",  icon: Star },
  { href: "/admin/gallery",   label: "Gallery",   icon: Image },
  { href: "/admin/achievements", label: "Achievements", icon: Medal },
  { href: "/admin/sponsors",  label: "Sponsors",  icon: Trophy },
  { href: "/admin/contacts",  label: "Enquiries", icon: MessageSquare },
  { href: "/admin/settings",  label: "Settings",  icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-[#0B2545] text-white flex flex-col min-h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#C8952A] rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">VBA Admin</div>
            <div className="text-[10px] text-gray-400 leading-tight">Vavuniya Boxing</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-[#C8952A] text-white shadow-sm"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
              {active && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-all">
          <Trophy className="w-4 h-4" /> View Public Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
