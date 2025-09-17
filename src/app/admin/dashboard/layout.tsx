"use client";

import React, { useEffect } from "react";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { PageProvider } from "@/components/context/PageContext";
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const checkSession = () => {
      const token = getCookie("token"); // ✅ check each time
      if (!token) {
        router.push("/admin/admin-login");
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 3000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="">
     <PageProvider>{children}</PageProvider>
    </div>
  )
}
