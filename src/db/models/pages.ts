import mongoose, { Schema, Document } from "mongoose";

export interface IPage extends Document {
  slug: string;
  pageName: string;
  html: string;
  css: string;
  json: any;
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

const PageSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    pageName: { type: String, required: true, unique: true },

    html: { type: String, required: true },
    css: { type: String, required: true },
    json: { type: Object, required: true },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    // ✅ SEO fields
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    seoKeywords: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Page ||
  mongoose.model<IPage>("Page", PageSchema);
