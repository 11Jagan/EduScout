"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import MetricCard from "@/components/ui/MetricCard";
import RatingStars from "@/components/ui/RatingStars";
import PlacementBarChart from "@/components/charts/PlacementBarChart";
import { CollegeDetail, Course, Placement, Review } from "@/types";
import { formatFees, formatPackage, cn } from "@/lib/utils";
import {
  MapPin, Globe, IndianRupee, Users, TrendingUp, Building2,
  Star, Plus, Check, ChevronUp, ChevronDown, X, Send
} from "lucide-react";
import { useCompareStore } from "@/store/compareStore";

type Tab = "courses" | "placements" | "reviews";

function CoursesTab({ courses }: { courses: Course[] }) {
  const [sortKey, setSortKey] = useState<"feesPerYear" | "name">("feesPerYear");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = [...courses].sort((a, b) => {
    const va = a[sortKey];
    const vb = b[sortKey];
    if (typeof va === "number" && typeof vb === "number")
      return sortDir === "asc" ? va - vb : vb - va;
    return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
  });

  const toggle = (key: typeof sortKey) => {
    if (sortKey === key) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };
  const setDir = setSortDir;

  const SortIcon = ({ k }: { k: typeof sortKey }) =>
    sortKey === k ? (
      sortDir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />
    ) : null;

  const degreeLabel: Record<string, string> = {
    UNDERGRADUATE: "UG", POSTGRADUATE: "PG", DOCTORATE: "PhD",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {[
              { label: "Course Name", key: "name" },
              { label: "Level", key: null },
              { label: "Duration", key: null },
              { label: "Seats", key: null },
              { label: "Fees/yr", key: "feesPerYear" },
            ].map(({ label, key }) => (
              <th
                key={label}
                onClick={() => key && toggle(key as typeof sortKey)}
                className={cn(
                  "text-left py-3 px-4 font-semibold text-gray-600 whitespace-nowrap",
                  key && "cursor-pointer hover:text-blue-700 select-none"
                )}
              >
                <span className="inline-flex items-center gap-1">
                  {label}
                  {key && <SortIcon k={key as typeof sortKey} />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((course, i) => (
            <tr key={course.id} className={cn("border-b border-gray-50 hover:bg-blue-50/50 transition-colors", i % 2 === 0 ? "bg-white" : "bg-gray-50/30")}>
              <td className="py-3 px-4 font-medium text-gray-900">{course.name}</td>
              <td className="py-3 px-4">
                <span className="badge badge-blue">{degreeLabel[course.degreeLevel] ?? course.degreeLevel}</span>
              </td>
              <td className="py-3 px-4 text-gray-600">{course.durationYears} yr{course.durationYears > 1 ? "s" : ""}</td>
              <td className="py-3 px-4 text-gray-600">{course.seats}</td>
              <td className="py-3 px-4 font-semibold text-gray-900">{formatFees(course.feesPerYear)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlacementsTab({ placements }: { placements: Placement[] }) {
  if (!placements.length) return <p className="text-gray-400 text-center py-8">No placement data available.</p>;

  const latest = placements[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Placement %" value={`${latest.placementPercent}%`} icon={TrendingUp} highlight />
        <MetricCard label="Avg Package" value={formatPackage(latest.avgPackage)} icon={IndianRupee} />
        <MetricCard label="Top Package" value={formatPackage(latest.topPackage)} icon={Star} />
        <MetricCard label="Companies" value={String(latest.companiesVisited)} icon={Building2} />
      </div>
      <PlacementBarChart placements={placements} />
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center font-bold text-blue-700 flex-shrink-0">
            {review.authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{review.authorName}</p>
            <p className="text-xs text-gray-400">{review.courseTaken} · Batch {review.batchYear}</p>
          </div>
        </div>
        <RatingStars rating={review.rating} size="sm" />
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{review.content}</p>
      <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</p>
    </div>
  );
}

function ReviewModal({ slug, onClose, onSubmitted }: { slug: string; onClose: () => void; onSubmitted: () => void }) {
  const [form, setForm] = useState({ authorName: "", batchYear: "", rating: "5", content: "", courseTaken: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/colleges/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, batchYear: Number(form.batchYear), rating: Number(form.rating) }),
      });
      const json = await res.json();
      if (json.success) { onSubmitted(); onClose(); }
      else setError(json.error ?? "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Write a Review</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Your Name</label>
              <input required value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} className="input" placeholder="Rahul Sharma" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Batch Year</label>
              <input required type="number" min="2000" max="2030" value={form.batchYear} onChange={(e) => setForm({ ...form, batchYear: e.target.value })} className="input" placeholder="2023" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Course Taken</label>
              <input required value={form.courseTaken} onChange={(e) => setForm({ ...form, courseTaken: e.target.value })} className="input" placeholder="B.Tech CSE" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Rating</label>
              <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="select">
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r !== 1 ? "s" : ""}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Your Review</label>
            <textarea required rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="input resize-none" placeholder="Share your experience..." />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              <Send size={14} />
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CollegeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [college, setCollege] = useState<CollegeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("courses");
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompareStore();
  const inCompare = college ? isInCompare(college.id) : false;
  const compareFull = compareList.length >= 3 && !inCompare;

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/colleges/${slug}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCollege(json.data);
        else notFound();
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="page-container py-8 space-y-6 animate-pulse">
        <div className="h-4 w-48 skeleton rounded" />
        <div className="h-48 skeleton rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 skeleton rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!college) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "courses", label: "Courses" },
    { key: "placements", label: "Placements" },
    { key: "reviews", label: `Reviews (${college.reviews?.length ?? 0})` },
  ];

  return (
    <div className="page-container py-4 pb-12">
      <Breadcrumb items={[{ label: "Colleges", href: "/colleges" }, { label: college.name }]} />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 md:p-8 text-white overflow-hidden mb-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
        </div>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 relative">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-extrabold text-2xl">{college.name.charAt(0)}</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="badge bg-white/20 text-white border-0 text-xs">{college.type}</span>
                <span className="badge bg-amber-400/30 text-amber-200 border-0 text-xs">NAAC {college.naacGrade}</span>
                <span className="badge bg-white/10 text-blue-100 border-0 text-xs">Est. {college.established}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">{college.name}</h1>
              <div className="flex items-center gap-1.5 mt-1 text-blue-200 text-sm">
                <MapPin size={13} />
                <span>{college.location}</span>
              </div>
            </div>
          </div>

          {/* Compare sticky button */}
          <button
            id="detail-compare-btn"
            onClick={() => inCompare ? removeFromCompare(college.id) : !compareFull && addToCompare(college as unknown as import("@/types").College)}
            disabled={compareFull}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0",
              inCompare
                ? "bg-white text-blue-700 hover:bg-red-50 hover:text-red-600"
                : compareFull
                ? "bg-white/20 text-white/50 cursor-not-allowed"
                : "bg-white/10 border border-white/30 text-white hover:bg-white/20"
            )}
          >
            {inCompare ? <Check size={15} /> : <Plus size={15} />}
            {inCompare ? "In Compare" : compareFull ? "List Full" : "Add to Compare"}
          </button>
        </div>

        {/* Website link */}
        {college.collegeInfo?.websiteUrl && (
          <a href={college.collegeInfo.websiteUrl} target="_blank" rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-blue-200 text-xs hover:text-white transition-colors relative">
            <Globe size={12} />
            {college.collegeInfo.websiteUrl}
          </a>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Annual Fees" value={formatFees(college.feesPerYear)} icon={IndianRupee} />
        <MetricCard label="Rating" value={`${college.rating}/5`} icon={Star} highlight />
        <MetricCard label="Placement %" value={`${college.placementPercent}%`} icon={TrendingUp} />
        <MetricCard label="Avg Package" value={formatPackage(college.avgPackage)} icon={Users} />
      </div>

      {/* About */}
      {college.collegeInfo?.about && (
        <div className="card p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-2 text-base">About</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{college.collegeInfo.about}</p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
            {college.collegeInfo.campusAreaAcres && (
              <span>🏫 Campus: {college.collegeInfo.campusAreaAcres} acres</span>
            )}
            <span>{college.collegeInfo.hostelAvailable ? "🏠 Hostel available" : "🚫 No hostel"}</span>
            <span>{college.collegeInfo.scholarshipAvailable ? "🎓 Scholarships available" : ""}</span>
            <span>📋 {college.collegeInfo.accreditations}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="card overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              id={`tab-${key}`}
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex-1 py-3.5 text-sm font-medium transition-all duration-150",
                activeTab === key ? "tab-active" : "tab-inactive"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="p-5">
          {activeTab === "courses" && <CoursesTab courses={college.courses ?? []} />}
          {activeTab === "placements" && <PlacementsTab placements={college.placements ?? []} />}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Student Reviews</h3>
                <button id="write-review-btn" onClick={() => setShowReviewModal(true)} className="btn-primary text-sm py-2">
                  <Star size={14} /> Write a Review
                </button>
              </div>
              {(college.reviews ?? []).length === 0 ? (
                <p className="text-gray-400 text-center py-8">No reviews yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {(college.reviews ?? []).map((r) => <ReviewCard key={r.id} review={r} />)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showReviewModal && (
        <ReviewModal
          slug={slug}
          onClose={() => setShowReviewModal(false)}
          onSubmitted={() => {
            fetch(`/api/colleges/${slug}`).then((r) => r.json()).then((j) => { if (j.success) setCollege(j.data); });
          }}
        />
      )}
    </div>
  );
}
