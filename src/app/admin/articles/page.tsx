"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { ArticleType } from "@/types";
import { ShieldAlert, CheckCircle2, Pencil, Trash2, Eye } from "lucide-react";

type Tab = "all" | "pending" | "published";

export default function AdminArticlesPage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("pending");
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadArticles() {
    setLoading(true);
    const qs = tab === "all" ? "" : `?status=${tab}`;
    const res = await fetch(`/api/admin/articles${qs}`);
    const data = await res.json();
    setArticles(res.ok ? data.articles : []);
    setLoading(false);
  }

  useEffect(() => {
    if (user?.role === "admin") loadArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, user]);

  async function approve(id: string) {
    setBusyId(id);
    await fetch(`/api/admin/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published" }),
    });
    await loadArticles();
    setBusyId(null);
  }

  async function unpublish(id: string) {
    setBusyId(id);
    await fetch(`/api/admin/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "pending" }),
    });
    await loadArticles();
    setBusyId(null);
  }

  async function remove(id: string) {
    if (!confirm("Delete this article permanently?")) return;
    setBusyId(id);
    await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    await loadArticles();
    setBusyId(null);
  }

  if (authLoading) return null;

  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShieldAlert className="mx-auto text-accent mb-3" size={32} />
        <h1 className="font-serif-display text-2xl font-bold mb-2">
          Admin access only
        </h1>
        <p className="text-muted">
          You need an admin account to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="font-serif-display text-2xl font-bold">
          Manage articles
        </h1>
        <Link
          href="/admin/articles/new"
          className="bg-accent hover:bg-accent-dark text-white text-sm font-medium px-4 py-2 rounded-full"
        >
          + Add article
        </Link>
      </div>

      <div className="flex gap-2 mb-6 border-b border-line">
        {(["pending", "published", "all"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              tab === t
                ? "border-accent text-accent"
                : "border-transparent text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : articles.length === 0 ? (
        <p className="text-muted">No articles found in this tab.</p>
      ) : (
        <div className="divide-y divide-line">
          {articles.map((a) => (
            <div
              key={a._id}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{a.title}</p>
                <p className="text-xs text-muted mt-1">
                  {a.category} &middot; by {a.authorName} &middot;{" "}
                  <span
                    className={
                      a.status === "published"
                        ? "text-green-700"
                        : "text-amber-700"
                    }
                  >
                    {a.status}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {a.status === "published" ? (
                  <>
                    <Link
                      href={`/article/${a.slug}`}
                      target="_blank"
                      className="p-2 rounded-full hover:bg-surface"
                      title="View live"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => unpublish(a._id)}
                      disabled={busyId === a._id}
                      className="text-xs font-medium px-3 py-1.5 rounded-full border border-line hover:border-accent disabled:opacity-50"
                    >
                      Unpublish
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => approve(a._id)}
                    disabled={busyId === a._id}
                    className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-accent text-white hover:bg-accent-dark disabled:opacity-50"
                  >
                    <CheckCircle2 size={14} /> Approve
                  </button>
                )}
                <Link
                  href={`/admin/articles/${a._id}/edit`}
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
