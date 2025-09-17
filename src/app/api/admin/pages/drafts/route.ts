
import { NextResponse } from "next/server";
import connectDB from "@/lib/connect";
import Page from "@/db/models/pages";


export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const page = await Page.find();

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

