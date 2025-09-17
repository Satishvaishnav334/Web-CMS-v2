import mongoose, { Schema, Document } from "mongoose";

export interface IPage extends Document {
  slug: string;
  html: string;
  css: string;
  json: any;
  status: "draft" | "published";
}

const PageSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    html: { type: String, required: true },
    css: { type: String, required: true },
    json: { type: Object, required: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);


export default mongoose.models.Page ||
  mongoose.model<IPage>("Page", PageSchema);
