import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Article, { CATEGORIES } from "@/models/Article";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 },
    );
  }

  await connectDB();
  const { id } = await params;
  const article = await Article.findById(id).lean();

  if (!article) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  const isOwner = (article as any).author?.toString() === user.userId;
  if (!isOwner && user.role !== "admin") {
    return NextResponse.json(
      { error: "You can only edit your own articles." },
      { status: 403 },
    );
  }

  return NextResponse.json({ article });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 },
    );
  }

  await connectDB();
  const { id } = await params;
  const existing = await Article.findById(id);

  if (!existing) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  const isOwner = existing.author?.toString() === user.userId;
  if (!isOwner && user.role !== "admin") {
    return NextResponse.json(
      { error: "You can only edit your own articles." },
      { status: 403 },
    );
  }

  const body = await req.json();
  const update: any = {};
  if (body.title) update.title = body.title;
  if (body.excerpt) update.excerpt = body.excerpt;
  if (body.content) update.content = body.content;
  if (body.coverImage !== undefined) update.coverImage = body.coverImage;
  if (body.category) {
    if (!CATEGORIES.includes(body.category)) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }
    update.category = body.category;
  }

  // If a regular user edits a published article, send it back for review
  // rather than letting them silently change live content.
  if (user.role !== "admin" && existing.status === "published") {
    update.status = "pending";
  }

  const article = await Article.findByIdAndUpdate(id, update, {
    new: true,
  }).lean();
  return NextResponse.json({ article });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 },
    );
  }

  await connectDB();
  const { id } = await params;
  const existing = await Article.findById(id);

  if (!existing) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  const isOwner = existing.author?.toString() === user.userId;
  if (!isOwner && user.role !== "admin") {
    return NextResponse.json(
      { error: "You can only delete your own articles." },
      { status: 403 },
    );
  }

  await Article.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
