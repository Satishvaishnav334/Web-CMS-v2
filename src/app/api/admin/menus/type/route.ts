import { NextResponse,NextRequest } from "next/server";
import connectDB from "@/lib/connect";
import Menu from "@/db/models/Menus";

export async function PUT(
  request: NextRequest,
  
)  {

  try {
    await connectDB();
    const { menuType,id } = await request.json();
    console.log(menuType)
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Menu ID is required" },
        { status: 400 }
      );
    }

    if (!menuType) {
      return NextResponse.json(
        { success: false, message: "menuType is required" },
        { status: 400 }
      );
    }

    if (menuType === "navbar" || menuType === "footer" || menuType === "none") {
      await Menu.updateMany(
        { menuType }, // all menus of this type
        { $set: { menuType: null } } // reset them
      );
    }

    // ✅ Update only the menuType
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
    console.error("Error updating menuType:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
