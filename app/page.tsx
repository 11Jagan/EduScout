import Link from "next/link";
import { Search, GitCompareArrows, BarChart3, ArrowRight } from "lucide-react";
import HeroSection from "@/components/hero-section";

const features = [
  {
    icon: Search,
    title: "Smart College Search",
    description: "Filter by state, college type, and fees range. Find exactly what matches your goals.",
    href: "/colleges",
    color: "bg-zinc-100 text-black",
    cta: "Browse Colleges",
  },
  {
    icon: GitCompareArrows,
    title: "Side-by-Side Compare",
    description: "Compare up to 3 colleges across fees, placements, packages, and more.",
    href: "/compare",
    color: "bg-zinc-100 text-black",
    cta: "Compare Now",
  },
  {
    icon: BarChart3,
    title: "Admission Predictor",
    description: "Enter your JEE/NEET rank and category to see which colleges are within reach.",
    href: "/predictor",
    color: "bg-zinc-100 text-black",
    cta: "Predict Chances",
  },
];

const topColleges = [
  { name: "IIT Bombay", loc: "Mumbai, Maharashtra", rank: "#1 NIRF", type: "IIT" },
  { name: "IIT Delhi", loc: "New Delhi", rank: "#2 NIRF", type: "IIT" },
  { name: "AIIMS Delhi", loc: "New Delhi", rank: "#1 Medical", type: "AIIMS" },
  { name: "IIM Ahmedabad", loc: "Ahmedabad, Gujarat", rank: "#1 MBA", type: "IIM" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Features ── */}
      <section className="page-container py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Everything You Need to Decide</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Three powerful tools to guide your college admission journey from search to decision.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, href, color, cta }) => (
            <div key={title} className="card p-6 flex flex-col gap-4 group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
              <Link
                href={href}
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-black hover:gap-3 transition-all"
              >
                {cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Top Colleges ── */}
      <section className="bg-gradient-to-br from-[#FDFDFC] to-zinc-50 py-16">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Top Ranked Colleges</h2>
              <p className="text-gray-500 text-sm mt-1">India&apos;s premier institutions</p>
            </div>
            <Link href="/colleges" className="btn-secondary text-sm hidden md:flex">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topColleges.map(({ name, loc, rank, type }) => (
              <div key={name} className="card p-4 flex items-start gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center flex-shrink-0 border border-zinc-200">
                  <span className="text-black font-bold">{name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-black transition-colors truncate">
                    {name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{loc}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="badge-zinc text-xs px-2 py-0.5 rounded bg-zinc-100 text-zinc-700"> {type}</span>
                    <span className="text-xs text-gray-400">{rank}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <Link href="/colleges" className="btn-primary text-sm">
              View All Colleges <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="page-container py-16">
        <div className="bg-black rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          </div>
          <h2 className="text-3xl font-extrabold mb-3 relative">Ready to Find Your College?</h2>
          <p className="text-blue-100 mb-7 max-w-xl mx-auto relative">
            Use our admission predictor to know your chances before you apply.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
            <Link href="/predictor" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-100 transition-colors">
              <BarChart3 size={18} />
              Try Admission Predictor
            </Link>
            <Link href="/colleges" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/30 text-white rounded-xl font-bold hover:bg-white/20 transition-colors">
              <Search size={18} />
              Explore Colleges
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
