"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, PenLine, LogOut, User as UserIcon, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { CATEGORIES } from "@/lib/categories";
import { ArticleType } from "@/types";

type Props = {
  categoryPreviews?: Record<string, ArticleType[]>;
};

export default function Navbar({ categoryPreviews = {} }: Props) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { user, setUser, loading } = useAuth();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-line">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-2 text-xs text-muted border-b border-line">
          <span>{today}</span>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-accent">About</Link>
            <Link href="/dashboard/new" className="hover:text-accent">Write for us</Link>
            <Link href="/contact" className="hover:text-accent">Contact</Link>
            {!loading && user?.role === "admin" && (
              <Link href="/admin/articles" className="hover:text-accent flex items-center gap-1">
                <ShieldCheck size={12} /> Admin
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <Link href="/" className="font-serif-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Today<span className="text-accent">Magazine</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {CATEGORIES.map((cat) => (
              <div
                key={cat}
                className="relative"
                onMouseEnter={() => setHovered(cat)}
                onMouseLeave={() => setHovered((h) => (h === cat ? null : h))}
              >
                <Link
                  href={`/category/${cat.toLowerCase()}`}
                  className="uppercase tracking-wide hover:text-accent transition-colors py-2 inline-block"
                >
                  {cat}
                </Link>

                {hovered === cat && (categoryPreviews[cat]?.length ?? 0) > 0 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[520px] z-50">
                    <div className="bg-white border border-line rounded-lg shadow-lg p-4 grid grid-cols-2 gap-4">
                      {categoryPreviews[cat].slice(0, 4).map((a) => (
                        <Link
                          key={a._id}
                          href={`/article/${a.slug}`}
                          className="flex gap-3 group"
                        >
                          {a.coverImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={a.coverImage}
                              alt={a.title}
                              className="w-16 h-16 object-cover rounded shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-surface rounded shrink-0" />
                          )}
                          <span className="text-sm font-medium leading-snug normal-case group-hover:text-accent transition-colors line-clamp-3">
                            {a.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Search"
              className="p-2 rounded-full hover:bg-surface transition-colors"
            >
              <Search size={18} />
            </button>

            {!loading && user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/dashboard/new"
                  className="flex items-center gap-1.5 bg-accent hover:bg-accent-dark transition-colors text-white text-sm font-medium px-3 py-2 rounded-full"
                >
                  <PenLine size={15} /> Write
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-surface transition-colors"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              !loading && (
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-1.5 bg-accent hover:bg-accent-dark transition-colors text-white text-sm font-medium px-4 py-2 rounded-full"
                >
                  <UserIcon size={15} /> Sign in
                </Link>
              )
            )}

            <button
              className="lg:hidden p-2 rounded-full hover:bg-surface"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form
            className="pb-4"
            onSubmit={(e) => {
              e.preventDefault();
              const q = (e.target as any).q.value;
              window.location.href = `/?search=${encodeURIComponent(q)}`;
            }}
          >
            <input
              name="q"
              placeholder="Search articles..."
              className="w-full rounded-full px-4 py-2 text-sm text-foreground bg-surface border border-line focus:outline-none"
              autoFocus
            />
          </form>
        )}

        {open && (
          <nav className="lg:hidden pb-4 flex flex-col gap-3 text-sm font-medium border-t border-line pt-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="uppercase tracking-wide hover:text-accent"
              >
                {cat}
              </Link>
            ))}
            <div className="border-t border-line pt-3 mt-1">
              {user ? (
                <div className="flex flex-col gap-3">
                  {user.role === "admin" && (
                    <Link href="/admin/articles" className="text-accent font-semibold">
                      Admin dashboard
                    </Link>
                  )}
                  <Link href="/dashboard/new" className="text-accent font-semibold">
                    Write an article
                  </Link>
                  <button onClick={handleLogout} className="text-left text-muted">
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" className="text-accent font-semibold">
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
