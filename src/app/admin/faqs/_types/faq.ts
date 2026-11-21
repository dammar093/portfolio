
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FAQQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface FAQPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FAQListResponse {
  success: boolean;
  message: string;
  data: FAQItem[];
  meta: FAQPaginationMeta;
}

export interface FAQResponse {
  success: boolean;
  message: string;
  data: FAQItem;
}

export interface FAQCreateInput {
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export interface FAQUpdateInput {
  question?: string;
  answer?: string;
  order?: number;
  isActive?: boolean;
}

export interface FAQFormValues {
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export interface FAQErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, unknown>;
}
