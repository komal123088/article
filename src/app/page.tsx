import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Article";
import { ArticleCard, ArticleListItem } from "@/components/ArticleCard";
import { ArticleType } from "@/types";
import Link from "next/link";

async function getArticles(searchParams: { search?: string }) {
  try {
    await connectDB();
    const query: any = { status: "published" };
    if (searchParams.search) {
      query.title = { $regex: searchParams.search, $options: "i" };
    }
    const articles = await Article.find(query).sort({ createdAt: -1 }).limit(19).lean();
    return JSON.parse(JSON.stringify(articles)) as ArticleType[];
  } catch (err) {
    console.error("Could not load articles — is MONGODB_URI set?", err);
    return [];
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const articles = await getArticles(params);

  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-serif-display text-3xl font-bold mb-3">No articles yet</h1>
        <p className="text-muted mb-6">
          {params.search
            ? `No articles found for "${params.search}".`
            : "As soon as an article is published, it will show up here. Be the first to write one."}
        </p>
        <Link
          href="/dashboard/new"
          className="inline-block bg-accent hover:bg-accent-dark text-white font-medium px-6 py-3 rounded-full"
        >
          Write the first article
        </Link>
      </div>
    );
  }

  const [featured, ...rest] = articles;
  const sideList = rest.slice(0, 6);
  const gridArticles = rest.slice(6, 12);
  const businessList = rest.filter((a) => a.category === "Business").slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10 border-b border-line">
        <div className="lg:col-span-2">
          <ArticleCard article={featured} />
        </div>
        <div className="divide-y divide-line">
          {sideList.map((a) => (
            <ArticleListItem key={a._id} article={a} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
          {gridArticles.map((a) => (
            <ArticleCard key={a._id} article={a} />
          ))}
        </div>

        <div>
          <h2 className="font-serif-display text-lg font-bold uppercase tracking-wide border-b-2 border-accent pb-2 mb-4">
            Business
          </h2>
          <div className="divide-y divide-line">
            {(businessList.length ? businessList : rest.slice(0, 4)).map((a) => (
              <ArticleListItem key={a._id} article={a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
