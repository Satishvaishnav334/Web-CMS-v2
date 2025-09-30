// src/app/api/admin/menus/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/connect";
import Menu from "@/db/models/Menus";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, items, menuType, slug } = await req.json();
    const generatedSlug = slug
      ? slug.trim().toLowerCase().replace(/\s+/g, "-")
      : name.trim().toLowerCase().split(" ").join("-");

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Menu name is required" },
        { status: 400 }
      );
    }

    // Check if menu name already exists
    const existingMenu = await Menu.findOne({ name: name.trim() });
    if (existingMenu) {
      return NextResponse.json(
        { success: false, message: "Menu name already exists" },
        { status: 409 }
      );
    }

    const menu = await Menu.create({
      name: name.trim(),
      slug: generatedSlug,
      items: items || [],
      menuType: menuType || "none"
    });
    return NextResponse.json({ success: true, menu });
  } catch (error) {
    console.error("Error creating menu:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const menus = await Menu.find().populate("items.pageId").populate("items.subItems.pageId");

    return NextResponse.json({ menus }, { status: 200 });
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}



export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Menu ID is required" },
        { status: 400 }
      );
    }

    const menu = await Menu.findByIdAndDelete(id);

    if (!menu) {
      return NextResponse.json(
        { success: false, message: "Menu not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Menu deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}