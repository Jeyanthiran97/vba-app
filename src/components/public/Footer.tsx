import Link from "next/link";
import { Trophy, MapPin, Phone, Mail, Facebook, Youtube, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#0B2545] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#C8952A] rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-white">Vavuniya Boxing</div>
                <div className="text-xs text-gray-400">Association</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The official boxing association of Vavuniya District, Northern Province, Sri Lanka. Affiliated with BASL and IBA.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Youtube, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Twitter, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} className="w-8 h-8 bg-white/10 hover:bg-[#C8952A] rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {[
                ["Home", "/"], ["News", "/news"], ["Events", "/events"],
                ["Achievements", "/achievements"], ["Rankings", "/rankings"],
                ["Gallery", "/gallery"], ["Members", "/members"], ["Sponsors", "/sponsors"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-[#C8952A] text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-[#C8952A] flex-shrink-0" />
                Vavuniya District, Northern Province, Sri Lanka
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-[#C8952A] flex-shrink-0" />
                +94 24 XXX XXXX
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-[#C8952A] flex-shrink-0" />
                info@vavuniyaboxing.lk
              </li>
            </ul>
          </div>

          {/* Affiliations */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Affiliated With</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Boxing Association of Sri Lanka (BASL)</li>
              <li>International Boxing Association (IBA)</li>
              <li>Asian Boxing Confederation (ASBC)</li>
              <li>National Olympic Committee of Sri Lanka</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © {year} Vavuniya Boxing Association. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
            <Link href="/admin/dashboard" className="hover:text-gray-300 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
