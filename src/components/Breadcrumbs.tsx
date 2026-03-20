"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import * as React from "react";

type Crumb = {
  label: string;
  href: string;
  isCurrent: boolean;
};

function titleCase(input: string) {
  return input
    .replace(/[-_]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getCrumbs(pathname: string): Crumb[] {
  const normalized = pathname.replace(/\/+$/, "") || "/";

  const specialLabels: Record<string, string> = {
    "/": "Dashboard",
    "/clients": "Clients",
    "/campaigns": "Campaigns",
    "/campaigns/results": "Composer",
    "/history": "History",
    "/import": "Integrations",
    "/settings": "Settings",
    "/forgot-password": "Forgot Password",
    "/login": "Login",
    "/register": "Register",
    "/update-password": "Update Password",
    "/pending": "Pending",
    "/banned": "Banned",
    "/admin": "Control Panel",
  };

  if (normalized === "/") {
    return [{ label: specialLabels["/"] ?? "Dashboard", href: "/", isCurrent: true }];
  }

  const segments = normalized.split("/").filter(Boolean);

  const crumbs: Crumb[] = [];
  for (let i = 0; i < segments.length; i++) {
    const href = `/${segments.slice(0, i + 1).join("/")}`;
    const fullPathLabel = specialLabels[href];
    const label = fullPathLabel ?? titleCase(segments[i] ?? "");
    crumbs.push({ label, href, isCurrent: i === segments.length - 1 });
  }

  // Ensure the first crumb is "Dashboard" (instead of empty) if the user is at a top-level route.
  // For example: /clients -> Dashboard / Clients
  const topLevelHref = `/${segments[0]}`;
  if (crumbs.length > 0 && crumbs[0].href === topLevelHref) {
    crumbs.unshift({
      label: specialLabels["/"] ?? "Dashboard",
      href: "/",
      isCurrent: crumbs.length === 1,
    });
    // Current crumb should be the last one, after insertion.
    crumbs.forEach((c, idx) => {
      c.isCurrent = idx === crumbs.length - 1;
    });
  }

  return crumbs;
}

export function Breadcrumbs({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const pathname = usePathname();

  const crumbs = React.useMemo(() => getCrumbs(pathname), [pathname]);

  // If something unexpected happens, fail closed with nothing.
  if (!crumbs.length) return null;

  const isDark = variant === "dark";

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={[
          "flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest",
          isDark ? "text-slate-200" : "",
        ].join(" ")}
      >
        {crumbs.map((c, idx) => (
          <React.Fragment key={c.href}>
            {idx !== 0 && (
              <ChevronRight
                className={[
                  "w-3.5 h-3.5",
                  isDark ? "text-slate-600" : "text-slate-300",
                ].join(" ")}
                aria-hidden
              />
            )}
            {c.isCurrent ? (
              <span className={isDark ? "text-blue-300" : "text-blue-700"}>{c.label}</span>
            ) : (
              <Link
                className={[
                  isDark ? "text-slate-300 hover:text-blue-200" : "text-slate-500 hover:text-blue-600",
                  "transition-colors",
                ].join(" ")}
                href={c.href}
              >
                {c.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

