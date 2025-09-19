import  Menu  from "@/db/models/Menus";


// GET /api/admin/menus
export async function GET() {
    const menu = await Menu.findOne({isActive:true}).populate("items.pageId").populate("items.subItems.pageId");
  return new Response(JSON.stringify({menu}));
}
