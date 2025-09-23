"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
interface MenuTypeDropdownProps {
  menuId: string;
  currentType: string;
}

export default function MenuTypeDropdown({ menuId, currentType }: MenuTypeDropdownProps) {
  const [menuType, setMenuType] = useState<String>(currentType);
  const router = useRouter()
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as "navbar" | "footer" | "none";
    setMenuType(newType);

    try {
      const res = await fetch(`/api/admin/menus/type/${menuId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuType: newType }),
      });
      router.refresh()
      window.location.reload()
      alert(`Menu updated successfully!`);
      const data = await res.json();
    } catch (error) {
      console.error("Error updating menu:", error);
    }
    finally{
       router.refresh()
      window.location.reload()
    }
  };

  return (
    <select
      value={menuType || ""}
      onChange={handleChange}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value="none">None</option>
      <option value="navbar">Navbar</option>
      <option value="footer">Footer</option>
    </select>
  );
}
