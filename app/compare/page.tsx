"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCompareStore } from "@/store/compareStore";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { CollegeDetail } from "@/types";
import { formatFees, formatPackage, cn } from "@/lib/utils";
import {
  GitCompareArrows, X, Plus, Search, Share2, Trash2,
  CheckCircle2, XCircle, IndianRupee, TrendingUp,
  Star, GraduationCap, BookOpen
} from "lucide-react";
import RatingStars from "@/components/ui/RatingStars";

const ROW_DEFS = [
  { label: "Location", key: "location", fmt: (v: unknown) => String(v), compare: "none" },
  { label: "Type", key: "type", fmt: (v: unknown) => String(v), compare: "none" },
  { label: "Annual Fees", key: "feesPerYear", fmt: (v: unknown) => formatFees(Number(v)), compare: "lower" },
  { label: "Rating", key: "rating", fmt: (v: unknown) => `${Number(v).toFixed(1)}/5`, compare: "higher" },
  { label: "Placement %", key: "placementPercent", fmt: (v: unknown) => `${v}%`, compare: "higher" },
  { label: "Avg Package", key: "avgPackage", fmt: (v: unknown) => formatPackage(Number(v)), compare: "higher" },
  { label: "Top Package", key: "topPackage", fmt: (v: unknown) => formatPackage(Number(v)), compare: "higher" },
  { label: "NAAC Grade", key: "naacGrade", fmt: (v: unknown) => String(v), compare: "none" },
  { label: "Established", key: "established", fmt: (v: unknown) => String(v), compare: "none" },
  { label: "Hostel", key: "hostelAvailable", fmt: (v: unknown) => v ? "✓ Available" : "✗ Not Available", compare: "none", nested: "collegeInfo" },
  { label: "Scholarship", key: "scholarshipAvailable", fmt: (v: unknown) => v ? "✓ Available" : "✗ Not Available", compare: "none", nested: "collegeInfo" },
] as const;

