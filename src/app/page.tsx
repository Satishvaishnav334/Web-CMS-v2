// // import dynamic from "next/dynamic";

// // const GrapesEditor = dynamic(() => import("@/components/Editor"), { // Disable SSR for GrapesJS
// // });

// // export default function AdminPage() {
// //   return (
// //     <div className="">
// //       <GrapesEditor />
// //     </div>
// //   );
// // }


"use client";

import React, { useEffect, useState } from "react";

type SavedPage = {
  html?: string;
  css?: string;
  json?: any;
};

export default function RenderSavedPage() {
  const [page, setPage] = useState<SavedPage | null>(null);

  useEffect(() => {
    const savedStr = localStorage.getItem("savedPage");
    if (savedStr) {
      try {
        const parsed: SavedPage = JSON.parse(savedStr);
        setPage(parsed);
      } catch (e) {
        console.error("Failed to parse saved page:", e);
      }
    }
  }, []);

  if (!page) return <div>Loading...</div>;

  return (
    <div className="bg-white">
      {/* Inject saved CSS */}
      <style dangerouslySetInnerHTML={{ __html: page.css || "" }} />

      {/* Inject saved HTML */}
      <div dangerouslySetInnerHTML={{ __html: page.html || "" }} />
    </div>
  );
}



