'use client';

import React, { useEffect, useState } from 'react';
import { UserPen, LogOut, AlignRight, X } from "lucide-react";
import { deleteCookie, getCookie } from 'cookies-next';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

interface SubLink {
  label: string;
  href: string;
}

interface AdminLink {
  label: string;
  sub?: SubLink[];
}

interface NavbarProps {
  adminLinks?: AdminLink[];
}

function Navbar({ adminLinks }: NavbarProps) {
  const router = useRouter();
  // const { user, setIsLogin, isLogin } = {"ji",false,false};
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

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
      // setIsLogin(false);
      router.push('/admin-login');
    } else {
      // setIsLogin(false);
      router.push('/admin-login');
    }
  };

  return (
    <div className="w-full bg-white justify-end flex border-b border-black shadow-lg">
      <nav className="w-full p-3">
        <div className="flex justify-between items-center text-[#11111198]">
          {/* Logo */}
          <div className="text-black w-[25%] lg:w-[40%]">
            <Link href="/admin/dashboard">
              <h1 className="text-2xl lg:text-4xl font-extrabold md:m-2">
                Techy_Teams
              </h1>
            </Link>
          </div>

          {/* Desktop Dropdown */}
          <div className="hidden md:flex justify-end items-center w-[15%] gap-2">
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
            <div className="absolute top-15 right-0 bg-white z-50 m-2 shadow-lg rounded-lg p-4 w-53 sm:w-60">
            

              {/* Mobile Sidebar Links */}
              <div className="flex flex-col justify-between items-start my-5 font-semibold sm:text-lg text-sm gap-4">
                {adminLinks?.map((item, index) => (
                  <div
                    key={index}
                    className="hover:text-[#111111d1] transition-colors duration-300"
                  >
                    {item.label}
                    <div className="flex flex-col">
                      {item.sub?.map((sub, idx) => (
                        <Link
                          key={idx}
                          href={sub.href}
                          onClick={() => setIsOpen(false)}
                          className={
                            pathname === sub.href
                              ? "flex items-center ml-5 border-b border-blue-300 justify-start gap-2 py-2 text-black transition-colors duration-300"
                              : "flex items-center ml-5 border-b border-blue-300 justify-start gap-2 py-2 hover:text-[#111111d1] transition-colors duration-300"
                          }
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
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
