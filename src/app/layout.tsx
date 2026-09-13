import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/useAuth";
import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Article";
import { CATEGORIES } from "@/lib/categories";
import { ArticleType } from "@/types";

export const metadata: Metadata = {
  title: "TodayMagazine — Business, Tech & Consumer News",
  description:
    "Independent reporting on business, technology, finance, property and the stories shaping everyday life.",
};

async function getCategoryPreviews(): Promise<Record<string, ArticleType[]>> {
  try {
    await connectDB();
    const previews: Record<string, ArticleType[]> = {};

    await Promise.all(
      CATEGORIES.map(async (cat) => {
        const articles = await Article.find({
          category: cat,
          status: "published",
        })
          .sort({ createdAt: -1 })
          .limit(4)
          .lean();
        previews[cat] = JSON.parse(JSON.stringify(articles));
      }),
    );

    return previews;
  } catch (err) {
    console.error("Could not load navbar previews — is MONGODB_URI set?", err);
    return {};
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categoryPreviews = await getCategoryPreviews();

  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar categoryPreviews={categoryPreviews} />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
