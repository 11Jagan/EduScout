"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import CollegeCard from "@/components/ui/CollegeCard";
import { CollegeCardSkeleton } from "@/components/ui/Skeleton";
import { College } from "@/types";
import { COLLEGE_TYPES, FEES_RANGES, INDIAN_STATES } from "@/lib/utils";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [type, setType] = useState("");
  const [feesRange, setFeesRange] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 300);
  };

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(state && { state }),
      ...(type && { type }),
      ...(feesRange && { fees_range: feesRange }),
      page: String(page),
      limit: "9",
    });
    try {
      const res = await fetch(`/api/colleges?${params}`);
      const json = await res.json();
      if (json.success) {
        setColleges(json.data);
        setTotal(json.meta.total);
        setTotalPages(json.meta.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, state, type, feesRange, page]);

  useEffect(() => { fetchColleges(); }, [fetchColleges]);

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setState("");
    setType("");
    setFeesRange("");
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || state || type || feesRange;

  const pageNums = () => {
    const nums: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) nums.push(i);
    } else {
      nums.push(1);
      if (page > 3) nums.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) nums.push(i);
      if (page < totalPages - 2) nums.push("...");
      nums.push(totalPages);
    }
    return nums;
  };

  return (
    <div className="page-container py-8">
      <Breadcrumb items={[{ label: "Colleges" }]} />
      {/* Header */}
      <div className="mb-6">
        <h1 className="section-title">Explore Colleges</h1>
        <p className="section-subtitle">
          {loading ? "Loading..." : `${total} colleges found`}
        </p>
      </div>

      {/* Search + Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="college-search"
              type="text"
              placeholder="Search by name, location, or state..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="input pl-9"
            />
            {search && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Toggle filters on mobile */}
          <button
            id="toggle-filters-btn"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden btn-secondary text-sm"
          >
            <SlidersHorizontal size={15} />
            Filters {hasActiveFilters ? `(${[state, type, feesRange].filter(Boolean).length})` : ""}
          </button>

          {/* Desktop filters */}
          <div className="hidden md:flex gap-3">
            <select id="filter-state" value={state} onChange={(e) => { setState(e.target.value); setPage(1); }} className="select w-44">
              <option value="">All States</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select id="filter-type" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="select w-44">
              <option value="">All Types</option>
              {COLLEGE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select id="filter-fees" value={feesRange} onChange={(e) => { setFeesRange(e.target.value); setPage(1); }} className="select w-44">
              <option value="">Any Fees</option>
              {FEES_RANGES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-ghost text-sm whitespace-nowrap text-red-500 hover:bg-red-50">
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Mobile filters dropdown */}
        {showFilters && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 gap-3">
            <select value={state} onChange={(e) => { setState(e.target.value); setPage(1); }} className="select">
              <option value="">All States</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="select">
              <option value="">All Types</option>
              {COLLEGE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={feesRange} onChange={(e) => { setFeesRange(e.target.value); setPage(1); }} className="select">
              <option value="">Any Fees</option>
              {FEES_RANGES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-ghost text-sm text-red-500 hover:bg-red-50 self-start">
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => <CollegeCardSkeleton key={i} />)}
        </div>
      ) : colleges.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No colleges found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters.</p>
          <button onClick={clearFilters} className="btn-secondary text-sm">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {colleges.map((c) => <CollegeCard key={c.id} college={c} />)}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-10">
          <button
            id="prev-page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary px-3 py-2 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          {pageNums().map((n, i) =>
            n === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
            ) : (
              <button
                key={n}
                id={`page-btn-${n}`}
                onClick={() => setPage(n as number)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  page === n
                    ? "bg-blue-700 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-700"
                }`}
              >
                {n}
              </button>
            )
          )}
          <button
            id="next-page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary px-3 py-2 disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
