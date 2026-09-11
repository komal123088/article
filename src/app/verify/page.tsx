"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }

    router.push("/dashboard/new");
    router.refresh();
  }

  async function handleResend() {
    setError("");
    setInfo("");
    setResending(true);
    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setResending(false);
    if (!res.ok) {
      setError(data.error || "Could not resend code.");
      return;
    }
    setInfo("A new code has been sent to your email.");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif-display text-2xl font-bold mb-1">Verify your email</h1>
      <p className="text-muted text-sm mb-6">
        We sent a 6-digit code to <span className="font-medium">{email}</span>. Enter it
        below to activate your account.
      </p>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Verification code</label>
          <input
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full border border-line rounded-lg px-3 py-2 tracking-[0.5em] text-center text-lg focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="000000"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {info && <p className="text-sm text-green-700">{info}</p>}

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full bg-accent hover:bg-accent-dark transition-colors text-white font-medium py-2.5 rounded-lg disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify & continue"}
        </button>
      </form>

      <button
        onClick={handleResend}
        disabled={resending}
        className="text-sm text-accent font-medium mt-4"
      >
        {resending ? "Sending..." : "Resend code"}
      </button>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  );
}
