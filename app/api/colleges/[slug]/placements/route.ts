import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const college = await prisma.college.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });
    if (!college) {
      return NextResponse.json(
        { success: false, error: "College not found", code: 404 },
        { status: 404 }
      );
    }
    const placements = await prisma.placement.findMany({
      where: { collegeId: college.id },
      orderBy: { year: "desc" },
    });
    return NextResponse.json({ success: true, data: placements });
  } catch (err) {
    console.error(`[GET /api/colleges/${params.slug}/placements]`, err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch placements", code: 500 },
      { status: 500 }
    );
  }
}
