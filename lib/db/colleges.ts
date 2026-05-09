import { prisma } from "@/lib/prisma";
import { feesRangeToFilter } from "@/lib/utils";
import { CollegeListParams } from "@/types";

const collegeSelect = {
  id: true,
  name: true,
  slug: true,
  location: true,
  state: true,
  feesPerYear: true,
  rating: true,
  type: true,
  established: true,
  naacGrade: true,
  placementPercent: true,
  avgPackage: true,
  topPackage: true,
  logoUrl: true,
  createdAt: true,
  tags: true,
} as const;

export async function getColleges(params: CollegeListParams) {
  const {
    search = "",
    state = "",
    type = "",
    fees_range = "",
    page = 1,
    limit = 9,
  } = params;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { state: { contains: search, mode: "insensitive" } },
    ];
  }
  if (state) where.state = { equals: state, mode: "insensitive" };
  if (type) where.type = type;
  if (fees_range) {
    const feesFilter = feesRangeToFilter(fees_range);
    where.feesPerYear = feesFilter;
  }

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      select: collegeSelect,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { rating: "desc" },
    }),
    prisma.college.count({ where }),
  ]);

  return {
    colleges: colleges.map(serializeCollege),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getCollegeBySlug(slug: string) {
  const college = await prisma.college.findUnique({
    where: { slug },
    include: {
      tags: true,
      collegeInfo: true,
      courses: { orderBy: { feesPerYear: "asc" } },
      placements: { orderBy: { year: "desc" } },
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!college) return null;
  fillMockRelationalData(college);
  return serializeCollegeDetail(college);
}

export async function getCollegesForCompare(ids: number[]) {
  const colleges = await prisma.college.findMany({
    where: { id: { in: ids } },
    include: {
      tags: true,
      collegeInfo: true,
      courses: true,
      placements: { orderBy: { year: "desc" }, take: 1 },
      reviews: true,
    },
  });
  colleges.forEach(fillMockRelationalData);
  return colleges.map(serializeCollegeDetail);
}

// ─── Dynamic Mock Data Injector ──────────────────────────────────────────────

function fillMockRelationalData(college: any) {
  if (!college.courses || college.courses.length === 0) {
    college.courses = [
      { id: -1, collegeId: college.id, name: "B.Tech Computer Science", durationYears: 4, seats: 120, feesPerYear: college.feesPerYear, degreeLevel: "UNDERGRADUATE" },
      { id: -2, collegeId: college.id, name: "B.Tech Electronics", durationYears: 4, seats: 100, feesPerYear: college.feesPerYear, degreeLevel: "UNDERGRADUATE" },
      { id: -3, collegeId: college.id, name: "M.Tech Data Science", durationYears: 2, seats: 40, feesPerYear: college.feesPerYear, degreeLevel: "POSTGRADUATE" },
    ];
  }
  if (!college.collegeInfo) {
    college.collegeInfo = {
      id: -1, collegeId: college.id, about: `${college.name} is a prestigious institution located in ${college.location}, providing top-tier education and excellent placement opportunities.`,
      accreditations: college.naacGrade ? `NAAC ${college.naacGrade}` : "UGC Recognized",
      campusAreaAcres: 100 + Math.floor(Math.random() * 200),
      hostelAvailable: true, scholarshipAvailable: true, websiteUrl: null
    };
  }
  if (!college.placements || college.placements.length === 0) {
    college.placements = [
      { id: -1, collegeId: college.id, year: 2024, placementPercent: college.placementPercent, avgPackage: college.avgPackage, topPackage: college.topPackage, medianPackage: Math.round(college.avgPackage * 0.8), companiesVisited: 150 },
      { id: -2, collegeId: college.id, year: 2023, placementPercent: Math.max(0, college.placementPercent - 2), avgPackage: Math.round(college.avgPackage * 0.9), topPackage: Math.round(college.topPackage * 0.9), medianPackage: Math.round(college.avgPackage * 0.7), companiesVisited: 140 },
    ];
  }
  if (!college.reviews || college.reviews.length === 0) {
    college.reviews = [
      { id: -1, collegeId: college.id, authorName: "Current Student", batchYear: 2024, rating: college.rating, content: "Great faculty and environment. The placement support is excellent and campus life is vibrant.", courseTaken: "B.Tech CSE", createdAt: new Date() }
    ];
  }
}

// ─── Serialisers (converts Date → string, BigInt → number) ───────────────────

function serializeCollege(c: Record<string, unknown> & { createdAt: Date; tags: unknown[] }) {
  return {
    ...c,
    createdAt: c.createdAt.toISOString(),
    tags: c.tags,
  };
}

function serializeCollegeDetail(
  c: Record<string, unknown> & {
    createdAt: Date;
    tags: unknown[];
    reviews?: Array<Record<string, unknown> & { createdAt: Date }>;
  }
) {
  return {
    ...c,
    createdAt: c.createdAt.toISOString(),
    tags: c.tags,
    reviews: c.reviews?.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  };
}
