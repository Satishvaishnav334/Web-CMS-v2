"use client";
import React, { useEffect, useState } from "react";
import { AlignRight, X, ChevronDown } from "lucide-react";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

// --------------------
// Types
// --------------------
interface PageRef {
  _id?: string;
  slug?: string;
}

interface SubItem {
  id?: string;
  _id?: string;
  label: string;
  pageId?: string | PageRef; // can be either a string id OR the full page object (with slug)
}

interface MenuItem {
  id?: string;
  _id?: string;
  label: string;
  type: "page" | "dropdown" | "link"; // support both "page" and "link" if needed
  pageId?: string | PageRef;
  subItems?: SubItem[];
}

interface NavbarProps {
  links?: MenuItem[];
}

const buildHref = (pageId?: string | PageRef) => {
  // prefer pageId.slug if pageId is an object with slug
  if (pageId && typeof pageId === "object" && (pageId as PageRef).slug) {
    return `/pages/${(pageId as PageRef).slug}`;
  }
  return "/";
};
export default function Navbar({ links = [] }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const [isOpen, setIsOpen] = useState<boolean>(false); // mobile menu
  const [openIndex, setOpenIndex] = useState<number | null>(null); // which dropdown is open on desktop
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    // optional refresh (you had this before)
    router.refresh();

    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  const Logout = async () => {
    const token = getCookie("token");
    if (token) {
      deleteCookie("token");
      toast.info("Logout Successfully", { closeButton: true });
      setIsLogin(false);
      router.push("/login");
    } else {
      setIsLogin(false);
      router.push("/login");
    }
  };

  return (
    <div className="w-full fixed !top-0 min-h-20 justify-center  bg-white items-center flex border-b border-black shadow-lg z-40"  style={{ paddingLeft: 24, paddingRight: 24 }}>
      <nav className="w-full ">
        <div className="flex justify-between items-center text-[#11111198]">
          {/* Logo */}
          <div className="text-black w-[25%] flex   !p-5 lg:w-[40%]">
            <Link href="/">
              <h1 className="text-2xl lg:text-4xl font-extrabold md:m-2">
                Web CMS 2.0
              </h1>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex justify-end items-center w-[55%] lg:w-[56%] font-semibold lg:text-lg text-sm  !px-5 gap-10">
            {links.map((item, index) => {
              const isDropdown = item.type === "dropdown";
              const href = buildHref(item.pageId);

              return isDropdown ? (
                <div
                  key={item.id ?? item._id ?? index}
                  className="relative"
                  onMouseEnter={() => setOpenIndex(index)}
                 
                >
                  {/* dropdown parent has NO href (button) */}
                  <button
                    type="button"
                    className={
                      "inline-flex items-center !gap-2 cursor-pointer select-none " +
                      (openIndex === index ? "text-black" : "hover:text-[#111111d1]")
                    }
                    onFocus={() => setOpenIndex(index)}
                    onBlur={() => setOpenIndex(null)}
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={16} />
                  </button>

                  {/* Submenu */}
                  <div
                    className={`absolute !left-0 !top-16 !text-xl full mt-1 bg-white shadow-lg rounded-md py-1 min-w-[150px] z-50 ${
                      openIndex === index ? "block" : "hidden"
                    }`}
                    onMouseLeave={() => setOpenIndex(null)}
                    style={{paddingLeft: 15, paddingRight: 15,paddingTop: 15, paddingBottom: 15}}
                  >
                    {item.subItems?.map((sub, j) => (
                      <Link
                      
                        key={sub.id ?? sub._id ?? j}
                        href={buildHref(sub?.pageId)}
                        className={
                          "block px-4 py-2 text-sm hover:bg-gray-100 " +
                          (pathname === buildHref(sub.pageId) ? "font-semibold" : "")
                        }
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                // top-level page/link (has href)
                <Link
                  key={item.id ?? item._id ?? index}
                  href={href}
                  className={`${
                    pathname === href ? "text-black font-semibold" : "hover:text-[#111111d1]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <button
              onClick={() => Logout()}
              className="py-2 px-4 bg-red-500 hover:bg-red-400 text-white rounded-lg"
               style={{ paddingLeft: 15, paddingRight: 15 ,paddingTop: 5, paddingBottom: 5}}
            >
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
            <div className="absolute !top-16 !right-2 bg-white z-50 !m-2 shadow-lg rounded-lg !p-4 !w-56">
              <div className="flex flex-col justify-between items-start !my-2 font-semibold text-lg !gap-4">
                {links.map((item, index) => {
                  const isDropdown = item.type === "dropdown";
                  const href = buildHref(item.pageId);

                  return isDropdown ? (
                    <div key={item.id ?? item._id ?? index} className="w-full">
                      <span className="block !py-2 font-semibold">{item.label}</span>
                      {item.subItems?.map((sub, j) => (
                        <Link
                          key={sub.id ?? sub._id ?? j}
                          href={buildHref(sub.pageId)}
                          onClick={() => setIsOpen(false)}
                          className="block !pl-4 !py-1 text-sm hover:text-[#111111d1]"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={item.id ?? item._id ?? index}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={
                        pathname === href
                          ? "py-1 text-black transition-colors duration-300"
                          : "py-2 hover:text-[#111111d1] transition-colors duration-300"
                      }
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <button
                  onClick={() => {
                    Logout();
                    setIsOpen(false);
                  }}
                  className="py-2 px-4 bg-red-500 hover:bg-red-400 rounded-lg w-full text-center"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
