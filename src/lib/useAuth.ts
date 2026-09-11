"use client";

import { useEffect, useState } from "react";

export type CurrentUser = {
  userId: string;
  name: string;
  email: string;
  role: "user" | "admin";
} | null;

export function useAuth() {
  const [user, setUser] = useState<CurrentUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, setUser };
}
