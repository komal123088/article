import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Article";
import { ArticleType } from "@/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Eye, User } from "lucide-react";

async function getArticle(slug: string) {
  await connectDB();
  const article = await Article.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();
  if (!article) return null;
  return JSON.parse(JSON.stringify(article)) as ArticleType;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href={`/category/${article.category.toLowerCase()}`}
        className="inline-block bg-accent text-white text-xs font-semibold uppercase tracking-wide px-2 py-1 mb-4"
      >
        {article.category}
      </Link>

      <h1 className="font-serif-display text-3xl md:text-4xl font-bold leading-tight mb-4">
        {article.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-6 pb-6 border-b border-line">
        <span className="flex items-center gap-1">
          <User size={14} /> {article.authorName}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {new Date(article.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="flex items-center gap-1">
          <Eye size={14} /> {article.views} views
        </span>
      </div>

      {article.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-auto mb-8 object-cover"
        />
      )}

      <p className="text-lg text-muted mb-6 leading-relaxed">{article.excerpt}</p>

      <div
        className="prose max-w-none leading-relaxed whitespace-pre-line"
        style={{ lineHeight: 1.8 }}
      >
        {article.content}
      </div>
    </article>
  );
}
