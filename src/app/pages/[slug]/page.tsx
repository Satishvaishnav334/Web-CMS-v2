import connectDB from "@/lib/connect";
import Page from "@/db/models/pages";

export default async function PageRenderer({
  params,
}: {
  params: { slug: string };
}) {
  await connectDB();

  interface PageType {
    html?: string;
    css?: string;
    status?: string;
    [key: string]: any;
  }

  const slug = params.slug;

  // ✅ Only fetch published pages
  const page = (await Page.findOne({ slug, status: "published" }).lean()) as
    | PageType
    | null;

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: page?.css || "" }} />
      <div dangerouslySetInnerHTML={{ __html: page?.html || "" }} />
    </div>
  );
}
