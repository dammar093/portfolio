"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { pageOptions } from "@/app/admin/pages/_schema/page-schema";
import { ModeToggle } from "../theme/Mode";
import Container from "./Container";

const Header = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Home is exact-match only; other pages are active for their children too
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const links = [
    { href: "/", label: "Home" },
    ...pageOptions.map(({ slug, title }) => ({ href: `/${slug}`, label: title })),
  ];

  // Close the menu when the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const linkClass = (href: string) =>
    `capitalize transition-colors hover:text-teal-500 ${
      isActive(href) ? "text-teal-500" : "text-gray-800 dark:text-gray-200"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md">
      <Container>
        <div className="flex h-16 w-full items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Home"
            className="font-mono text-xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            <span className="text-teal-500">&lt;</span>D
            <span className="text-teal-500">/&gt;</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Desktop nav */}
            <nav className="hidden h-10 items-center space-x-5 rounded-3xl border border-gray-200 px-6 shadow-sm dark:border-white/10 md:flex">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={linkClass(href)}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <ModeToggle />

            {/* Hamburger (mobile) */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-800 transition hover:border-teal-500 dark:border-white/10 dark:text-gray-200 md:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav
            id="mobile-menu"
            className="absolute inset-x-0 top-full border-b border-gray-200 bg-white p-4 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-[#18181B] md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive(href) ? "page" : undefined}
                    className={`block rounded-xl px-4 py-3 text-base font-medium ${linkClass(href)} ${
                      isActive(href)
                        ? "bg-teal-500/10"
                        : "hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </Container>
    </header>
  );
};

export default Header;
