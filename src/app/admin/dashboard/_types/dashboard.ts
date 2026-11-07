/* ========================= */
/* Quote Stats */
/* ========================= */

export interface QuoteStats {
  total: number;
  pending: number;
  contacted: number;
  processing: number;
  cancelled: number;
}

/* ========================= */
/* Generic Active/Inactive Stats */
/* ========================= */

export interface EntityStatusStats {
  total: number;
  active: number;
  inactive: number;
}

/* ========================= */
/* Dashboard Data */
/* ========================= */

export interface DashboardStatsData {
  quotes: QuoteStats;
  products: EntityStatusStats;
  services: EntityStatusStats;
  blogs: EntityStatusStats;
  packages: EntityStatusStats;
}

/* ========================= */
/* Full API Response */
/* ========================= */

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: DashboardStatsData;
}
