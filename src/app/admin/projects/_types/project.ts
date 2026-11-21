
export interface ProjectSeo {
  id: string;
  og_ttile: string;
  slug: string;
  og_description: string;
  og_image: string | null;
  keywords: string | null;
  schema_markup: unknown | null;
  seo_type: string;
  project_id: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectLanguageRelation {
  projectId: string;
  languageId: string;
  language?: {
    id: string;
    name: string;
    image: string | null;
  };
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  link: string;
  order: number;
  isActive: boolean;
  languages: ProjectLanguageRelation[];
  seo?: ProjectSeo | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ProjectPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProjectListResponse {
  success: boolean;
  message: string;
  data: ProjectItem[];
  usedSlugs: string[];
  meta: ProjectPaginationMeta;
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: ProjectItem;
}

export interface ProjectErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, unknown>;
}
