import { NextResponse } from "next/server";
import connectDB from "@/lib/connect";
import Page from "@/db/models/pages";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const page = await Page.findOne({ slug: params.slug });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, page });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching page" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const { slug } = params;
    const body = await req.json();

    // Extract fields from body
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

    const page = await Page.findOneAndUpdate(
      { slug },
      {
        slug:newslug,
        pageName,
        html,
        css,
        json,
        status: status || "draft",
        seoTitle: seoTitle || "",
        seoDescription: seoDescription || "",
        seoKeywords: seoKeywords || [],
      },
      { new: true } // return updated page
    );
    console.log(page)
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
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const { slug } = params;

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