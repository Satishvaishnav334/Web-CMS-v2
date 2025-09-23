"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { usePageContext } from "@/components/context/PageContext";
import { useRouter } from "next/navigation";

interface Page {
  _id: string;
  slug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function PageDashboard() {
  const { slug, setSlug } = usePageContext();
  const [pages, setPages] = useState<Page[]>([]);
  const router = useRouter();

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      console.log(data)
      setPages(data.pages);
    } catch (err) {
      console.error("Error fetching pages:", err);
    } 
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // Delete page
  const handleDelete = async (slug: string) => {
    try {
      await axios.delete(`/api/admin/pages/${slug}`);
      setPages((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pages Dashboard</h1>

      {/* Add new page button */}
      <div className="mb-6 flex gap-2">
        <Link
          href="/admin/dashboard/manage-pages/add-page"
          className="bg-[#364153] hover:bg-[#525b69] py-2 px-3 text-xl rounded-lg text-white"
        >
          New Page
        </Link>
      </div>

      {/* Pages Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Slug</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Live Link</th>
            <th className="border border-gray-300 px-4 py-2">Updated</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages?.length > 0 ? (
            pages.map((page, index) => (
              <tr key={page._id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{page.slug}</td>
                <td className="border border-gray-300 px-4 py-2">{page.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {page.status === "draft" ? (
                    "Not Published"
                  ) : (
                    <Link
                      href={`/pages/${page.slug}`}
                      className="underline text-blue-600"
                    >
                      Live Link
                    </Link>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(page.updatedAt).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <Link
                    href={`/admin/dashboard/manage-pages/edit/${page.slug}`}
                    className="bg-[#364153] hover:bg-[#525b69] text-white px-3 py-2 rounded"
                    onClick={() => setSlug(page.slug)}
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(page.slug)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="border border-gray-300 px-4 py-2 text-gray-500"
              >
                No Pages found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
