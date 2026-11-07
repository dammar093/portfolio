import { Airplay, BaggageClaim, ChartColumnStacked, File, Newspaper } from "lucide-react";
import { FaBoxOpen, FaCubes, FaGlobe, FaQuestion } from "react-icons/fa";
import { HiOutlineViewGrid } from "react-icons/hi";
import { MdBuild, MdCategory, MdDashboard, MdExtension, MdInventory, MdPages, MdSettings } from "react-icons/md";
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
    title: "Product Categories",
    path: "/admin/product-categories?page=1&limit=10",
    icon: MdInventory,
  },
  {
    title: "Brands",
    path: "/admin/product-brands?page=1&limit=10",
    icon: MdExtension,
  },
  {
    title: "Products",
    path: "/admin/products?page=1&limit=10",
    icon: FaBoxOpen,
  },
  {
    title: "Packages",
    path: "/admin/packages?page=1&limit=10",
    icon: FaCubes,
  },
  {
    title: "Quotes",
    path: "/admin/quotes?page=1&limit=10",
    icon: Airplay,
  },
  {
    title: "Blog Categories",
    path: "/admin/blog-categories?page=1&limit=10",
    icon: ChartColumnStacked,
  },
  {
    title: "Blogs",
    path: "/admin/blogs?page=1&limit=10",
    icon: Newspaper,
  },
  {
    title: "Services",
    path: "/admin/services?page=1&limit=10",
    icon: MdBuild,
  },
  {
    title: "Features",
    path: "/admin/features?page=1&limit=10",
    icon: HiOutlineViewGrid,
  },
  {
    title: "Rebates",
    path: "/admin/rebates?page=1&limit=10",
    icon: BaggageClaim,
  },
  {
    title: "Case Study Categories",
    path: "/admin/case-study-categories?page=1&limit=10",
    icon: MdCategory,
  },
  {
    title: "Case Studies",
    path: "/admin/case-studies?page=1&limit=10",
    icon: File,
  },
  {
    title: "FAQs",
    path: "/admin/faqs?page=1&limit=10",
    icon: FaQuestion,
  },
  {
    title: "Site Settings",
    path: "/admin/site-settings",
    icon: MdSettings,
  },
];
