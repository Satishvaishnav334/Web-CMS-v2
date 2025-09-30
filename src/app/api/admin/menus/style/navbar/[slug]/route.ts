import Menu from "@/db/models/Menus";
import pages from "@/db/models/pages";
import connectDB from '@/lib/connect'
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; }>; }
) {
  const { params } = context; // Destructure params from context
  const { slug } = await params;

  try {
    await connectDB(); // make sure DB is connected
     pages;
    const menu = await Menu.findOne({slug})
      .populate("items.pageId")
      .populate("items.subItems.pageId");
    if (!menu) {
      return NextResponse.json({ error: "Menu not found" }, { status: 201 });
    }
    return NextResponse.json({ menu }, { status: 200 });
  } catch (err) {
    console.error("Error fetching menu:", err);
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}


export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string; }>; }
) {
  const { params } = context; // Destructure params from context
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ success: false, message: "Menu ID is required" }, { status: 400 });
  }

  try {
    await connectDB();
   
    // Extract only the fields we want to update
    const { html, css, json } = await request.json();

    // Build update object
    const updateData: any = {};
    if (html !== undefined) updateData.html = html;
    if (css !== undefined) updateData.css = css;
    if (json !== undefined) updateData.json = json;

    // Update menu without touching items or menuType
    const menu = await Menu.findOneAndUpdate({slug}, updateData, {
      new: true,
      runValidators: true,
    });

    if (!menu) {
      return NextResponse.json({ success: false, message: "Menu not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, menu });
  } catch (error) {
    console.error("Error updating menu:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}




export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string; }>; }
) {
  const { params } = context; // Destructure params from context
  const { slug } = await params;
  await Menu.findOneAndDelete({slug});
  return new Response(JSON.stringify({ success: true }));
}