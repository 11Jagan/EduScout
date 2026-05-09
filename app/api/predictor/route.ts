import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ExamType, Category, ChanceLevel } from "@/types";

function calcChance(userRank: number, closingRank: number): ChanceLevel | null {
  if (userRank <= closingRank * 0.70) return "HIGH";
  if (userRank <= closingRank * 1.10) return "MEDIUM";
  if (userRank <= closingRank * 1.50) return "LOW";
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { exam, rank, category } = body as {
      exam: ExamType;
      rank: number;
      category: Category;
    };

    if (!exam || !rank || !category) {
      return NextResponse.json(
        { success: false, error: "exam, rank, and category are required", code: 400 },
        { status: 400 }
      );
    }

    // Latest year cutoffs for given exam + category
    const cutoffs = await prisma.predictorCutoff.findMany({
      where: { exam, category },
      include: {
        college: { include: { tags: true } },
      },
      orderBy: { year: "desc" },
    });

    // Group by college + branch, take the most recent cutoff
    const seen = new Map<string, typeof cutoffs[0]>();
    for (const c of cutoffs) {
      const key = `${c.collegeId}-${c.branch}`;
      if (!seen.has(key)) seen.set(key, c);
    }

    const results: {
      college: Record<string, unknown>;
      chance: ChanceLevel;
      matchingBranches: string[];
      cutoffRank: number;
    }[] = [];

    const byCollege = new Map<number, { college: typeof cutoffs[0]["college"]; branches: { branch: string; closing: number; chance: ChanceLevel }[] }>();

    for (const cutoff of Array.from(seen.values())) {
      const chance = calcChance(rank, cutoff.closingRank);
      if (!chance) continue;

      if (!byCollege.has(cutoff.collegeId)) {
        byCollege.set(cutoff.collegeId, { college: cutoff.college, branches: [] });
      }
      byCollege.get(cutoff.collegeId)!.branches.push({
        branch: cutoff.branch,
        closing: cutoff.closingRank,
        chance,
      });
    }

    for (const [, { college, branches }] of Array.from(byCollege)) {
      // Best chance for this college
      const hasHigh = branches.some((b) => b.chance === "HIGH");
      const hasMedium = branches.some((b) => b.chance === "MEDIUM");
      const overallChance: ChanceLevel = hasHigh ? "HIGH" : hasMedium ? "MEDIUM" : "LOW";

      results.push({
        college: {
          ...college,
          createdAt: college.createdAt.toISOString(),
          tags: college.tags,
        },
        chance: overallChance,
        matchingBranches: branches.map((b) => b.branch),
        cutoffRank: Math.min(...branches.map((b) => b.closing)),
      });
    }

    // Sort: HIGH first, then MEDIUM, then LOW
    const order: ChanceLevel[] = ["HIGH", "MEDIUM", "LOW"];
    results.sort((a, b) => order.indexOf(a.chance) - order.indexOf(b.chance));

    return NextResponse.json({ success: true, data: results });
  } catch (err) {
    console.error("[POST /api/predictor]", err);
    return NextResponse.json(
      { success: false, error: "Prediction failed", code: 500 },
      { status: 500 }
    );
  }
}