function getBestIndex(colleges: CollegeDetail[], key: string, direction: "lower" | "higher" | "none", nested?: string): number {
  if (direction === "none") return -1;
  const vals = colleges.map((c) => {
    const obj = nested ? (c as any)[nested] : c;
    return obj ? Number((obj as any)[key] ?? 0) : 0;
  });
  if (direction === "lower") return vals.indexOf(Math.min(...vals));
  return vals.indexOf(Math.max(...vals));
}

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare, addToCompare } = useCompareStore();
  const [colleges, setColleges] = useState<CollegeDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CollegeDetail[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Hydrate from URL params
  useEffect(() => {
    const idsParam = searchParams.get("ids");
    if (idsParam && compareList.length === 0) {
      fetch(`/api/compare?ids=${idsParam}`)
        .then((r) => r.json())
        .then((json) => {
          if (json.success) {
            json.data.forEach((c: CollegeDetail) => addToCompare(c as unknown as import("@/types").College));
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (compareList.length === 0) { setColleges([]); return; }
    setLoading(true);
    const ids = compareList.map((c) => c.id).join(",");
    fetch(`/api/compare?ids=${ids}`)
      .then((r) => r.json())
      .then((json) => { if (json.success) setColleges(json.data); })
      .finally(() => setLoading(false));
  }, [compareList]);

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    const res = await fetch(`/api/colleges?search=${q}&limit=6`);
    const json = await res.json();
    if (json.success) setSearchResults(json.data);
  };

  const handleShare = () => {
    const ids = compareList.map((c) => c.id).join(",");
    const url = `${window.location.origin}/compare?ids=${ids}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const updateUrl = () => {
    const ids = compareList.map((c) => c.id).join(",");
    router.replace(`/compare?ids=${ids}`, { scroll: false });
  };

  useEffect(() => { if (compareList.length > 0) updateUrl(); }, [compareList]);

  if (compareList.length < 2) {
    return (
      <div className="page-container py-12">
        <Breadcrumb items={[{ label: "Compare" }]} />
        <div className="text-center max-w-md mx-auto mt-8">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <GitCompareArrows size={36} className="text-blue-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Compare Colleges</h1>
          <p className="text-gray-500 mb-6">
            Add at least 2 colleges to compare them side-by-side. Browse colleges and click &ldquo;Compare&rdquo; on any card.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/colleges" id="go-to-colleges-btn" className="btn-primary justify-center">
              <Search size={16} /> Browse Colleges
            </Link>
            {compareList.length === 1 && (
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-green-500" />
                {compareList[0].name} added. Add 1 more!
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-8 pb-12">
      <Breadcrumb items={[{ label: "Compare" }]} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 mt-4">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <GitCompareArrows className="text-blue-700" size={24} />
            Compare Colleges
          </h1>
          <p className="section-subtitle">Side-by-side comparison · Highlights best values</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {compareList.length < 3 && (
            <button id="add-college-btn" onClick={() => setShowSearchModal(true)} className="btn-secondary text-sm">
              <Plus size={14} /> Add College
            </button>
          )}
          <button id="share-compare-btn" onClick={handleShare} className="btn-secondary text-sm">
            <Share2 size={14} />
            {copied ? "Copied!" : "Share"}
          </button>
          <button id="clear-compare-btn" onClick={clearCompare} className="btn-danger text-sm">
            <Trash2 size={14} /> Clear All
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading comparison...</div>
      ) : (
        <div className="card overflow-hidden">
          {/* College headers */}
          <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `200px repeat(${colleges.length}, 1fr)` }}>
            <div className="p-4 bg-gray-50 border-r border-gray-100" />
            {colleges.map((c) => (
              <div key={c.id} className="p-4 border-r border-gray-100 last:border-r-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0 border border-blue-200">
                      <span className="text-blue-700 font-bold">{c.name.charAt(0)}</span>
                    </div>
                    <div>
                      <Link href={`/colleges/${c.slug}`} className="font-bold text-gray-900 text-sm hover:text-blue-700 transition-colors line-clamp-2 leading-tight">
                        {c.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">{c.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCompare(c.id)}
                    className="p-1 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors flex-shrink-0 text-gray-400"
                    title="Remove"
                  >
                    <X size={14} />
                  </button>
                </div>
                <RatingStars rating={c.rating} size="sm" showValue={false} />
              </div>
            ))}
          </div>

          {/* Rows */}
          {ROW_DEFS.map((row, ri) => {
            const bestIdx = getBestIndex(colleges, row.key, row.compare as "lower" | "higher" | "none", row.nested as string | undefined);
            return (
              <div
                key={row.key}
                className={cn("grid border-b border-gray-50 last:border-b-0", ri % 2 === 0 ? "bg-white" : "bg-gray-50/40")}
                style={{ gridTemplateColumns: `200px repeat(${colleges.length}, 1fr)` }}
              >
                <div className="p-4 border-r border-gray-100 flex items-center">
                  <span className="text-sm font-semibold text-gray-600">{row.label}</span>
                </div>
                {colleges.map((c, ci) => {
                  const obj = row.nested ? (c as any)[row.nested] : c;
                  const raw = obj ? (obj as any)[row.key] : null;
                  const formatted = raw !== null && raw !== undefined ? row.fmt(raw) : "—";
                  const isBest = ci === bestIdx;
                  return (
                    <div
                      key={c.id}
                      className={cn(
                        "p-4 border-r border-gray-100 last:border-r-0 flex items-center justify-between",
                        isBest && "bg-green-50"
                      )}
                    >
                      <span className={cn("text-sm font-medium", isBest ? "text-green-700" : "text-gray-800")}>
                        {formatted}
                      </span>
                      {isBest && <CheckCircle2 size={15} className="text-green-500 flex-shrink-0 ml-1" />}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Actions row */}
          <div
            className="grid bg-gray-50 border-t border-gray-100"
            style={{ gridTemplateColumns: `200px repeat(${colleges.length}, 1fr)` }}
          >
            <div className="p-4 border-r border-gray-100 flex items-center">
              <span className="text-sm font-semibold text-gray-600">Actions</span>
            </div>
            {colleges.map((c) => (
              <div key={c.id} className="p-4 border-r border-gray-100 last:border-r-0">
                <Link href={`/colleges/${c.slug}`} className="btn-primary text-sm w-full justify-center">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-green-100 border border-green-200 rounded-sm" />
          Best value in category
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={11} className="text-green-500" />
          Highest/Lowest (whichever is better)
        </span>
        <span className="flex items-center gap-1.5">
          <XCircle size={11} className="text-gray-300" />
          Other values
        </span>
      </div>

      {/* Search modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Add a College</h3>
              <button onClick={() => { setShowSearchModal(false); setSearchQuery(""); setSearchResults([]); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="input pl-9"
                  placeholder="Search college name..."
                />
              </div>
              {searchResults.length > 0 && (
                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {searchResults.map((c) => {
                    const alreadyAdded = compareList.some((x) => x.id === c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          if (!alreadyAdded) {
                            addToCompare(c as unknown as import("@/types").College);
                            setShowSearchModal(false);
                            setSearchQuery("");
                            setSearchResults([]);
                          }
                        }}
                        disabled={alreadyAdded}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                          alreadyAdded ? "opacity-50 cursor-not-allowed bg-gray-50" : "hover:bg-blue-50"
                        )}
                      >
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border border-blue-200 flex-shrink-0">
                          <span className="text-blue-700 font-bold text-sm">{c.name.charAt(0)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{c.name}</p>
                          <p className="text-xs text-gray-400 truncate">{c.location}</p>
                        </div>
                        {alreadyAdded && (
                          <span className="ml-auto text-xs text-green-600 font-medium flex-shrink-0">Added</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              {searchQuery && searchResults.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-4">No colleges found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
