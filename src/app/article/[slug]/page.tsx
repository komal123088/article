import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Article";
import { ArticleType } from "@/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Eye, User, Share2, Link2 } from "lucide-react";

async function getArticle(slug: string) {
  await connectDB();
  const article = await Article.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { new: true },
  ).lean();
  if (!article) return null;
  return JSON.parse(JSON.stringify(article)) as ArticleType;
}

async function getRelated(category: string, excludeId: string) {
  const articles = await Article.find({
    category,
    status: "published",
    _id: { $ne: excludeId },
  })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();
  return JSON.parse(JSON.stringify(articles)) as ArticleType[];
}

async function getLatest(excludeId: string) {
  const articles = await Article.find({
    status: "published",
    _id: { $ne: excludeId },
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
  return JSON.parse(JSON.stringify(articles)) as ArticleType[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

  const [related, latest] = await Promise.all([
    getRelated(article.category, article._id),
    getLatest(article._id),
  ]);

  const shareUrl = encodeURIComponent(
    `https://todaymagazine.com/article/${article.slug}`,
  );
  const shareTitle = encodeURIComponent(article.title);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
        {/* Main article */}
        <article>
          <Link
            href={`/category/${article.category.toLowerCase()}`}
            className="inline-block bg-accent text-white text-xs font-semibold uppercase tracking-wide px-2 py-1 mb-4"
          >
            {article.category}
          </Link>

          <h1 className="font-serif-display text-3xl md:text-4xl font-bold leading-tight mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted mb-6 pb-6 border-b border-line">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-semibold">
                  {article.authorName?.[0]?.toUpperCase() || <User size={12} />}
                </span>
                {article.authorName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(article.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={14} /> {article.views} views
              </span>
            </div>

            {/* Share buttons */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1 text-xs text-muted mr-1">
                <Share2 size={13} /> Share:
              </span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-xs font-semibold hover:border-accent hover:text-accent transition-colors"
              >
                f
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-xs font-semibold hover:border-accent hover:text-accent transition-colors"
              >
                X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-xs font-semibold hover:border-accent hover:text-accent transition-colors"
              >
                in
              </a>
            </div>
          </div>

          {article.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-auto mb-8 object-cover rounded"
            />
          )}

          <p className="text-lg text-muted mb-6 leading-relaxed">
            {article.excerpt}
          </p>

          <div
            className="prose max-w-none leading-relaxed whitespace-pre-line"
            style={{ lineHeight: 1.8 }}
          >
            {article.content}
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-14 pt-8 border-t border-line">
              <h2 className="font-serif-display text-xl font-bold mb-5">
                Related Posts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {related.map((a) => (
                  <Link
                    key={a._id}
                    href={`/article/${a.slug}`}
                    className="group block"
                  >
                    {a.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.coverImage}
                        alt={a.title}
                        className="w-full aspect-[16/10] object-cover rounded mb-2 group-hover:opacity-90 transition-opacity"
                      />
                    ) : (
                      <div className="w-full aspect-[16/10] bg-surface rounded mb-2" />
                    )}
                    <p className="text-sm font-semibold leading-snug group-hover:text-accent transition-colors line-clamp-2">
                      {a.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside>
          <h2 className="font-serif-display text-lg font-bold uppercase tracking-wide border-b-2 border-accent pb-2 mb-4">
            Latest News
          </h2>
          <div className="space-y-4">
            {latest.map((a) => (
              <Link
                key={a._id}
                href={`/article/${a.slug}`}
                className="flex gap-3 group"
              >
                {a.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.coverImage}
                    alt={a.title}
                    className="w-16 h-16 object-cover rounded shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 bg-surface rounded shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium leading-snug group-hover:text-accent transition-colors line-clamp-3">
                    {a.title}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {formatDate(a.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
