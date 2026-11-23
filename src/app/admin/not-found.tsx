import Link from "next/link";
import { ArrowLeft, LayoutDashboard, SearchX } from "lucide-react";

export default function AdminNotFound() {
  return (
    <section className="relative flex min-h-[65vh] items-center justify-center overflow-hidden px-4 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 size-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl rounded-3xl border border-border bg-card px-6 py-10 text-center text-card-foreground shadow-xl sm:px-12 sm:py-14">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
          <SearchX size={30} strokeWidth={1.8} />
        </div>

        <p className="font-mono text-7xl font-bold tracking-[-0.08em] text-muted-foreground/20 sm:text-8xl">
          404
        </p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
          Admin page not found
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          This page isn’t in your dashboard.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
          The address may be incorrect, or this admin page may have moved. Head
          back to your dashboard to continue.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/admin/dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <LayoutDashboard size={17} />
            Go to dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 font-semibold text-foreground transition hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeft size={17} />
            Visit site
          </Link>
        </div>
      </div>
    </section>
  );
}
