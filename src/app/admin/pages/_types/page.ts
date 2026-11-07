export type PageItem = {
  id: string;
  title: string;
  short_title: string;
  slug: string;
  image: string | null;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type PageQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PageListResponse = {
  success: boolean;
  message: string;
  data: PageItem[];
  meta: PaginationMeta;
};

export type PageResponse = {
  message: string;
  data: PageItem;
};