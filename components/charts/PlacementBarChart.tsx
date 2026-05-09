"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Placement } from "@/types";

interface PlacementBarChartProps {
  placements: Placement[];
}

function formatLakh(value: number) {
  return `₹${(value / 100000).toFixed(1)}L`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-bold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: { name: string; value: number; color: string }, i: number) => (
          <p key={i} style={{ color: entry.color }} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: entry.color }} />
            {entry.name}:{" "}
            {entry.name === "Placement %"
              ? `${entry.value}%`
              : formatLakh(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function PlacementBarChart({ placements }: PlacementBarChartProps) {
  const data = [...placements]
    .sort((a, b) => a.year - b.year)
    .map((p) => ({
      year: String(p.year),
      "Avg Package": p.avgPackage,
      "Top Package": p.topPackage,
      "Placement %": p.placementPercent,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Package Trends (₹ Lakhs)</h4>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#6b7280" }} />
            <YAxis tickFormatter={(v) => `₹${v / 100000}L`} tick={{ fontSize: 11, fill: "#6b7280" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Avg Package" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Top Package" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Placement Rate (%)</h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#6b7280" }} />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: "#6b7280" }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Placement %" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
