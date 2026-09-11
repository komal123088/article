import { connectDB } from "@/lib/mongodb";
import Article, { CATEGORIES } from "@/models/Article";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleType } from "@/types";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const matchedCategory = CATEGORIES.find(
    (c) => c.toLowerCase() === category.toLowerCase()
  );

  if (!matchedCategory) {
    notFound();
  }

  await connectDB();
  const articles = JSON.parse(
    JSON.stringify(
      await Article.find({ category: matchedCategory, status: "published" })
        .sort({ createdAt: -1 })
        .lean()
    )
  ) as ArticleType[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif-display text-3xl font-bold border-b-2 border-accent pb-3 mb-8">
        {matchedCategory}
      </h1>

      {articles.length === 0 ? (
        <p className="text-muted">No articles have been published in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {articles.map((a) => (
            <ArticleCard key={a._id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
