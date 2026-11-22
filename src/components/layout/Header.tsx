"use client";
import { pages } from "@/app/admin/pages/_schema/page-schema";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../theme/Mode";

const Header = () => {
  const pathname = usePathname();
  return (
    <header className="w-full h-20 md:h-16 flex items-center justify-between  backdrop-blur-md sticky top-0 z-50">
      <div>
        <ModeToggle />
      </div>
      <nav className="flex items-center justify-center h-10 px-6 space-x-4 border border-gray-50 shadow rounded-3xl">
        <Link
          href="/"
          className={` ${
            pathname === "/"
              ? "text-teal-500"
              : "dark:text-gray-200 text-gray-800 "
          } `}
        >
          Home
        </Link>
        {pages.map((page) => (
          <Link
            key={page}
            href={`/${page}`}
            className={` ${
              pathname === `/${page}`
                ? "text-teal-500"
                : "dark:text-gray-200 text-gray-800 "
            } capitalize `}
          >
            {page}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
