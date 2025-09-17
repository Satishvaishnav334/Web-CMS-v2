import { NextResponse } from "next/server";
import connectDB from "@/lib/connect";
import Page from "@/db/models/pages";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { slug, html, css, json, status } = body;

    // Check if slug already exists
    const existing = await Page.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Slug already exists" },
        { status: 400 }
      );
    }

    // Create new page
    const page = await Page.create({
      slug,
      html,
      css,
      json,
      status: status || "draft",
    });

    return NextResponse.json({ success: true, page });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to save page", error },
      { status: 500 }
    );
  }
}
