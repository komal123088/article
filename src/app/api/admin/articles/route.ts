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

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

// GET /api/admin/articles?status=pending — list every article regardless of status
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const query: any = {};
  if (status && ["published", "pending"].includes(status)) {
    query.status = status;
  }

  const articles = await Article.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ articles });
}

// POST /api/admin/articles — admin creates an article directly (auto-published)
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const { title, excerpt, content, category, coverImage, status } = await req.json();

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
      author: admin.userId,
      authorName: admin.name,
      status: status === "pending" ? "pending" : "published",
    });

    return NextResponse.json({ article });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "The article could not be saved." }, { status: 500 });
  }
}
