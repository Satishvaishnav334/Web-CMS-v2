import Menu from "@/db/models/Menus";
import connectDB from '@/lib/connect'
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = await params.id;
  const menus = await Menu.findOne({ id }).populate("items.pageId").populate("items.subItems.pageId");
  return new Response(JSON.stringify({ menus }));
}


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    await connectDB();
    const { menuType } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Menu ID is required" },
        { status: 400 }
      );
    }

    // ✅ If setting this menu as navbar/footer, clear previous menu of same type
    if (menuType === "navbar" || menuType === "footer") {
      await Menu.updateMany(
        { menuType }, // all menus of this type
        { $set: { menuType: null } } // reset them
      );
    }

    const menu = await Menu.findByIdAndUpdate(
      id,
      { menuType },
      { new: true }
    );

    if (!menu) {
      return NextResponse.json(
        { success: false, message: "Menu not found" },
        { status: 404 }
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await Menu.findByIdAndDelete(params.id);
  return new Response(JSON.stringify({ success: true }));
}