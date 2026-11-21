
export interface ContactItem {
  id: string;
  fullname: string;
  email: string;
  forWhat: string;
  message: string;
  isSeen: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ContactPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ContactListResponse {
  success: boolean;
  message: string;
  data: ContactItem[];
  meta: ContactPaginationMeta;
  unseenCount: number;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data: ContactItem;
}

export interface ContactQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isSeen?: boolean;
}
