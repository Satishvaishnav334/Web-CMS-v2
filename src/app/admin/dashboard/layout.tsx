"use client";

import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { usePageContext } from "@/components/context/PageContext";
import { Sidebar, SidebarBody, SidebarLink, SidebarLogout } from "@/components/ui/sidebar";
import { LayoutDashboard, SquarePlus, Settings, Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import logo from '@/app/favicon.ico'
import { Loader } from "@/components/ui/loader";
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { loading } = usePageContext()
  const links = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: (
        <LayoutDashboard className="text-gray-200 h-7 w-7 flex-shrink-0" />
      ),
    },
    {
      label: "Add Page",
      href: "/admin/dashboard/manage-pages/add-page",
      icon: (
        <SquarePlus className="text-gray-200 h-7 w-7 flex-shrink-0" />
      ),
    },

    {
      label: "Custtom Menu",
      href: "/admin/dashboard/manage-menu",
      icon: (
        <Menu className="text-gray-200 h-7 w-7 flex-shrink-0" />
      ),
    },
  ];
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

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-white ">
        <Loader />
      </div>
    )
  }
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("object")
    // Clear token and redirect
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/admin/admin-login");
  };
  return (
    <div
      className={cn(
        " flex flex-col md:flex-row bg-[#463A3C] h-[100vh] w-[100vw]    overflow-hidden",
        "h-[100vh] w-[100vw]" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>

            <SidebarLogout link={{
              label: "Logout",
              onclick:handleLogout,
              icon: (
                <LogOut className="text-gray-200 h-7 w-7 ml-1 flex-shrink-0" />
              ),
            }} />
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="w-full min-h-screen overflow-auto bg-gray-50">
        {children}
      </div>

    </div>
  )
}

export const Logo = () => {
  return (
    <Link
      href="/admin/dashboard" 
      className=" flex space-x-2 items-center text-xl font-bold text-white py-1 relative z-20"
    >
      <div className="h-5 w-6  flex-shrink-0" >
        <Image src={logo} alt="logo" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className=" text-white  whitespace-pre"
      >
        Web CMS v2
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
    >
      <div className="h-5 w-6  flex-shrink-0" >
        <Image src={logo} alt="logo" />
      </div>
    </Link>
  );
};
