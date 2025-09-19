"use client";

import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer'
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
  const [menu2, setMenu2] = useState<ActiveMenu | null>(null);
  const router = useRouter();

  const getMenu = async () => {
    try {
      const res = await axios.get<{ menu: ActiveMenu }>("/api/admin/menus/navbar");
      const res2 = await axios.get<{ menu: ActiveMenu }>("/api/admin/menus/footer");
      setMenu2(res2.data.menu);
      setMenu(res.data.menu);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };
  console.log(menu)
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
    <div className="min-h-screen flex flex-col justify-between items-between">
      <Navbar links={menu?.items || []} />
      {children}
      <Footer links={menu2?.items || []} />
    </div>
  );
}
