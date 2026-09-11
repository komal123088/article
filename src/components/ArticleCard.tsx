import Link from "next/link";
import { Eye, Calendar } from "lucide-react";
import { ArticleType } from "@/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ArticleCard({ article }: { article: ArticleType }) {
  return (
    <Link href={`/article/${article.slug}`} className="group block">
      {article.coverImage && (
        <div className="relative aspect-[16/10] overflow-hidden bg-line mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute bottom-2 left-2 bg-accent text-white text-[11px] font-semibold uppercase tracking-wide px-2 py-1">
            {article.category}
          </span>
        </div>
      )}
      <h3 className="font-serif-display text-lg font-bold leading-snug group-hover:text-accent transition-colors line-clamp-2">
        {article.title}
      </h3>
      <div className="flex items-center gap-3 text-xs text-muted mt-2">
        <span className="flex items-center gap-1">
          <Calendar size={12} /> {formatDate(article.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <Eye size={12} /> {article.views}
        </span>
      </div>
    </Link>
  );
}

export function ArticleListItem({ article }: { article: ArticleType }) {
  return (
    <Link href={`/article/${article.slug}`} className="flex items-start gap-2 group py-2">
      <span className="text-accent mt-1.5">&#8226;</span>
      <span className="text-sm font-medium group-hover:text-accent transition-colors leading-snug">
        {article.title}
      </span>
    </Link>
  );
}
