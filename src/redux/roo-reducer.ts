import { combineReducers } from 'redux';
import authReducer from "@/redux/slices/auth-slice";
import dashboardReducer from "@/app/admin/dashboard/_redux/dashboard-slice";
import pageReducer from "@/app/admin/pages/_redux/page-slice";
import seoReducer from "@/redux/slices/seo-slice";

export const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  pages: pageReducer,
  seo: seoReducer,
});

