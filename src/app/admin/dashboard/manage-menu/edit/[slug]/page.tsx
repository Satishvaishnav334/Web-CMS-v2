"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { usePageContext } from "@/components/context/PageContext";
import React, { useState, useEffect } from "react";
import { Save, Eye } from "lucide-react";
import axios from "axios";

// Define types
interface SubItem {
  label: string;
  pageId: {
    slug: string
  };
}

interface MenuItem {
  label: string;
  pageId: {
    slug: string
  };
  subItems?: SubItem[];
}

interface NavbarData {
  name: string;
  items: MenuItem[];
  html?: string;
  css?: string;
}

const NavbarEditor: React.FC = () => {
  const [navbarData, setNavbarData] = useState<NavbarData>({
    name: "",
    items: [],
  });

  const { setDataLoading } = usePageContext();
  const [editMode, setEditMode] = useState<"html" | "css">("html");

  const getCurrentData = () => navbarData;
  const setCurrentData = (data: NavbarData) => setNavbarData(data);

  // type `useParams`
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get<{ menu: NavbarData }>(
          `/api/admin/menus/${slug}`
        );
        setNavbarData(res.data.menu);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      }
    };
    if (slug) fetchMenu();
  }, [slug]);

  const renderPreview = (data: NavbarData) => {
    let htmlContent = data?.html ?? "";
    const link = data?.items?.map((item) => item.pageId.slug)
    htmlContent = htmlContent?.replace(/\{\{name\}\}/g, data?.name);

    const menuHtml =
      data?.items
        ?.map((item) => {
          let itemHtml = `
        <div class="navbar-item ${item.subItems && item.subItems.length > 0 ? "has-dropdown" : ""
            }">
          <a href="${item?.pageId?.slug ?? "#"}" class="navbar-link">
            ${item.label}
            ${item.subItems && item.subItems.length > 0
              ? '<span class="dropdown-icon">▼</span>'
              : ""
            }
          </a>
      `;

          if (item.subItems && item.subItems.length > 0) {
            itemHtml += '<div class="navbar-dropdown">';
            item.subItems.forEach((sub) => {
              itemHtml += `<a href="${sub?.pageId?.slug ?? "#"}" class="dropdown-item">${sub.label
                }</a>`;
            });
            itemHtml += "</div>";
          }

          itemHtml += "</div>";
          return itemHtml;
        })
        .join("") ?? "";

    htmlContent = htmlContent.replace(
      /\{\{#each menu\}\}[\s\S]*?\{\{\/each\}\}/g,
      menuHtml
    );

    return (
      <div className="h-full w-full">
        <style>{data?.css}</style>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    );
  };

  const generateRenderedHTML = (data: NavbarData) => {
    let htmlContent = data.html || "";
    htmlContent = htmlContent.replace(/\{\{name\}\}/g, data.name);
    console.log(data)
    const menuHtml =
      data.items
        ?.map((item) => {
          let itemHtml = `
                <div class="navbar-item ${item.subItems && item.subItems.length > 0
              ? "has-dropdown"
              : ""
            }">
                <a href="http://localhost:3000/pages/${item?.pageId?.slug}" class="navbar-link">
                ${item.label}
            ${item.subItems && item.subItems.length > 0
              ? '<span class="dropdown-icon">▼</span>'
              : ""
            }
             </a>
                `;

          if (item.subItems && item.subItems.length > 0) {
            itemHtml += '<div class="navbar-dropdown">';
            item.subItems.forEach((sub) => {
              itemHtml += `<a href="${sub?.pageId?.slug ?? "#"}" class="dropdown-item">${sub.label
                }</a>`;
            });
            itemHtml += "</div>";
          }

          itemHtml += "</div>";
          return itemHtml;
        })
        .join("") ?? "";

    htmlContent = htmlContent.replace(
      /\{\{#each menu\}\}[\s\S]*?\{\{\/each\}\}/g,
      menuHtml
    );
    return htmlContent;
  };

  const handleSave = async () => {
    const data = getCurrentData();

    const renderedHTML = generateRenderedHTML(data);

    const payload = {
      html: renderedHTML,
      css: data.css,
      items: data.items,
      name: data.name,
    };

    try {
      await axios.put(`/api/admin/menus/style/navbar/${slug}`, payload);
      toast.success("Navbar saved successfully!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save data.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between ">
      <div className="w-full h-full">
        {renderPreview(getCurrentData())}
      </div>
      <div className="flex justify-end gap-3 px-3">
         <button
              onClick={handleSave}
             className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white font-bold"
            >
              Save 
            </button>
      </div>
      <div className="w-full h-full  pt-3 ">

        <div className=" rounded-lg w-full h-full ">
          <div className="border-b w-full h-full">
            <div className="flex border-t">
              <button
                onClick={() => setEditMode("html")}
                className={`flex-1 px-4 py-2 text-sm font-medium ${editMode === "html"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600"
                  }`}
              >
                HTML
              </button>
              <button
                onClick={() => setEditMode("css")}
                className={`flex-1 px-4 py-2 text-sm font-medium ${editMode === "css"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600"
                  }`}
              >
                CSS
              </button>
            </div>
          </div>

          <div className="h-full py-3">
            {editMode === "html" && (
              <div className="p-0 flex flex-row-reverse ">
                <div className="flex flex-col justify-start gap-4 p-2 items-center">
                  <label className="block font-semibold text-lg">
                    HTML Template
                  </label>
                  <span className="text-sm text-gray-500">
                    Use Handlebars syntax
                  </span>

                  <div className="text-xs bg-blue-50 p-3 min-w-50 rounded border border-blue-200">
                    <p className="font-semibold mb-1">Current Nav Links</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {navbarData.items.map((item, id) => (
                        <li key={id}>
                          <code className="bg-white px-1 rounded">
                            {item.label}
                          </code>{" "}
                          - Nav name
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <textarea
                  value={getCurrentData()?.html ?? ""}
                  onChange={(e) =>
                    setCurrentData({ ...getCurrentData(), html: e.target.value })
                  }
                  className="w-full border rounded p-3 mx-2 font-mono text-sm"
                  rows={30}
                  placeholder="Enter HTML template..."
                />
              </div>
            )}

            {editMode === "css" && (
              <div className="p-0 flex flex-row-reverse ">
                <textarea
                  value={getCurrentData().css ?? ""}
                  onChange={(e) =>
                    setCurrentData({ ...getCurrentData(), css: e.target.value })
                  }
                  className="w-full border rounded p-3 mx-2 font-mono text-sm"
                  rows={30}
                  placeholder="Enter CSS styles..."
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default NavbarEditor;
