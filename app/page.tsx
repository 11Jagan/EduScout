import Link from "next/link";
import { Search, GitCompareArrows, BarChart3, GraduationCap, ArrowRight, Star, TrendingUp, Award } from "lucide-react";

const stats = [
  { label: "Colleges Listed", value: "12+", icon: GraduationCap },
  { label: "Avg Rating", value: "4.5★", icon: Star },
  { label: "Placement Rate", value: "95%", icon: TrendingUp },
  { label: "Top Rankings", value: "#1 IIT", icon: Award },
];

const features = [
  {
    icon: Search,
    title: "Smart College Search",
    description: "Filter by state, college type, and fees range. Find exactly what matches your goals.",
    href: "/colleges",
    color: "bg-blue-50 text-blue-700",
    cta: "Browse Colleges",
  },
  {
    icon: GitCompareArrows,
    title: "Side-by-Side Compare",
    description: "Compare up to 3 colleges across fees, placements, packages, and more.",
    href: "/compare",
    color: "bg-purple-50 text-purple-700",
    cta: "Compare Now",
  },
  {
    icon: BarChart3,
    title: "Admission Predictor",
    description: "Enter your JEE/NEET rank and category to see which colleges are within reach.",
    href: "/predictor",
    color: "bg-green-50 text-green-700",
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
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-400 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="page-container relative py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              India&apos;s #1 College Discovery Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Find Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                Dream College
              </span>{" "}
              with EduScout
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl">
              Search IITs, NITs, AIIMS, IIMs and more. Compare side-by-side. Predict admission
              chances based on your JEE or NEET rank — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/colleges"
                id="hero-browse-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-blue-700 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-lg"
              >
                <Search size={18} />
                Browse Colleges
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/predictor"
                id="hero-predictor-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl font-bold text-base hover:bg-white/20 transition-colors"
              >
                <BarChart3 size={18} />
                Predict Admission
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="page-container py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{value}</p>
                    <p className="text-xs text-blue-200">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:gap-3 transition-all"
              >
                {cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Top Colleges ── */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0 border border-blue-200">
                  <span className="text-blue-700 font-bold">{name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors truncate">
                    {name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{loc}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="badge-blue text-xs">{type}</span>
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
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          </div>
          <h2 className="text-3xl font-extrabold mb-3 relative">Ready to Find Your College?</h2>
          <p className="text-blue-100 mb-7 max-w-xl mx-auto relative">
            Use our admission predictor to know your chances before you apply.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
            <Link href="/predictor" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors">
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
