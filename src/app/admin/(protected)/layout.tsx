import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ShieldAlert } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (user.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShieldAlert className="mx-auto text-accent mb-3" size={32} />
        <h1 className="font-serif-display text-2xl font-bold mb-2">
          Admin access only
        </h1>
        <p className="text-muted mb-6">
          You need an admin account to view this page.
        </p>
        <a href="/admin/login" className="text-accent font-medium">
          Sign in as admin
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row gap-8">
      <AdminSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
