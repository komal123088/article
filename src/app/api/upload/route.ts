import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 },
    );
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error("Cloudinary environment variables are missing.");
    return NextResponse.json(
      {
        error:
          "Image uploads are not configured on the server (missing Cloudinary credentials).",
      },
      { status: 500 },
    );
  }

  try {
    const { image } = await req.json();
    if (!image) {
      return NextResponse.json(
        { error: "No image was provided." },
        { status: 400 },
      );
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: "todaymagazine",
      resource_type: "image",
      transformation: [{ width: 1600, crop: "limit" }, { quality: "auto" }],
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err: any) {
    // Log the full error on the server so it shows up in Vercel logs,
    // but only send back a safe, useful message to the browser.
    console.error("Cloudinary upload error:", err);
    const message = err?.message?.includes("File size too large")
      ? "This image is too large. Please choose a smaller one."
      : err?.message || "Something went wrong while uploading the image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
