import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Article, { CATEGORIES } from "@/models/Article";
import { getCurrentUser } from "@/lib/auth";

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") +
    "-" +
    Date.now().toString().slice(-6)
  );
}

// GET /api/articles?category=Business&limit=10
export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const search = searchParams.get("search");

  const query: any = { status: "published" };
  if (category && CATEGORIES.includes(category as any)) {
    query.category = category;
  }
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const articles = await Article.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return NextResponse.json({ articles });
}

// POST /api/articles  (logged-in users only)
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "You must be logged in to submit an article." }, { status: 401 });
  }

  try {
    const { title, excerpt, content, category, coverImage } = await req.json();

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }

    await connectDB();

    const article = await Article.create({
      title,
      slug: slugify(title),
      excerpt,
      content,
      coverImage: coverImage || "",
      category,
      author: user.userId,
      authorName: user.name,
      status: user.role === "admin" ? "published" : "pending",
    });

    return NextResponse.json({ article });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "The article could not be saved." }, { status: 500 });
  }
}
