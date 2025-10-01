import { notFound } from "next/navigation";
import dbConnect from "@/lib/connect";
import Menus from "@/db/models/Menus";

import PageModel from "@/db/models/pages";
interface MenusProps {
  params: { slug: string };
}

export default async function Page({ params }: MenusProps) {
  await dbConnect();
  const slug = params.slug;
  const menu = await Menus.findOne({ slug });
  const page = await PageModel.findOne({ slug:"sk" });
  if (!page) return notFound();
  console.log(page.html)
  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <style dangerouslySetInnerHTML={{ __html: menu?.css || "" }} />
        <div dangerouslySetInnerHTML={{ __html: menu?.html || "" }} />
      </div>
      <div className="w-full h-full">
        {/* <style dangerouslySetInnerHTML={{ __html: page?.css || "" }} /> */}
        <div dangerouslySetInnerHTML={{ __html: page?.html || "" }} />
      </div>
    </div>
  );
}
