'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit2, Plus, Eye } from "lucide-react";
import DashboardCard from "@/components/ui/Card";
import { usePageContext } from "@/components/context/PageContext";
import axios from "axios";
import Table from '@/components/home/Table'
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
  const [livepage, setLivePages] = useState<Page[]>([]);
  const {loading, pages, livePages, menus} = usePageContext()
  const router = useRouter();
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
      <h1 className="text-2xl font-semibold ">All Pages</h1>
      <Table/>
    </div>
  );
}
