import { combineReducers } from 'redux';
import authReducer from "@/redux/slices/auth-slice";
import dashboardReducer from "@/app/admin/dashboard/_redux/dashboard-slice";
import pageReducer from "@/app/admin/pages/_redux/page-slice";
import languageReducer from "@/app/admin/languages/_redux/language-slice";
import serviceReducer from "@/app/admin/services/_redux/service-slice";
import experienceReducer from "@/app/admin/experiences/_redux/experience-slice";
import testimonialReducer from "@/app/admin/testimonials/_redux/testimonial-slice";
import faqReducer from "@/app/admin/faqs/_redux/faq-slice";
import blogReducer from "@/app/admin/blogs/_redux/blog-slice";
import projectReducer from "@/app/admin/projects/_redux/project-slice";
import contactReducer from "@/app/admin/contacts/_redux/contact-slice";
import settingReducer from "@/app/admin/site-settings/_redux/setting-slice";





import seoReducer from "@/redux/slices/seo-slice";


export const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  pages: pageReducer,
  languages: languageReducer,
  services: serviceReducer,
  experiences: experienceReducer,
  testimonials: testimonialReducer,
  faqs: faqReducer,
  blogs: blogReducer,
  projects: projectReducer,
  contacts: contactReducer,
  seo: seoReducer,
  setting: settingReducer,
});

