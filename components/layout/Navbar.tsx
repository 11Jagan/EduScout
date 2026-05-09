"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompareStore } from "@/store/compareStore";
import { GitCompareArrows, GraduationCap, Search, BarChart3, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/colleges", label: "Colleges", icon: Search },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/predictor", label: "Predictor", icon: BarChart3 },
];

export default function Navbar() {
  const pathname = usePathname();
  const compareList = useCompareStore((s) => s.compareList);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 mx-4 md:mx-8 xl:mx-auto max-w-7xl bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl">
      <div className="px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
              <GraduationCap className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Edu<span className="text-black">Scout</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
                  pathname.startsWith(href)
                    ? "bg-zinc-100 text-black"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/compare"
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-zinc-100 text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              <GitCompareArrows size={16} />
              Compare
              {compareList.length > 0 && (
                <span className="w-5 h-5 bg-black text-white rounded-full text-xs flex items-center justify-center font-bold">
                  {compareList.length}
                </span>
              )}
            </Link>

            <button
              id="mobile-menu-btn"
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 animate-fade-in">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  pathname.startsWith(href)
                    ? "bg-zinc-100 text-black"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} />
                {label}
                {href === "/compare" && compareList.length > 0 && (
                  <span className="ml-auto w-5 h-5 bg-black text-white rounded-full text-xs flex items-center justify-center font-bold">
                    {compareList.length}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
