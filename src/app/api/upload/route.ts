import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

// Accepts a base64 image string from the client and uploads it to Cloudinary.
// Only logged-in users can upload images (used when they submit an article).
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  try {
    const { image } = await req.json();
    if (!image) {
      return NextResponse.json({ error: "No image was provided." }, { status: 400 });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: "todaymagazine",
      resource_type: "image",
      transformation: [{ width: 1600, crop: "limit" }, { quality: "auto" }],
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong while uploading the image." }, { status: 500 });
  }
}
