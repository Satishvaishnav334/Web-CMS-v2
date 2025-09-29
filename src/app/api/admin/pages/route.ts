import { NextResponse } from "next/server";
import connectDB from "@/lib/connect";
import Page from "@/db/models/pages";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      slug,
      pageName,
      html,
      css,
      json,
      status,
      seoTitle,
      seoDescription,
      seoKeywords,
    } = body;
    // ✅ Check if slug already exists
    const existingSlug = await Page.findOne({ slug });
    if (existingSlug) {
      return NextResponse.json(
        { success: false, message: "Slug already exists" },
        { status: 400 }
      );
    }

    // ✅ Check if pageName already exists
    const existingPageName = await Page.findOne({ pageName });
    if (existingPageName) {
      return NextResponse.json(
        { success: false, message: "Page name already exists" },
        { status: 400 }
      );
    }

    // ✅ Create new page
    const page = await Page.create({
      slug,
      pageName,
      html: html ? html : "",
      css: css ? css : "",
      json: json ? json : "",
      status: status || "draft",
      seoTitle: seoTitle || "",
      seoDescription: seoDescription || "",
      seoKeywords: seoKeywords || [],
    });

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { success: false, message: "Failed to save page", error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const pages = await Page.find();

    if (!pages || pages.length === 0) {
      return NextResponse.json({ error: "No pages found" }, { status: 200 });
    }
    return NextResponse.json({ pages }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Error fetching pages" },
      { status: 500 }
    );
  }
}
