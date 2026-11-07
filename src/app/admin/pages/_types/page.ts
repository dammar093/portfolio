import { SeoItem } from "@/types/seo-type";

export type PageItem = {
  id: string;
  title: string;
  short_title: string;
  slug: string;
  image: string | null;
  description: string;
  seo: SeoItem | null;
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
  usedSlugs: string[];
  meta: PaginationMeta;
};

export type PageResponse = {
  message: string;
  data: PageItem;
};