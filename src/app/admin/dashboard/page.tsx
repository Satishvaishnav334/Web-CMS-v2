'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit2, Plus, Eye } from "lucide-react";
import DashboardCard from "@/components/ui/Card";
import { usePageContext } from "@/components/context/PageContext";
import axios from "axios";
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
  // const [pages, setPages] = useState<Page[]>([]);
  // const [menus, setMenus] = useState([]);
  const [livepage, setLivePages] = useState<Page[]>([]);
  const {loading, pages, livePages, menus} = usePageContext()
  const router = useRouter();

  // const fetchData = async () => {
  //   setLoading(true)
  //   try {
  //     const res = await axios.get("/api/admin/pages");
  //     setPages(res.data.pages);
  //     setLivePages(res.data.pages.filter(page=>page.status=="published"))
  //     const res2 = await axios.get('/api/admin/menus')
  //     setMenus(res2.data.menus)
  //   } catch (err) {
  //     console.error("Error fetching pages:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const deletePage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      const res = await fetch(`/api/admin/pages?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        // fetchData();
        alert("Page deleted successfully");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete page");
    }
  };
  const stats = {
    totalPages: pages.length,
    livePages: livePages.length,
    draftPages: pages.filter((page)=>(page.status=="draft")).length,
    menuCount: menus.length,
    navbarStyle: menus.find(menu => menu.menuType === "navbar")?.name || "Not set",
    footerStyle: menus.find(menu => menu.menuType === "footer")?.name || "Not set",
  };
  return (
    <div className="p-6 flex-col flex gap-10 bg-gray-50 ">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CMS Dashboard</h1>
        <button
          onClick={() => router.push("/admin/dashboard/manage-pages/add-page")}
          className="flex items-center gap-2 bg-[#364153] hover:bg-[#525b69]    text-white px-4 py-2 rounded transition"
        >
          <Plus size={16} /> New Page
        </button>
      </div>
      <DashboardCard
        totalPages={stats.totalPages}
        livePages={stats.livePages}
        draftPages={stats.draftPages}
        menuCount={stats.menuCount}
        navbarStyle={stats.navbarStyle}
        footerStyle={stats.footerStyle}
      />
      <h1 className="text-2xl font-semibold ">Live Pages</h1>
      {pages?.length === 0 ? (
        <p className="text-gray-500">No pages found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {livePages?.map((page) => (
            <div key={page?._id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold">{page?.pageName}</h2>
                <p className="text-sm text-gray-500 mb-2">Slug: {page?.slug}</p>
                <p className="text-sm text-gray-500 mb-2">Status: {page?.status}</p>
                <p className="text-sm text-gray-500">SEO Title: {page?.seoTitle ? page?.seoTitle : "Not set"}</p>
               <p className="text-sm text-gray-500">SEO Desc: {page?.seoDescription ? page?.seoDescription : "Not set"}</p>
                  <p className="text-sm text-gray-500">SEO Keywords: {page?.seoKeywords ? page?.seoKeywords.join(", ") : "Not set"}</p>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => router.push(`/admin/dashboard/manage-pages/edit/${page?.slug}`)}
                  className="flex items-center gap-1 px-3 py-1 bg-[#364153] hover:bg-[#525b69]  text-white rounded  transition"
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
                  className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
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
