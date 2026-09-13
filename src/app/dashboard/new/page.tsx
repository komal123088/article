"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { CATEGORIES } from "@/lib/categories";
import { compressImage } from "@/lib/imageUtils";
import { ImagePlus, Loader2 } from "lucide-react";

export default function NewArticlePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: CATEGORIES[0] as string,
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageError, setImageError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-serif-display text-2xl font-bold mb-2">
          Sign in to write an article
        </h1>
        <p className="text-muted mb-6">
          Create an account or sign in before submitting an article.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/login"
            className="bg-accent text-white px-5 py-2.5 rounded-lg font-medium"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="border border-line px-5 py-2.5 rounded-lg font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError("");
    try {
      const compressed = await compressImage(file);
      setImagePreview(compressed);
    } catch {
      setImageError(
        "Could not process that image. Please try a different file.",
      );
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.title || !form.excerpt || !form.content) {
      setError("All fields are required.");
      return;
    }

    setSubmitting(true);

    try {
      let coverImage = "";

      if (imagePreview) {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imagePreview }),
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok)
          throw new Error(uploadData.error || "Image upload failed.");
        coverImage = uploadData.url;
      }

      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, coverImage }),
      });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "The article could not be saved.");

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
        Write a new article
      </h1>
      <p className="text-muted text-sm mb-6">
        Your article will be reviewed by an admin before it goes live on the
        site.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Write your article title"
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
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
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
          {imageError && (
            <p className="text-sm text-red-600 mt-1">{imageError}</p>
          )}
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
            placeholder="1-2 line summary"
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
            placeholder="Write the full article here"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-dark transition-colors text-white font-medium py-2.5 rounded-lg disabled:opacity-60"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Publishing..." : "Submit article"}
        </button>
      </form>
    </div>
  );
}
