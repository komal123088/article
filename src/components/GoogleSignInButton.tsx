"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleSignInButton() {
  const router = useRouter();
  const { setUser } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    function initialize() {
      if (!window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential: string }) => {
          const res = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: response.credential }),
          });
          const data = await res.json();
          if (res.ok) {
            setUser(data.user);
            router.push(data.user?.role === "admin" ? "/admin" : "/dashboard");
          }
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "continue_with",
      });
    }

    if (window.google) {
      initialize();
    } else {
      const existing = document.getElementById("google-gsi-script");
      if (existing) {
        existing.addEventListener("load", initialize);
        return;
      }
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = initialize;
      document.body.appendChild(script);
    }
  }, [router, setUser]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return null;

  return <div ref={buttonRef} className="flex justify-center" />;
}
