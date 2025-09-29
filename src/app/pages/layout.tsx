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
      setMenu(res.data.menu);
      const res2 = await axios.get<{ menu: ActiveMenu }>("/api/admin/menus/footer");
      setMenu2(res2.data.menu);
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
    <div className="min-h-screen !p-0 !m-0 flex flex-col justify-between items-between">
      <div className="">
        <style dangerouslySetInnerHTML={{ __html: menu?.css || "" }} />
        <div dangerouslySetInnerHTML={{ __html: menu?.html || "" }} />
      </div>
      <div className=" h-full w-full">
        {children}
      </div>
      <Footer links={menu2?.items || []} />
    </div>
  );
}
  