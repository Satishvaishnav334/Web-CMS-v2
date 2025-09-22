'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit2, Plus, Eye } from "lucide-react";

interface Page {
  _id: string;
  pageName: string;
  slug: string;
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: string;
}

export default function CMSDashboard() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      console.log(data)
      setPages(data.pages);
    } catch (err) {
      console.error("Error fetching pages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const deletePage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      const res = await fetch(`/api/admin/pages?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchPages();
        alert("Page deleted successfully");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete page");
    }
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CMS Dashboard</h1>
        <button
          onClick={() => router.push("/admin/dashboard/manage-pages/add-page")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <Plus size={16} /> New Page
        </button>
      </div>

      {loading ? (
        <p>Loading pages...</p>
      ) : pages?.length === 0 ? (
        <p className="text-gray-500">No pages found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages?.map((page) => (
            <div key={page?._id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold">{page?.pageName}</h2>
                <p className="text-sm text-gray-500 mb-2">Slug: {page?.slug}</p>
                <p className="text-sm text-gray-500 mb-2">Status: {page?.status}</p>
                {page?.seoTitle && <p className="text-sm text-gray-500">SEO Title: {page?.seoTitle}</p>}
                {page?.seoDescription && <p className="text-sm text-gray-500">SEO Desc: {page?.seoDescription}</p>}
                {page?.seoKeywords?.length > 0 && (
                  <p className="text-sm text-gray-500">SEO Keywords: {page?.seoKeywords.join(", ")}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => router.push(`/admin/dashboard/manage-pages/edit/${page?.slug}`)}
                  className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => deletePage(page?._id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  <Trash2 size={14} /> Delete
                </button>
                <button
                  onClick={() => router.push(`/pages/${page?.slug}`)}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  <Eye size={14} /> View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
