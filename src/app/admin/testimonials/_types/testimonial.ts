
export interface TestimonialItem {
  id: string;
  name: string;
  avatar: string | null;
  position: string;
  company: string;
  testimonial: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface TestimonialPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TestimonialListResponse {
  success: boolean;
  message: string;
  data: TestimonialItem[];
  meta: TestimonialPaginationMeta;
}

export interface TestimonialResponse {
  success: boolean;
  message: string;
  data: TestimonialItem;
}

export interface TestimonialFormValues {
  name: string;
  avatar: File | null;
  position: string;
  company: string;
  testimonial: string;
  order: number;
  isActive: boolean;
}

export interface TestimonialCreateInput {
  name: string;
  avatar?: File | null;
  position: string;
  company: string;
  testimonial: string;
  order: number;
  isActive: boolean;
}

export interface TestimonialUpdateInput {
  name?: string;
  avatar?: File | null;
  position?: string;
  company?: string;
  testimonial?: string;
  order?: number;
  isActive?: boolean;
}

export interface TestimonialErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, unknown>;
}
