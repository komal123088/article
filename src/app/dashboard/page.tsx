"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { ArticleType } from "@/types";
import { PenLine, Trash2, Pencil, Eye, User as UserIcon } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch("/api/articles/mine")
      .then((res) => res.json())
      .then((data) => setArticles(data.articles || []))
      .finally(() => setLoading(false));
  }, [user]);

  async function remove(id: string) {
    if (!confirm("Delete this article?")) return;
    setBusyId(id);
    await fetch(`/api/articles/mine/${id}`, { method: "DELETE" });
    setArticles((prev) => prev.filter((a) => a._id !== id));
    setBusyId(null);
  }

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-serif-display text-2xl font-bold mb-2">
          Sign in to continue
        </h1>
        <p className="text-muted mb-6">
          You need an account to view your dashboard.
        </p>
        <Link
          href="/login"
          className="bg-accent text-white px-5 py-2.5 rounded-lg font-medium"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Profile card */}
      <div className="flex items-center justify-between flex-wrap gap-4 border border-line rounded-lg p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center text-xl font-semibold shrink-0">
            {user.name?.[0]?.toUpperCase() || <UserIcon size={22} />}
          </div>
          <div>
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-sm text-muted">{user.email}</p>
            {user.role === "admin" && (
              <span className="inline-block mt-1 text-xs font-medium bg-surface border border-line px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </div>
        </div>

        <Link
          href="/dashboard/new"
          className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-sm font-medium px-4 py-2.5 rounded-full"
        >
          <PenLine size={16} /> Write new article
        </Link>
      </div>

      {/* My articles */}
      <h2 className="font-serif-display text-xl font-bold mb-4">
        Your articles
      </h2>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : articles.length === 0 ? (
        <p className="text-muted">
          You haven&apos;t submitted any articles yet.{" "}
          <Link href="/dashboard/new" className="text-accent font-medium">
            Write your first one
          </Link>
          .
        </p>
      ) : (
        <div className="divide-y divide-line border-t border-line">
          {articles.map((a) => (
            <div
              key={a._id}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{a.title}</p>
                <p className="text-xs text-muted mt-1">
                  {a.category} &middot;{" "}
                  <span
                    className={
                      a.status === "published"
                        ? "text-green-700"
                        : "text-amber-700"
                    }
                  >
                    {a.status}
                  </span>{" "}
                  &middot; {a.views} views
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {a.status === "published" && (
                  <Link
                    href={`/article/${a.slug}`}
                    target="_blank"
                    className="p-2 rounded-full hover:bg-surface"
                    title="View live"
                  >
                    <Eye size={16} />
                  </Link>
                )}
                <Link
                  href={`/dashboard/edit/${a._id}`}
                  className="p-2 rounded-full hover:bg-surface"
                  title="Edit"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => remove(a._id)}
                  disabled={busyId === a._id}
                  className="p-2 rounded-full hover:bg-surface text-red-600 disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
