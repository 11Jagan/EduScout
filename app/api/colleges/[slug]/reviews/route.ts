import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

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

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { collegeId: college.id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where: { collegeId: college.id } }),
    ]);

    return NextResponse.json({
      success: true,
      data: reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
      meta: { page, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error(`[GET /api/colleges/${params.slug}/reviews]`, err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews", code: 500 },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
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
    const body = await req.json();
    const { authorName, batchYear, rating, content, courseTaken } = body;

    if (!authorName || !batchYear || !rating || !content || !courseTaken) {
      return NextResponse.json(
        { success: false, error: "All fields are required", code: 400 },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        collegeId: college.id,
        authorName,
        batchYear: Number(batchYear),
        rating: Number(rating),
        content,
        courseTaken,
      },
    });
    return NextResponse.json(
      { success: true, data: { ...review, createdAt: review.createdAt.toISOString() } },
      { status: 201 }
    );
  } catch (err) {
    console.error(`[POST /api/colleges/${params.slug}/reviews]`, err);
    return NextResponse.json(
      { success: false, error: "Failed to submit review", code: 500 },
      { status: 500 }
    );
  }
}
