"use client";

import { useState } from "react";
import { toast } from "sonner";

interface MenuTypeDropdownProps {
  menuId: string;
  currentType: "navbar" | "footer" | null;
}

export default function MenuTypeDropdown({ menuId, currentType }: MenuTypeDropdownProps) {
  const [menuType, setMenuType] = useState<"navbar" | "footer" | null>(currentType);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as "navbar" | "footer" | null;
    setMenuType(newType);

    try {
      const res = await fetch(`/api/admin/menus/${menuId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuType: newType }),
      });

      const data = await res.json();
     
    } catch (error) {
      console.error("Error updating menu:", error);
      
    }
  };

  return (
    <select
      value={menuType || ""}
      onChange={handleChange}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value="">None</option>
      <option value="navbar">Navbar</option>
      <option value="footer">Footer</option>
    </select>
  );
}
