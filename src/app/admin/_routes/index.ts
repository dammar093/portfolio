import { Newspaper } from "lucide-react";
import { FaGlobe, FaQuestion } from "react-icons/fa";
import {
  MdBuild,
  MdContactMail,
  MdDashboard,
  MdExtension,
  MdInventory,
  MdPages,
  MdSettings,
  MdWork,
} from "react-icons/md";
export const adminRoutes = [
  {
    title: "View Site",
    path: "/",
    icon: FaGlobe,
  },
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: MdDashboard,
  },
  {
    title: "Pages",
    path: "/admin/pages?page=1&limit=10",
    icon: MdPages,
  },
  {
    title: "Tools/Languages",
    path: "/admin/languages?page=1&limit=10",
    icon: MdInventory,
  },
  {
    title: "Projects",
    path: "/admin/projects?page=1&limit=10",
    icon: MdExtension,
  },
  {
    title: "Services",
    path: "/admin/services?page=1&limit=10",
    icon: MdBuild,
  },
  {
    title: "Experience",
    path: "/admin/experiences?page=1&limit=10",
    icon: MdWork,
  },
  {
    title: "Blogs",
    path: "/admin/blogs?page=1&limit=10",
    icon: Newspaper,
  },
  {
    title: "FAQs",
    path: "/admin/faqs?page=1&limit=10",
    icon: FaQuestion,
  },

  {
    title: "Contacts",
    path: "/admin/contacts?page=1&limit=10",
    icon: MdContactMail,
  },
  {
    title: "Site Settings",
    path: "/admin/site-settings",
    icon: MdSettings,
  },
];
