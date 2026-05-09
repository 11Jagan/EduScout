import { NextRequest, NextResponse } from "next/server";
import { getColleges } from "@/lib/db/colleges";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = {
      search: searchParams.get("search") ?? "",
      state: searchParams.get("state") ?? "",
      type: searchParams.get("type") ?? "",
      fees_range: searchParams.get("fees_range") ?? "",
      page: Number(searchParams.get("page") ?? 1),
      limit: Number(searchParams.get("limit") ?? 9),
    };

    const result = await getColleges(params);
    return NextResponse.json({
      success: true,
      data: result.colleges,
      meta: { page: result.page, total: result.total, totalPages: result.totalPages },
    });
  } catch (err) {
    console.error("[GET /api/colleges]", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch colleges", code: 500 },
      { status: 500 }
    );
  }
}
