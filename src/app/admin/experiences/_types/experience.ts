
import type { EmploymentType } from "../_schema/experience-schema";
import type {
  experienceCreateSchema,
} from "../_schema/experience-schema";
import type { z } from "zod";

// ==============================
// EXPERIENCE ITEM
// ==============================
export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  employmentType: EmploymentType;
  location: string | null;
  description: string;
  joinDate: string;
  leaveDate: string | null;
  isCurrent: boolean;
  image: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==============================
// QUERY PARAMS
// ==============================
export interface ExperienceQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

// ==============================
// PAGINATION
// ==============================
export interface ExperiencePaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ==============================
// API RESPONSES
// ==============================
export interface ExperienceListResponse {
  success: boolean;
  message: string;
  data: ExperienceItem[];
  meta: ExperiencePaginationMeta;
}

export interface ExperienceResponse {
  success: boolean;
  message: string;
  data: ExperienceItem;
}

// ==============================
// FORM VALUES
// ==============================
export type ExperienceFormValues = z.input<
  typeof experienceCreateSchema
>;

// ==============================
// CREATE INPUT
// ==============================
export interface ExperienceCreateInput {
  company: string;
  position: string;
  employmentType: EmploymentType;
  location?: string;
  description: string;
  joinDate: Date | string;
  leaveDate?: Date | string | null;
  isCurrent: boolean;
  order: number;
  isActive: boolean;
  image?: File | null;
}

// ==============================
// UPDATE INPUT
// ==============================
export interface ExperienceUpdateInput {
  company?: string;
  position?: string;
  employmentType?: EmploymentType;
  location?: string;
  description?: string;
  joinDate?: Date | string;
  leaveDate?: Date | string | null;
  isCurrent?: boolean;
  order?: number;
  isActive?: boolean;
  image?: File | null;
}

// ==============================
// API ERROR RESPONSE
// ==============================
export interface ExperienceErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, unknown>;
}
