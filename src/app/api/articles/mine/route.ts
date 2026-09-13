import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Article";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 },
    );
  }

  await connectDB();
  const articles = await Article.find({ author: user.userId })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ articles });
}
