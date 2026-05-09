"use client";

import { useState } from "react";
import Link from "next/link";
import ChanceBadge from "@/components/ui/ChanceBadge";
import { PredictorResultSkeleton } from "@/components/ui/Skeleton";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { PredictorResult, ExamType, Category } from "@/types";
import { formatFees, formatPackage, cn } from "@/lib/utils";
import {
  BarChart3, ChevronRight, MapPin, IndianRupee, Award,
  BookOpen, Plus, Check, AlertCircle
} from "lucide-react";
import { useCompareStore } from "@/store/compareStore";

const EXAMS: { value: ExamType; label: string; description: string }[] = [
  { value: "JEE_MAIN", label: "JEE Main", description: "For NITs, IIITs, Government colleges" },
  { value: "JEE_ADVANCED", label: "JEE Advanced", description: "For IITs only" },
  { value: "NEET", label: "NEET", description: "For medical colleges (AIIMS)" },
];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "GENERAL", label: "General (UR)" },
  { value: "OBC", label: "OBC" },
  { value: "SC", label: "SC" },
  { value: "ST", label: "ST" },
  { value: "EWS", label: "EWS" },
];

function ResultCard({ result }: { result: PredictorResult }) {
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompareStore();
  const inCompare = isInCompare(result.college.id);
  const compareFull = compareList.length >= 3 && !inCompare;

  return (
    <div className={cn("card p-5 space-y-4 animate-slide-up border-l-4",
      result.chance === "HIGH" ? "border-l-green-500"
      : result.chance === "MEDIUM" ? "border-l-amber-500"
      : "border-l-red-500"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border border-blue-200 flex-shrink-0">
            <span className="text-blue-700 font-bold">{result.college.name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm leading-tight">{result.college.name}</h3>
            <div className="flex items-center gap-1 mt-0.5 text-gray-400 text-xs">
              <MapPin size={10} />
              {result.college.location}
            </div>
          </div>
        </div>
        <ChanceBadge chance={result.chance} size="sm" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-50 rounded-lg p-2.5">
          <p className="text-xs text-gray-400 mb-0.5">Closing Rank</p>
          <p className="text-sm font-bold text-gray-900">{result.cutoffRank.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5">
          <p className="text-xs text-gray-400 mb-0.5">Avg Package</p>
          <p className="text-sm font-bold text-gray-900">{formatPackage(result.college.avgPackage)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5">
          <p className="text-xs text-gray-400 mb-0.5">Fees/yr</p>
          <p className="text-sm font-bold text-gray-900">{formatFees(result.college.feesPerYear)}</p>
        </div>
      </div>

      {/* Matching branches */}
      {result.matchingBranches.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1.5 flex items-center gap-1">
            <BookOpen size={11} /> Eligible Branches
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.matchingBranches.map((b) => (
              <span key={b} className="badge-blue text-xs px-2 py-0.5">{b}</span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Link href={`/colleges/${result.college.slug}`} className="btn-primary flex-1 justify-center text-sm py-2">
          View College <ChevronRight size={13} />
        </Link>
        <button
          onClick={() => inCompare ? removeFromCompare(result.college.id) : !compareFull && addToCompare(result.college)}
          disabled={compareFull}
          className={cn(
            "flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
            inCompare ? "bg-blue-700 text-white" : compareFull ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "btn-secondary"
          )}
        >
          {inCompare ? <Check size={13} /> : <Plus size={13} />}
          {inCompare ? "Added" : "Compare"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, results, color }: { title: string; results: PredictorResult[]; color: string }) {
  return (
    <div>
      <div className={cn("flex items-center gap-2 mb-4 px-3 py-2 rounded-lg font-semibold text-sm", color)}>
        <Award size={16} />
        {title} — {results.length} college{results.length !== 1 ? "s" : ""}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {results.map((r, i) => <ResultCard key={`${r.college.id}-${i}`} result={r} />)}
      </div>
    </div>
  );
}

export default function PredictorPage() {
  const [exam, setExam] = useState<ExamType>("JEE_MAIN");
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState<Category>("GENERAL");
  const [step, setStep] = useState<"form" | "loading" | "results">("form");
  const [results, setResults] = useState<PredictorResult[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rank || isNaN(Number(rank)) || Number(rank) < 1) {
      setError("Please enter a valid rank");
      return;
    }
    setError("");
    setStep("loading");
    try {
      const res = await fetch("/api/predictor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exam, rank: Number(rank), category }),
      });
      const json = await res.json();
      if (json.success) {
        setResults(json.data);
        setStep("results");
      } else {
        setError(json.error ?? "Prediction failed");
        setStep("form");
      }
    } catch {
      setError("Network error. Please try again.");
      setStep("form");
    }
  };

  const highResults = results.filter((r) => r.chance === "HIGH");
  const mediumResults = results.filter((r) => r.chance === "MEDIUM");
  const lowResults = results.filter((r) => r.chance === "LOW");

  return (
    <div className="page-container py-8 pb-12">
      <Breadcrumb items={[{ label: "Predictor" }]} />
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-2">
          <BarChart3 className="text-blue-700" size={24} />
          Admission Predictor
        </h1>
        <p className="section-subtitle">Enter your rank to see colleges within your reach</p>
      </div>

      {/* Form card */}
      <div className="card p-6 mb-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Exam selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Exam</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {EXAMS.map(({ value, label, description }) => (
                <button
                  key={value}
                  type="button"
                  id={`exam-${value}`}
                  onClick={() => setExam(value)}
                  className={cn(
                    "text-left p-3.5 rounded-xl border-2 transition-all",
                    exam === value
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  )}
                >
                  <p className={cn("font-bold text-sm", exam === value ? "text-blue-700" : "text-gray-900")}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">{description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Rank + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rank-input" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Your Rank
              </label>
              <input
                id="rank-input"
                type="number"
                min="1"
                max="2000000"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="e.g. 5000"
                className="input text-base font-semibold"
                required
              />
            </div>
            <div>
              <label htmlFor="category-select" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Category
              </label>
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="select"
              >
                {CATEGORIES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            id="predict-btn"
            type="submit"
            disabled={step === "loading"}
            className="btn-primary w-full justify-center py-3 text-base"
          >
            <BarChart3 size={17} />
            {step === "loading" ? "Predicting..." : "Predict My Colleges"}
            <ChevronRight size={16} />
          </button>
        </form>
      </div>

      {/* Loading skeletons */}
      {step === "loading" && (
        <div className="space-y-6">
          <div className="h-6 w-32 skeleton rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <PredictorResultSkeleton key={i} />)}
          </div>
        </div>
      )}

      {/* Results */}
      {step === "results" && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {results.length > 0 ? `${results.length} Colleges Found` : "No results"}
            </h2>
            <button
              onClick={() => { setStep("form"); setResults([]); }}
              className="btn-secondary text-sm"
            >
              Try Another Rank
            </button>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={28} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No colleges in range</h3>
              <p className="text-gray-500 mb-4">
                Your rank doesn&apos;t match any cutoffs in our database. Try a different exam or category.
              </p>
              <button onClick={() => setStep("form")} className="btn-primary">
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {highResults.length > 0 && (
                <Section title="High Chance" results={highResults} color="bg-green-50 text-green-700" />
              )}
              {mediumResults.length > 0 && (
                <Section title="Medium Chance" results={mediumResults} color="bg-amber-50 text-amber-700" />
              )}
              {lowResults.length > 0 && (
                <Section title="Low Chance" results={lowResults} color="bg-red-50 text-red-700" />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
