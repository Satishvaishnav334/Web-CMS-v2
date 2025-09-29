"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  pageId?: string | PageRef; // can be string id or page object
}

interface MenuItem {
  id?: string;
  _id?: string;
  label: string;
  type: "page" | "dropdown" | "link";
  pageId?: string | PageRef;
  subItems?: SubItem[];
}

interface FooterProps {
  links?: MenuItem[];
}

// Build href from pageId
const buildHref = (pageId?: string | PageRef) => {
  if (pageId && typeof pageId === "object" && (pageId as PageRef).slug) {
    return `/pages/${(pageId as PageRef).slug}`;
  }
  return "/";
};

export default function Footer({ links = [] }: FooterProps) {
  const pathname = usePathname() || "/";
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <footer className="w-full bg-gray-900 text-white !mb-0 !py-10 !px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        {/* Logo / Branding */}
        <div className="w-full md:w-1/3">
          <Link href="/">
            <h1 className="text-2xl font-extrabold">Web CMS 2.0</h1>
          </Link>
          <p className="mt-2 text-sm text-gray-400">
            © {new Date().getFullYear()} Web CMS 2.0. All rights reserved.
          </p>
        </div>

        {/* Footer Links */}
        <div className="w-full md:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {links.map((item, index) => {
            const isDropdown = item.type === "dropdown";
            const href = buildHref(item.pageId);

            return (
              <div key={item.id ?? item._id ?? index}>
                {isDropdown ? (
                  
                    <div className="flex flex-col">
                      <button
                        type="button"
                        className=" !gap-5 font-semibold !mb-2"
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      >
                        {item.label}

                      </button>
                      <ul
                        className={`!space-y-5 text-sm flex flex-col  `}
                      >
                        {item.subItems?.map((sub, j) => (
                          <li key={sub.id ?? sub._id ?? j}>
                            <Link
                              href={buildHref(sub.pageId)}
                              className={`hover:underline ${pathname === buildHref(sub.pageId) ? "font-semibold" : ""
                                }`}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                 
                ) : (
                  <div>
                    <Link
                      href={href}
                      className={`font-semibold hover:underline ${pathname === href ? "text-gray-200" : "text-gray-400"
                        }`}
                    >
                      {item.label}
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
