"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { CATEGORIES } from "@/lib/categories";
import { compressImage } from "@/lib/imageUtils";
import { ImagePlus, Loader2, ShieldAlert } from "lucide-react";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: CATEGORIES[0] as string,
    status: "published",
  });
  const [coverImage, setCoverImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") return;
    fetch(`/api/admin/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.article) {
          setForm({
            title: data.article.title,
            excerpt: data.article.excerpt,
            content: data.article.content,
            category: data.article.category,
            status: data.article.status,
          });
          setCoverImage(data.article.coverImage || "");
        }
      })
      .finally(() => setLoadingArticle(false));
  }, [id, user]);

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

  if (loadingArticle) return null;

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const compressed = await compressImage(file);
    setImagePreview(compressed);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      let finalCoverImage = coverImage;

      if (imagePreview) {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imagePreview }),
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok)
          throw new Error(uploadData.error || "Image upload failed.");
        finalCoverImage = uploadData.url;
      }

      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, coverImage: finalCoverImage }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "The article could not be updated.");

      router.push("/admin/articles");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/articles"
        className="text-sm text-accent mb-4 inline-block"
      >
        &larr; Back to articles
      </Link>
      <h1 className="font-serif-display text-2xl font-bold mb-6">
        Edit article
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent bg-white"
            >
              <option value="published">Published</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cover image</label>
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-line rounded-lg p-6 cursor-pointer hover:border-accent transition-colors">
            {imagePreview || coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview || coverImage}
                alt="Preview"
                className="max-h-48 object-contain"
              />
            ) : (
              <>
                <ImagePlus className="text-muted" />
                <span className="text-sm text-muted">
                  Click to select an image
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Short excerpt
          </label>
          <textarea
            required
            rows={2}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Full article</label>
          <textarea
            required
            rows={10}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-dark transition-colors text-white font-medium py-2.5 rounded-lg disabled:opacity-60"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
