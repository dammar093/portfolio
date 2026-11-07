import { SeoType } from "@/generated/prisma/enums";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface SeoResponse {
  message: string;
  data: SeoItem;
}

export interface SeoItem {
  id: string;
  og_ttile: string;
  slug: string;
  og_description: string;
  og_image: string | null;
  keywords: string | null;
  schema_markup: JsonValue | null;
  seo_type: SeoType;
  page_id: string | null;
  setting_id: string | null;
  blog_id: string | null;
  createdAt: string;
  updatedAt: string;
}