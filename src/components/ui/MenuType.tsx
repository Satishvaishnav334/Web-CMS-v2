"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {toast} from 'sonner'
import { usePageContext } from "../context/PageContext";
interface Menu {
  _id: string;
  menuType: string;
  name: string;
}

export default function MenuTypeSelector() {
  const [existingMenus, setExistingMenus] = useState<Menu[]>([]);
  const [navbarMenu, setNavbarMenu] = useState<string>("");
  const [footerMenu, setFooterMenu] = useState<string>("");
  const router = useRouter();
  const {setDataLoading} = usePageContext()
  // ✅ Fetch all menus
  const fetchMenus = async () => {
    try {
      const res = await axios.get("/api/admin/menus");
      setExistingMenus(res.data.menus || []);
      
      // pre-select the currently assigned navbar/footer menus
      const navbar = res.data.menus.find((m: Menu) => m.menuType === "navbar");
      const footer = res.data.menus.find((m: Menu) => m.menuType === "footer");
      
      if (navbar) setNavbarMenu(navbar._id);
      if (footer) setFooterMenu(footer._id);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // ✅ Update menuType (navbar or footer)
  const updateMenuType = async (menuId: string, type: "navbar" | "footer") => {
    try {
      setDataLoading(true)
      await fetch(`/api/admin/menus/type`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuType: type,id:menuId }),
      });
      setDataLoading(false)
      toast.success(`${type} Updated Successfully`)
    } catch (error) {
      console.error("Error updating menu:", error);
    }
    finally{
      router.refresh();
    }
  };

  // ✅ Handle navbar dropdown change
  const handleNavbarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMenuId = e.target.value;
    setNavbarMenu(newMenuId);
    if (newMenuId) updateMenuType(newMenuId, "navbar");
  };

  // ✅ Handle footer dropdown change
  const handleFooterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMenuId = e.target.value;
    setFooterMenu(newMenuId);
    if (newMenuId) updateMenuType(newMenuId, "footer");
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md bg-white p-4 rounded shadow">
      {/* Navbar Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Set Navbar Menu
        </label>
        <select
          value={navbarMenu}
          onChange={handleNavbarChange}
          className="border rounded px-2 py-1 "
        >
          <option value="">-- Select Navbar Menu --</option>
          {existingMenus.map((menu) => (
            <option key={menu._id} value={menu._id}>
              {menu.name}
            </option>
          ))}
        </select>
      </div>

      {/* Footer Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Set Footer Menu
        </label>
        <select
          value={footerMenu}
          onChange={handleFooterChange}
          className="border rounded px-2 py-1 "
        >
          <option value="">-- Select Footer Menu --</option>
          {existingMenus.map((menu) => (
            <option key={menu._id} value={menu._id}>
              {menu.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
