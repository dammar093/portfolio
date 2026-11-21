
export type LanguageItem = {
  id: string;
  name: string;
  image: string | null;
  order: number;
  _count?: {
    projects: number;
  };
  createdAt: string;
  updatedAt: string;
};

export type LanguageQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type LanguagePaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type LanguageListResponse = {
  success: boolean;
  message: string;
  data: LanguageItem[];
  meta: LanguagePaginationMeta;
};

export type LanguageResponse = {
  success?: boolean;
  message: string;
  data: LanguageItem;
};

export type LanguageFormValues = {
  name: string;
  order: number;
  image: File | null;
};
