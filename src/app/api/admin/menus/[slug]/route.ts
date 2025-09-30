import Menu from "@/db/models/Menus";
import connectDB from '@/lib/connect'
import { NextRequest, NextResponse } from "next/server";
import pages from "@/db/models/pages";
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; }>; }
) {
  const { params } = context; // Destructure params from context
  const { slug } = await params;

  try {
    await connectDB();
    pages; // make sure DB is connected
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

  try {
    await connectDB();
    const { name, items, slug } = await request.json();
    const generatedSlug = slug
      ? slug.trim().toLowerCase().replace(/\s+/g, "-")
      : name.trim().toLowerCase().split(" ").join("-");

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Menu ID is required" },
        { status: 400 }
      );
    }

    // ✅ Clean items (remove _id, fix empty pageId)
    const cleanItems = (items || []).map((item: any) => ({
      id: item.id,
      label: item.label,
      type: item.type,
      pageId: item.pageId && item.pageId !== "" ? item.pageId : undefined,
      subItems: (item.subItems || []).map((sub: any) => ({
        id: sub.id,
        label: sub.label,
        pageId: sub.pageId && sub.pageId !== "" ? sub.pageId : undefined,
      })),
    }));

    const menu = await Menu.findOneAndUpdate(
      {slug},
      { name: name?.trim(), items: cleanItems ,generatedSlug},
      { new: true, runValidators: true }
    );

    if (!menu) {
      return NextResponse.json(
        { success: false, message: "Menu not found" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, menu });
  } catch (error) {
    console.error("Error updating menu:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
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