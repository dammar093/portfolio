
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ==============================
// QUERY PARAMS
// ==============================
export interface ServiceQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

// ==============================
// PAGINATION
// ==============================
export interface ServicePaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ==============================
// API RESPONSES
// ==============================
export interface ServiceListResponse {
  success: boolean;
  message: string;
  data: ServiceItem[];
  meta: ServicePaginationMeta;
}

export interface ServiceResponse {
  success: boolean;
  message: string;
  data: ServiceItem;
}

// ==============================
// FORM VALUES
// ==============================
export interface ServiceFormValues {
  title: string;
  description: string;
  order: number;
  image: File | null;
  isActive: boolean;
}

// ==============================
// CREATE INPUT
// ==============================
export interface ServiceCreateInput {
  title: string;
  description: string;
  order: number;
  image?: File | null;
  isActive: boolean;
}

// ==============================
// UPDATE INPUT
// ==============================
export interface ServiceUpdateInput {
  title?: string;
  description?: string;
  order?: number;
  image?: File | null;
  isActive?: boolean;
}

// ==============================
// API ERROR RESPONSE
// ==============================
export interface ServiceErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, unknown>;
}
