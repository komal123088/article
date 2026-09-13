"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { CATEGORIES } from "@/lib/categories";
import { compressImage } from "@/lib/imageUtils";
import { ImagePlus, Loader2 } from "lucide-react";

export default function EditMyArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: CATEGORIES[0] as string,
  });
  const [coverImage, setCoverImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [notAllowed, setNotAllowed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetch(`/api/articles/mine/${id}`)
      .then((res) => {
        if (!res.ok) setNotAllowed(true);
        return res.json();
      })
      .then((data) => {
        if (data.article) {
          setForm({
            title: data.article.title,
            excerpt: data.article.excerpt,
            content: data.article.content,
            category: data.article.category,
          });
          setCoverImage(data.article.coverImage || "");
        }
      })
      .finally(() => setLoadingArticle(false));
  }, [id, user]);

  if (authLoading || (user && loadingArticle)) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-serif-display text-2xl font-bold mb-2">
          Sign in to continue
        </h1>
        <Link href="/login" className="text-accent font-medium">
          Sign in
        </Link>
      </div>
    );
  }

  if (notAllowed) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-serif-display text-2xl font-bold mb-2">
          Not found
        </h1>
        <p className="text-muted">
          This article doesn&apos;t exist or isn&apos;t yours to edit.
        </p>
      </div>
    );
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setImagePreview(compressed);
    } catch {
      setError("Could not process that image. Please try a different file.");
    }
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

      const res = await fetch(`/api/articles/mine/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, coverImage: finalCoverImage }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "The article could not be updated.");

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/dashboard" className="text-sm text-accent mb-4 inline-block">
        &larr; Back to your dashboard
      </Link>
      <h1 className="font-serif-display text-2xl font-bold mb-1">
        Edit article
      </h1>
      <p className="text-muted text-sm mb-6">
        If this article was already published, editing it will send it back for
        review.
      </p>

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
