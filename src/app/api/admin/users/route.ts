import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Article from "@/models/Article";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required." },
      { status: 403 },
    );
  }

  await connectDB();

  const [users, counts] = await Promise.all([
    User.find().sort({ createdAt: -1 }).select("-password -otpCode").lean(),
    Article.aggregate([{ $group: { _id: "$author", count: { $sum: 1 } } }]),
  ]);

  const countMap = new Map(
    counts.map((c: any) => [c._id?.toString(), c.count]),
  );

  const usersWithCounts = users.map((u: any) => ({
    ...u,
    articleCount: countMap.get(u._id.toString()) || 0,
  }));

  return NextResponse.json({ users: usersWithCounts });
}
