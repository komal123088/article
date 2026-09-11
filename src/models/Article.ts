import mongoose, { Schema, models, model } from "mongoose";
import { CATEGORIES } from "@/lib/categories";

export { CATEGORIES };

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    category: { type: String, enum: CATEGORIES, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    status: { type: String, enum: ["published", "pending"], default: "published" },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Article || model("Article", ArticleSchema);
