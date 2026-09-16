"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { ShieldCheck, Shield } from "lucide-react";

type UserRow = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  authProvider: string;
  isVerified: boolean;
  createdAt: string;
  articleCount: number;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(res.ok ? data.users : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRole(u: UserRow) {
    const newRole = u.role === "admin" ? "user" : "admin";
    if (newRole === "user" && !confirm(`Remove admin access from ${u.name}?`)) {
      return;
    }
    setBusyId(u._id);
    const res = await fetch(`/api/admin/users/${u._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((x) => (x._id === u._id ? { ...x, role: newRole } : x)),
      );
    }
    setBusyId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="font-serif-display text-2xl font-bold">Users</h1>
        <p className="text-sm text-muted">{users.length} total</p>
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <div className="border border-line rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-line text-muted">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Articles</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    {u.name}
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {u.email}
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-4 py-3">{u.articleCount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        u.role === "admin"
                          ? "bg-accent/10 text-accent"
                          : "bg-surface text-muted"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => toggleRole(u)}
                      disabled={
                        busyId === u._id || u._id === currentUser?.userId
                      }
                      title={
                        u._id === currentUser?.userId
                          ? "You can't change your own role"
                          : u.role === "admin"
                            ? "Remove admin access"
                            : "Make admin"
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-line hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {u.role === "admin" ? (
                        <Shield size={13} />
                      ) : (
                        <ShieldCheck size={13} />
                      )}
                      {u.role === "admin" ? "Remove admin" : "Make admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
