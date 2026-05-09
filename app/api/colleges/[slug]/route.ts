import { NextRequest, NextResponse } from "next/server";
import { getCollegeBySlug } from "@/lib/db/colleges";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const college = await getCollegeBySlug(params.slug);
    if (!college) {
      return NextResponse.json(
        { success: false, error: "College not found", code: 404 },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: college });
  } catch (err) {
    console.error(`[GET /api/colleges/${params.slug}]`, err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch college", code: 500 },
      { status: 500 }
    );
  }
}
