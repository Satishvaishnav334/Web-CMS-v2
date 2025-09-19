"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Page } from "@/types";
import axios from "axios";
export default function Navigation() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    async function loadMenus() {
      const res = await axios.get("/api/admin/menus");
      const res2 = await axios.get("/api/admin/pages/drafts");
      setMenus(res.data.menus);
      setPages(res2.data);
    }
    loadMenus();
  }, []);

  const getPageSlug = (pageId: string) => {
    const page = pages.find((p) => p._id === pageId);
    return page ? `/pages/${page.slug}` : "#";
  };

  if (!menus.length) {
    return <p className="p-4 text-gray-500">Loading menus...</p>;
  }

  return (
    <nav className="bg-white shadow">
      {menus.map((menu) => (
        <ul key={menu.id} className="flex gap-6 px-6 py-4">
          {menu.items.map((item) => (
            <li key={item.id} className="relative group">
              <Link
                href={getPageSlug(item.pageId)}
                className="text-gray-800 hover:text-blue-600 font-medium"
              >
                {item.label}
              </Link>

              {item.subItems?.length > 0 && (
                <ul className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg hidden group-hover:block">
                  {item.subItems.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={getPageSlug(sub.pageId)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ))}
    </nav>
  );
}

