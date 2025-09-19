import { NextResponse } from "next/server";
import connectDB from "@/lib/connect";
import Menus from "@/db/models/Menus";

export async function GET(req: Request) {
  try {
    await connectDB();

    const menu = await Menus.findOne({ menuType: "footer" })
      .populate("items.pageId")
      .populate("items.subItems.pageId")
      .lean();

    if (!menu) {
      return NextResponse.json(
        { success: false, message: "Navbar menu not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, menu });
  } catch (error) {
    console.error("Error fetching navbar menu:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
