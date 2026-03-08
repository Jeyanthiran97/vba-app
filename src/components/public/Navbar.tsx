"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/achievements", label: "Achievements" },
  { href: "/rankings", label: "Rankings" },
  { href: "/gallery", label: "Gallery" },
  { href: "/members", label: "Members" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
      scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white shadow-sm"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-[#0B2545] rounded-lg flex items-center justify-center group-hover:bg-[#1A4A8A] transition-colors">
              <Trophy className="w-5 h-5 text-[#C8952A]" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-[#0B2545] leading-tight">Vavuniya Boxing</div>
              <div className="text-xs text-gray-500 leading-tight">Association</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === href
                    ? "text-[#0B2545] bg-navy-50 font-semibold"
                    : "text-gray-600 hover:text-[#0B2545] hover:bg-gray-50"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Admin link + Mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="hidden sm:inline-flex text-xs bg-[#0B2545] text-white px-3 py-1.5 rounded-lg hover:bg-[#1A4A8A] transition-colors font-medium"
            >
              Admin
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-[#0B2545] hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-navy-100 text-[#0B2545] font-semibold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#0B2545]"
                )}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/admin/dashboard"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium bg-[#0B2545] text-white mt-2"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
