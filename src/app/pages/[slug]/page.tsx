// import connectDB from "@/lib/connect";
// import Page from "@/db/models/pages";

// export default async function PageRenderer({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   await connectDB();

//   interface PageType {
//     html?: string;
//     css?: string;
//     status?: string;
//     [key: string]: any;
//   }

//   const slug = params.slug;

//   // ✅ Only fetch published pages
//   const page = (await Page.findOne({ slug, status: "published" }).lean()) as
//     | PageType
//     | null;

//   if (!page) {
//     return <div>Page not found</div>;
//   }

//   return (
//     <div>
//       <style dangerouslySetInnerHTML={{ __html: page?.css || "" }} />
//       <div dangerouslySetInnerHTML={{ __html: page?.html || "" }} />
//     </div>
//   );
// }
// app/pages/[slug]/page.tsx
import { notFound } from "next/navigation";
import dbConnect from "@/lib/connect";
import PageModel from "@/db/models/pages";

export default async function Page({ params }: { params: { slug: string } }) {
  await dbConnect();
  const page = await PageModel.findOne({ slug: params.slug });

  if (!page) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{page.pageName}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
}
