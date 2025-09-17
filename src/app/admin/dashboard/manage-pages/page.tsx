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
  const [drafts, setDrafts] = useState<Page[]>([]);
  const [inputSlug, setInputSlug] = useState("");
  const router = useRouter();
  // fetch drafts
  useEffect(() => {
    const getDrafts = async () => {
      try {
        const res = await axios.get("/api/admin/pages/drafts");
        setDrafts(res.data || []);
      } catch (error) {
        console.error("Error fetching drafts:", error);
      }
    };
    getDrafts();
  }, []);

  // delete draft
  const handleDelete = async (slug: string) => {
    try {
      await axios.delete(`/api/admin/pages/${slug}`);
      setDrafts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // check slug before redirect
  const handleGoToEditor = () => {
    if (!inputSlug.trim()) {
      alert("Please enter a slug");
      return;
    }

    // check if slug already exists
    const exists = drafts.find((d) => d.slug === inputSlug.trim());
    if (exists) {
      alert("Slug already exists! Choose a different slug.");
      return;
    }

    setSlug(inputSlug.trim());
    // redirect to editor
     router.push("/admin/dashboard/manage-pages/add-page");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Draft Pages Dashboard</h1>

      {/* Input to create a new page */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={inputSlug}
          className="border border-red-500 py-1 px-3 rounded-lg"
          placeholder="Enter page Slug"
          onChange={(e) => setInputSlug(e.target.value)}
        />
        <button
          onClick={handleGoToEditor}
          className="bg-blue-600 py-2 px-3 rounded-lg text-white"
        >
          Add New Page
        </button>
      </div>

      {/* Drafts Table */}
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
          {drafts.length > 0 ? (
            drafts.map((page, index) => (
              <tr key={page._id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{page.slug}</td>
                <td className="border border-gray-300 px-4 py-2">{page.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link href={`/pages/${page.slug}`} className="underline text-blue-600">Link</Link>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(page.updatedAt).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <Link
                    href={`/admin/dashboard/manage-pages/edit/${page.slug}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
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
                colSpan={5}
                className="border border-gray-300 px-4 py-2 text-gray-500"
              >
                No drafts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
