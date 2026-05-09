"use client";

import Link from "next/link";
import { MapPin, IndianRupee, TrendingUp, Briefcase, Plus, Check, Eye } from "lucide-react";
import { College } from "@/types";
import { formatFees, formatPackage, cn } from "@/lib/utils";
import RatingStars from "@/components/ui/RatingStars";
import { useCompareStore } from "@/store/compareStore";

interface CollegeCardProps {
  college: College;
  compact?: boolean;
}

const typeColors: Record<string, string> = {
  IIT: "badge-blue",
  NIT: "badge-purple",
  AIIMS: "badge-red",
  IIM: "badge-amber",
  DEEMED: "badge-gray",
  CENTRAL_UNIVERSITY: "badge-green",
  STATE_UNIVERSITY: "badge-gray",
  PRIVATE: "badge-gray",
};

const typeLabels: Record<string, string> = {
  IIT: "IIT",
  NIT: "NIT",
  AIIMS: "AIIMS",
  IIM: "IIM",
  DEEMED: "Deemed",
  CENTRAL_UNIVERSITY: "Central Univ.",
  STATE_UNIVERSITY: "State Univ.",
  PRIVATE: "Private",
};

export default function CollegeCard({ college, compact = false }: CollegeCardProps) {
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompareStore();
  const inCompare = isInCompare(college.id);
  const compareListFull = compareList.length >= 3 && !inCompare;

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCompare) {
      removeFromCompare(college.id);
    } else if (!compareListFull) {
      addToCompare(college);
    }
  };

  return (
    <article
      id={`college-card-${college.id}`}
      className={cn(
        "card p-5 md:p-6 flex flex-col gap-5 animate-slide-up group overflow-hidden relative",
        inCompare && "ring-2 ring-blue-500/50 shadow-blue-500/10"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Logo placeholder */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0 border border-blue-200">
          <span className="text-blue-700 font-bold text-lg">
            {college.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors">
              {college.name}
            </h3>
            <span className={cn("badge flex-shrink-0 text-xs", typeColors[college.type] ?? "badge-gray")}>
              {typeLabels[college.type] ?? college.type}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs">
            <MapPin size={11} />
            <span className="truncate">{college.location}</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      {!compact && (
        <div className="grid grid-cols-2 gap-3 relative z-10">
          <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100/50 group-hover:bg-white/50 transition-colors">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Fees/yr</p>
            <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
              <IndianRupee size={12} className="text-gray-400" />
              {formatFees(college.feesPerYear).replace("₹", "")}
            </div>
          </div>
          <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100/50 group-hover:bg-white/50 transition-colors">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Rating</p>
            <RatingStars rating={college.rating} size="sm" showValue={true} />
          </div>
          <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100/50 group-hover:bg-white/50 transition-colors">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
              <TrendingUp size={10} />Placement
            </p>
            <p className="text-sm font-bold text-green-600">{college.placementPercent}%</p>
          </div>
          <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100/50 group-hover:bg-white/50 transition-colors">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
              <Briefcase size={10} />Avg Pkg
            </p>
            <p className="text-sm font-bold text-gray-900">{formatPackage(college.avgPackage)}</p>
          </div>
        </div>
      )}

      {/* Tags */}
      {college.tags && college.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {college.tags.slice(0, 3).map((t) => (
            <span key={t.id} className="badge-gray text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
              {t.tag}
            </span>
          ))}
          {college.naacGrade && (
            <span className="badge-blue text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
              NAAC {college.naacGrade}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2 relative z-10">
        <Link
          href={`/colleges/${college.slug}`}
          id={`view-college-${college.id}`}
          className="btn-primary flex-1 justify-center text-sm py-2"
        >
          <Eye size={14} />
          View Details
        </Link>
        <button
          id={`compare-btn-${college.id}`}
          onClick={handleCompare}
          disabled={compareListFull}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium py-2 transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
            inCompare
              ? "bg-blue-700 text-white hover:bg-red-600"
              : compareListFull
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "btn-secondary"
          )}
          title={
            inCompare
              ? "Remove from compare"
              : compareListFull
              ? "Compare list full (max 3)"
              : "Add to compare"
          }
        >
          {inCompare ? (
            <>
              <Check size={14} />
              Added
            </>
          ) : (
            <>
              <Plus size={14} />
              Compare
            </>
          )}
        </button>
      </div>
    </article>
  );
}
