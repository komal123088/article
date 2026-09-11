"use client";

import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { ShieldAlert, FilePlus2, ListChecks } from "lucide-react";

export default function AdminHomePage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShieldAlert className="mx-auto text-accent mb-3" size={32} />
        <h1 className="font-serif-display text-2xl font-bold mb-2">Admin access only</h1>
        <p className="text-muted">
          You need an admin account to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif-display text-3xl font-bold mb-2">Admin dashboard</h1>
      <p className="text-muted mb-10">Welcome back, {user.name}.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/articles"
          className="flex items-center gap-4 border border-line rounded-lg p-5 hover:border-accent transition-colors"
        >
          <ListChecks className="text-accent" size={28} />
          <div>
            <p className="font-semibold">Manage articles</p>
            <p className="text-sm text-muted">Review, approve, edit or delete posts</p>
          </div>
        </Link>

        <Link
          href="/admin/articles/new"
          className="flex items-center gap-4 border border-line rounded-lg p-5 hover:border-accent transition-colors"
        >
          <FilePlus2 className="text-accent" size={28} />
          <div>
            <p className="font-semibold">Add new article</p>
            <p className="text-sm text-muted">Publish an article directly</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
