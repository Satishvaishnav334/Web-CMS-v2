import { notFound } from "next/navigation";
import dbConnect from "@/lib/connect";
import PageModel from "@/db/models/pages";

interface PageProps {
  params: { slug: string };
}

// ✅ Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps) {
  await dbConnect();
  const slug = params.slug; // ❌ no await here
  const page = await PageModel.findOne({ slug });

  if (!page) return {};

  return {
    title: page.seoTitle || page.pageName || "Default Title",
    description: page.seoDescription || "",
    keywords: page.seoKeywords || "",
    openGraph: {
      title: page.seoTitle || page.pageName,
      description: page.seoDescription || "",
      url: `https://yourdomain.com/${slug}`,
      siteName: "Techysquad web cms 2.0",
    },
    twitter: {
      card: "summary_large_image",
      title: page.seoTitle || page.pageName,
      description: page.seoDescription || "",
    },
  };
}

export default async function Page({ params }: PageProps) {
  await dbConnect();
  const slug = params.slug; // ❌ no await here
  const page = await PageModel.findOne({ slug });

  if (!page) return notFound();

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
