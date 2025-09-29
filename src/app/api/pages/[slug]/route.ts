import { NextResponse,NextRequest } from "next/server";
import connectDB from "@/lib/connect";
import Page from "@/db/models/pages";


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; }>; }
){
  try {
        const { params } = context;
    const { slug } = await params;
    await connectDB();
    const page = await Page.findOne({ slug});

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching page" },
      { status: 500 }
    );
  }
}

