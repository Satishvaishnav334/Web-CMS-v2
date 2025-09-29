import { notFound } from "next/navigation";
import dbConnect from "@/lib/connect";
import Menus from "@/db/models/Menus";
interface MenusProps {
  params: { slug: string };
}

export default async function Page({ params }: MenusProps) {
  await dbConnect();
  const name = params.slug;
  const page = await Menus.findOne({ name });

  if (!page) return notFound();
  console.log(page.html)
  return (
    <div className="w-full h-full">
      {/* Page Content */}
      <div className="w-full h-full">
        <style dangerouslySetInnerHTML={{ __html: page?.css || "" }} />
        <div dangerouslySetInnerHTML={{ __html: page?.html || "" }} />
      </div>
    </div>
  );
}
