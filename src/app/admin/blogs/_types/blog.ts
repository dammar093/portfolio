
export interface BlogSeo {
  id: string;
  og_ttile: string;
  slug: string;
  og_description: string;
  og_image: string | null;
  keywords: string | null;
  schema_markup: Record<string, unknown> | null;
  seo_type: string;
  blog_id: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  isActive: boolean;
  seo?: BlogSeo | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface BlogPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BlogListResponse {
  success: boolean;
  message: string;
  data: BlogItem[];
  usedSlugs: string[];
  meta: BlogPaginationMeta;
}

export interface BlogResponse {
  success: boolean;
  message: string;
  data: BlogItem;
}

export interface BlogCreateInput {
  title: string;
  slug: string;
  description: string;
  isActive: boolean;
}

export interface BlogUpdateInput {
  title?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

export interface BlogFormValues {
  title: string;
  slug: string;
  description: string;
  isActive: boolean;
}

export interface BlogErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, unknown>;
}
