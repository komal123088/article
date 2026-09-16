"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  PenLine,
  ArrowLeft,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/articles/new", label: "Add article", icon: PenLine },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-56 shrink-0">
      <div className="md:sticky md:top-24">
        <p className="font-serif-display text-lg font-bold mb-4 px-2">Admin</p>
        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {links.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-accent text-white"
                    : "text-foreground hover:bg-surface"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/"
          className="hidden md:flex items-center gap-2 px-3 py-2 mt-6 text-sm text-muted hover:text-accent"
        >
          <ArrowLeft size={15} /> Back to site
        </Link>
      </div>
    </aside>
  );
}
