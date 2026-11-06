"use client";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "../theme/Mode";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import useAuth from "@/hooks/useAuth";

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { logoutUser, isLoading } = useAuth();

  return (
    <header className="w-full h-20 md:h-16 flex items-center justify-between px-4 md:px-8  backdrop-blur-md sticky top-0 z-50">
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
        <Link
          href="/projects"
          className={` ${
            pathname === "/projects"
              ? "text-teal-500"
              : "dark:text-gray-200 text-gray-800 "
          } `}
        >
          Projects
        </Link>
        {session?.user.role === "ADMIN" && (
          <Link
            href="/admin/dashboard"
            className="dark:text-gray-200 text-gray-800"
          >
            Admin
          </Link>
        )}
        {session ? (
          <button
            type="button"
            onClick={logoutUser}
            disabled={isLoading}
            className="dark:text-gray-200 text-gray-800"
          >
            Log out
          </button>
        ) : (
          <>
            <Link href="/login" className="dark:text-gray-200 text-gray-800">
              User login
            </Link>
            <Link
              href="/admin/login"
              className="dark:text-gray-200 text-gray-800"
            >
              Admin login
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
