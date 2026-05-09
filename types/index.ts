// ─── Enums ───────────────────────────────────────────────────────────────────

export type CollegeType =
  | "IIT"
  | "NIT"
  | "AIIMS"
  | "IIM"
  | "DEEMED"
  | "CENTRAL_UNIVERSITY"
  | "STATE_UNIVERSITY"
  | "PRIVATE";

export type DegreeLevel = "UNDERGRADUATE" | "POSTGRADUATE" | "DOCTORATE";
export type ExamType = "JEE_MAIN" | "JEE_ADVANCED" | "NEET";
export type Category = "GENERAL" | "OBC" | "SC" | "ST" | "EWS";
export type ChanceLevel = "HIGH" | "MEDIUM" | "LOW";

// ─── Core Models ─────────────────────────────────────────────────────────────

export interface CollegeTag {
  id: number;
  collegeId: number;
  tag: string;
}

export interface College {
  id: number;
  name: string;
  slug: string;
  location: string;
  state: string;
  feesPerYear: number;
  rating: number;
  type: CollegeType;
  established: number;
  naacGrade: string;
  placementPercent: number;
  avgPackage: number;
  topPackage: number;
  logoUrl: string | null;
  createdAt: string;
  tags: CollegeTag[];
}

export interface Course {
  id: number;
  collegeId: number;
  name: string;
  durationYears: number;
  seats: number;
  feesPerYear: number;
  degreeLevel: DegreeLevel;
}

export interface Placement {
  id: number;
  collegeId: number;
  year: number;
  placementPercent: number;
  avgPackage: number;
  topPackage: number;
  medianPackage: number;
  companiesVisited: number;
}

export interface Review {
  id: number;
  collegeId: number;
  authorName: string;
  batchYear: number;
  rating: number;
  content: string;
  courseTaken: string;
  createdAt: string;
}

export interface CollegeInfo {
  id: number;
  collegeId: number;
  about: string;
  accreditations: string;
  campusAreaAcres: number | null;
  hostelAvailable: boolean;
  scholarshipAvailable: boolean;
  websiteUrl: string | null;
}

export interface PredictorCutoff {
  id: number;
  collegeId: number;
  exam: ExamType;
  category: Category;
  openingRank: number;
  closingRank: number;
  year: number;
  branch: string;
}

// ─── Extended / Composite Types ──────────────────────────────────────────────

export interface CollegeDetail extends College {
  collegeInfo: CollegeInfo | null;
  courses: Course[];
  placements: Placement[];
  reviews: Review[];
}

export interface PredictorResult {
  college: College;
  chance: ChanceLevel;
  matchingBranches: string[];
  cutoffRank: number;
}

// ─── API Response Shapes ─────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: {
    page: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
  code: number;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface CollegeListParams {
  search?: string;
  state?: string;
  type?: string;
  fees_range?: string;
  page?: number;
  limit?: number;
}
