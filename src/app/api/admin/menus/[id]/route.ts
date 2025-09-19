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
    const { name, items } = await req.json();

    if (!id) {
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

    // ✅ Update only name & items, keep existing menuType untouched
    const menu = await Menu.findByIdAndUpdate(
      id,
      { name: name?.trim(), items: cleanItems },
      { new: true, runValidators: true }
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