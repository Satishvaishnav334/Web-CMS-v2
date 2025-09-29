import { NextResponse,NextRequest } from "next/server";
import connectDB from "@/lib/connect";
import Page from "@/db/models/pages";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ slug: string; }>; }
) { 
  try {
    const {params} = context;
    const {slug} = await params;
    await connectDB();
    const page = await Page.findOneAndUpdate(
      { slug },
      { status: "published" },
      { new: true }
    );

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, page });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to publish page", error },
      { status: 500 }
    );
  }
}
