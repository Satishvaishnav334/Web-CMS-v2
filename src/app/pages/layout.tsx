"use client";

import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";

// Define menu type (adjust fields based on your schema)
interface SubItem {
  label: string;
  slug?: string;
  isActive?: boolean;
}

interface MenuItem {
  label: string;
  type: "link" | "dropdown";
  slug?: string;
  isActive?: boolean;
  subItems?: SubItem[];
}

interface ActiveMenu {
  items: MenuItem[];
}

// Props type for layout
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [menu, setMenu] = useState<ActiveMenu | null>(null);
  const router = useRouter();

  const getMenu = async () => {
    try {
      const res = await axios.get<{ menu: ActiveMenu }>("/api/admin/menus/activeMenu");
      setMenu(res.data.menu);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  useEffect(() => {
    getMenu();

    const checkSession = () => {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 3000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [router]);
  
  return (
    <>
      <Navbar links={menu?.items || []} />
      {children}
    </>
  );
}
