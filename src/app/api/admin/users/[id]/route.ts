import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required." },
      { status: 403 },
    );
  }

  const { id } = await params;
  const { role } = await req.json();

  if (!["user", "admin"].includes(role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  if (id === admin.userId && role === "user") {
    return NextResponse.json(
      { error: "You can't remove your own admin access." },
      { status: 400 },
    );
  }

  await connectDB();
  const user = await User.findByIdAndUpdate(id, { role }, { new: true })
    .select("-password -otpCode")
    .lean();

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ user });
}
