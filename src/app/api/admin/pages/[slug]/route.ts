import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/connect";
import Page from "@/db/models/pages";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; }>; }
) {
  try {
    const { params } = context;
    const { slug } = await params;
    await connectDB();
    const page = await Page.findOne({ slug });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, page });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching page" }, { status: 500 });
  }
}
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string; }>; }
) {
  try {
    await connectDB();
        const { params } = context;
    const { slug } = await params;
    const body = await request.json();

    const {
      newslug,
      pageName,
      html,
      css,
      json,
      status,
      seoTitle,
      seoDescription,
      seoKeywords,
    } = body;

    // Build update object dynamically
    const updateData: any = {};

    if (newslug) updateData.slug = newslug;
    if (pageName) updateData.pageName = pageName;
    if (status) updateData.status = status;

    // Only update editor fields if provided
    if (html !== undefined) updateData.html = html;
    if (css !== undefined) updateData.css = css;
    if (json !== undefined) updateData.json = json;

    // SEO fields
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
    if (seoKeywords !== undefined) updateData.seoKeywords = seoKeywords;

    const page = await Page.findOneAndUpdate(
      { slug },
      updateData,
      { new: true }
    );

    if (!page) {
      return NextResponse.json(
        { success: false, message: "Page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to update page", error },
      { status: 500 }
    );
  }
}


  export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ slug: string; }>; }
  ) {
  try {
    await connectDB();
        const { params } = context;
    const { slug } = await params;

    const deletedPage = await Page.findOneAndDelete({ slug });

    if (!deletedPage) {
      return NextResponse.json(
        { success: false, message: "Page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete page", error },
      { status: 500 }
    );
  }
}