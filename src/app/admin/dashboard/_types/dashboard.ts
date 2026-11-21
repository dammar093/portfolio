export interface DashboardStatusCount {
  total: number;
  active: number;
  inactive: number;
}

export interface DashboardContactCount {
  total: number;
  unseen: number;
  seen: number;
}

export interface DashboardStats {
  users: number;
  projects: DashboardStatusCount;
  languages: DashboardStatusCount;
  services: DashboardStatusCount;
  testimonials: DashboardStatusCount;
  blogs: DashboardStatusCount;
  experiences: DashboardStatusCount;
  faqs: DashboardStatusCount;
  pages: number;
  contacts: DashboardContactCount;
  settings: number;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}
