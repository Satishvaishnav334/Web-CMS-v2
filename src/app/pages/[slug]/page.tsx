import { notFound } from "next/navigation";
import dbConnect from "@/lib/connect";
import PageModel from "@/db/models/pages";
import Menus from "@/db/models/Menus";

export default async function Page({ params }: { params: { slug: string } }) {
  await dbConnect();
  const slug = await params.slug
  const page = await PageModel.findOne({ slug });

  if (!page) return notFound();

  return (
    <div className="w-full h-full">
      {/* Page Content */}
      <div className="max-w-4xl mx-auto py-10">
        <style
          dangerouslySetInnerHTML={{ __html: page?.css || "" }}
        />
        <div
          dangerouslySetInnerHTML={{ __html: page?.html || "" }}
        />
      </div>
    </div>
  );
}
