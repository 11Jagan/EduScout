import { NextRequest, NextResponse } from "next/server";
import { getCollegesForCompare } from "@/lib/db/colleges";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids") ?? "";
    const ids = idsParam
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id))
      .slice(0, 3);

    if (ids.length < 1) {
      return NextResponse.json(
        { success: false, error: "Provide at least 1 college ID", code: 400 },
        { status: 400 }
      );
    }

    const colleges = await getCollegesForCompare(ids);
    return NextResponse.json({ success: true, data: colleges });
  } catch (err) {
    console.error("[GET /api/compare]", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comparison data", code: 500 },
      { status: 500 }
    );
  }
}
