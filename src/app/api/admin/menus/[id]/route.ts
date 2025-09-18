import  Menu  from "@/db/models/Menus";
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const menu = await Menu.findByIdAndUpdate(params.id, body, { new: true });
  return new Response(JSON.stringify(menu));
}

// GET /api/admin/menus
export async function GET() {
  const menus = await Menu.find().populate("items.pageId");
  return new Response(JSON.stringify(menus));
}

// DELETE /api/admin/menus/:id
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await Menu.findByIdAndDelete(params.id);
  return new Response(JSON.stringify({ success: true }));
}