"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Delete } from "lucide-react";

interface Page {
  _id: string;
  slug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function PageDashboard() {
  const [pages, setPages] = useState<Page[]>([]);
  const [search, setSearch] = useState<string>("");

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      const sortedPages = data.pages.sort(
        (a: Page, b: Page) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setPages(sortedPages);
    } catch (err) {
      console.error("Error fetching pages:", err);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (slug: string) => {
    try {
      await axios.delete(`/api/admin/pages/${slug}`);
      setPages((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filteredPages = pages.filter((page) =>
    page.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="">
      {/* Search bar */}
     <div className="mb-4 flex flex-col md:flex-row items-start md:items-center gap-2">
  <div className="relative w-full md:w-64">
    <input
      type="text"
      placeholder="Search by page slug..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 pr-20"
    />
    <button
      onClick={() => setSearch("")}
      className={`absolute right-1 top-1/2 transform -translate-y-1/2  rounded px-2  text-gray-700 transition`}
      style={{ visibility: search ? "visible" : "hidden" }}
    >
     <Delete />
    </button>
  </div>
</div>


      {/* Table */}
      <div className="">
        <table className="w-full border-collapse border border-gray-300 shadow-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr className="text-left text-gray-700">
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Slug</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Live Link</th>
              <th className="border border-gray-300 px-4 py-2">Updated</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPages.length > 0 ? (
              filteredPages.map((page, index) => (
                <tr key={page._id} className="text-gray-700 hover:bg-gray-50 transition">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium">{page.slug}</td>
                  <td className="border border-gray-300 px-4 py-2 capitalize">{page.status}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {page.status === "draft" ? (
                      <span className="text-gray-400 italic">Not Published</span>
                    ) : (
                      <Link
                        href={`/pages/${page.slug}`}
                        className="underline text-blue-600 hover:text-blue-800"
                      >
                        Live Link
                      </Link>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(page.updatedAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-300  py-2 flex justify-center gap-2">
                    <Link
                      href={`/admin/dashboard/manage-pages/edit/${page.slug}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => handleDelete(page.slug)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
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
                  className="border border-gray-300 px-4 py-4 text-center text-gray-500 italic"
                >
                  No Pages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
