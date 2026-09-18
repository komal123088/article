import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Article";
import User from "@/models/User";
import { CATEGORIES } from "@/lib/categories";
import CategoryBarChart from "@/components/admin/CategoryBarChart";
import { Users, FileText, CheckCircle2, Clock, Eye } from "lucide-react";
import Link from "next/link";

async function getStats() {
  await connectDB();

  const [
    totalUsers,
    totalArticles,
    publishedCount,
    pendingCount,
    viewsAgg,
    categoryAgg,
    topAuthorsAgg,
  ] = await Promise.all([
    User.countDocuments(),
    Article.countDocuments(),
    Article.countDocuments({ status: "published" }),
    Article.countDocuments({ status: "pending" }),
    Article.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
    Article.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
    Article.aggregate([
      {
        $group: {
          _id: "$author",
          count: { $sum: 1 },
          authorName: { $first: "$authorName" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
  ]);

  const totalViews = viewsAgg[0]?.total || 0;

  const categoryCounts = CATEGORIES.map((cat) => {
    const found = categoryAgg.find((c: any) => c._id === cat);
    return { category: cat, count: found ? found.count : 0 };
  });

  return {
    totalUsers,
    totalArticles,
    publishedCount,
    pendingCount,
    totalViews,
    categoryCounts,
    topAuthors: topAuthorsAgg,
  };
}

export default async function AdminOverviewPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total users", value: stats.totalUsers, icon: Users },
    { label: "Total articles", value: stats.totalArticles, icon: FileText },
    { label: "Published", value: stats.publishedCount, icon: CheckCircle2 },
    { label: "Pending review", value: stats.pendingCount, icon: Clock },
    { label: "Total views", value: stats.totalViews, icon: Eye },
  ];

  return (
    <div>
      <h1 className="font-serif-display text-2xl font-bold mb-6">Overview</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="border border-line rounded-lg p-4">
            <Icon className="text-accent mb-2" size={18} />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-serif-display text-lg font-bold mb-4">
            Articles by category
          </h2>
          <div className="border border-line rounded-lg p-4">
            <CategoryBarChart data={stats.categoryCounts} />
          </div>
        </div>

        <div>
          <h2 className="font-serif-display text-lg font-bold mb-4">
            Top contributors
          </h2>
          <div className="border border-line rounded-lg divide-y divide-line">
            {stats.topAuthors.length === 0 ? (
              <p className="p-4 text-sm text-muted">No articles yet.</p>
            ) : (
              stats.topAuthors.map((a: any) => (
                <div
                  key={a._id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <span className="text-sm font-medium">{a.authorName}</span>
                  <span className="text-sm text-muted">{a.count} articles</span>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <Link
              href="/admin/users"
              className="text-sm text-accent font-medium"
            >
              View all users &rarr;
            </Link>
            <Link
              href="/admin/articles"
              className="text-sm text-accent font-medium"
            >
              Manage articles &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
