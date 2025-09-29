"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next/client";
import axios from "axios";
import Router from "next/router";
interface PageContextType {
  loading: boolean;
  slug:string;
  setSlug:any;
  setDataLoading: any;
  pages: any[];
  livePages: any[];
  menus: any[];
  fetchData: () => Promise<void>;
}

const PageContext = createContext<PageContextType>({
  loading: false,
  slug:"h",
  setDataLoading: () => { },
  setSlug: () => { },
  pages: [],
  livePages: [],
  menus: [],
  fetchData: async () => { },
});

export const PageProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [authLoading, setAuthLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [slug, setSlug] = useState(String);

  const [pages, setPages] = useState<any[]>([]);
  const [livePages, setLivePages] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);

  // 🔹 Combined loading state
  const loading = authLoading || dataLoading;

  // 🔹 Check session once on mount
  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      router.replace("/admin/admin-login");
    }
    setAuthLoading(false);
  }, [router]);

  // 🔹 Fetch pages + menus
  const fetchData = async () => {
    setDataLoading(true);
    try {
      const res = await axios.get("/api/admin/pages");
      setPages(res.data.pages);
      setLivePages(res.data.pages.filter((page: any) => page.status === "published"));

      const res2 = await axios.get("/api/admin/menus");
      setMenus(res2.data.menus);
    } catch (err) {
      console.error("Error fetching pages/menus:", err);
    } finally {
      setDataLoading(false);
    }
  };

  
  useEffect(() => {
    fetchData();
  }, []);


  return (
    <PageContext.Provider value={{ loading, pages, livePages, menus, fetchData, setDataLoading,slug,setSlug }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => useContext(PageContext);
