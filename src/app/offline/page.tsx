import Link from "next/link";
import { WifiOff, Home, Newspaper, Calendar, Trophy } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-[#0B2545] rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#0B2545] mb-3">You&apos;re Offline</h1>
        <p className="text-gray-500 mb-8">
          No internet connection detected. Some cached pages may still be available.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: "/", label: "Home", Icon: Home },
            { href: "/news", label: "News", Icon: Newspaper },
            { href: "/events", label: "Events", Icon: Calendar },
            { href: "/achievements", label: "Achievements", Icon: Trophy },
          ].map(({ href, label, Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 hover:border-[#0B2545] transition-colors text-sm font-medium text-gray-700">
              <Icon className="w-4 h-4 text-[#0B2545]" /> {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
