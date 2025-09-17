'use client';
import React, { useEffect, useState } from 'react';
import { UserPen, LogOut, AlignRight, X } from "lucide-react";
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

// ✅ Define types for links
interface NavLink {
  label: string;
  href: string;
}



const links: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "first", href: "/pages/first" },
];

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    router.refresh();

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [router]);

  const Logout = async () => {
    const token = getCookie('token');
    if (token) {
      deleteCookie('token');
      toast.info("Logout Successfully", { closeButton: true });
      setIsLogin(false);
      router.push('/login');
    } else {
      setIsLogin(false);
      router.push('/login');
    }
  };

  return (
    <div className="w-full bg-white justify-end flex border-b border-black shadow-lg">
      <nav className="w-full p-3">
        <div className="flex justify-between items-center text-[#11111198]">
          {/* Logo */}
          <div className="text-black w-[25%] lg:w-[40%]">
            <Link href="/">
              <h1 className="text-2xl lg:text-4xl font-extrabold md:m-2">
                Web CMS 2.0
              </h1>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex justify-end items-center w-[55%] lg:w-[56%] font-semibold lg:text-lg text-sm gap-10">
            {links.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={
                  pathname === item.href
                    ? "flex items-center ml-5 justify-start gap-2 py-1 text-black transition-colors duration-300"
                    : "flex items-center ml-5 justify-start gap-2 py-2 hover:text-[#111111d1] transition-colors duration-300"
                }
              >
                {item.label}
              </Link>
            ))}
          
          <button
            onClick={() => Logout()}
            className="py-2 px-4 bg-red-500 hover:bg-red-400  rounded-lg ">
            Logout
          </button>
          </div>


          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex justify-end items-center gap-2">
            {!isOpen ? (
              <AlignRight onClick={() => setIsOpen(true)} />
            ) : (
              <X onClick={() => setIsOpen(false)} />
            )}
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="absolute top-15 right-0 bg-white z-50 m-2 shadow-lg rounded-lg p-4 w-48">
              <div className="flex flex-col justify-between items-start my-5 font-semibold text-lg gap-4">
                {links.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={
                      pathname === item.href
                        ? "flex items-center ml-5 justify-start gap-2 py-1 text-black transition-colors duration-300"
                        : "flex items-center ml-5 justify-start gap-2 py-2 hover:text-[#111111d1] transition-colors duration-300"
                    }
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
