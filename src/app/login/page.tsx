"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuth } from "@/lib/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      if (data.needsVerification) {
        router.push(`/verify?email=${encodeURIComponent(data.email)}`);
        return;
      }
      setError(data.error || "Something went wrong.");
      return;
    }

    setUser(data.user);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif-display text-2xl font-bold mb-1">Sign in</h1>
      <p className="text-muted text-sm mb-6">Sign in to your account.</p>

      <GoogleSignInButton />

      <div className="flex items-center gap-3 my-6">
        <div className="h-px bg-line flex-1" />
        <span className="text-xs text-muted">OR</span>
        <div className="h-px bg-line flex-1" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent-dark transition-colors text-white font-medium py-2.5 rounded-lg disabled:opacity-60"
        >
          {loading ? "Please wait..." : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-muted mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-accent font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
