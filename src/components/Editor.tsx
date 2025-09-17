"use client";

import { useEffect, useRef } from "react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { usePageContext } from "./context/PageContext";

export default function GrapesEditor() {
  const editorRef = useRef<Editor | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const { slug, setSlug } = usePageContext()
  useEffect(() => {
    let isMounted = true;

    const loadEditor = async () => {
      const gjsPresetWebpage = (await import("grapesjs-preset-webpage")).default;
      const gjsBlocksBasic = (await import("grapesjs-blocks-basic")).default;
      const gjsForms = (await import("grapesjs-plugin-forms")).default;
      const gjsNavbar = (await import("grapesjs-navbar")).default;
      const gjsGradient = (await import("grapesjs-style-gradient")).default;
      const gjsExport = (await import("grapesjs-plugin-export")).default;

      if (isMounted && editorContainerRef.current && !editorRef.current) {
        editorRef.current = grapesjs.init({
          container: editorContainerRef.current,
          height: "90vh",
          width: "auto",
          storageManager: {
            type: "local",
            autosave: true,
            autoload: true,
            stepsBeforeSave: 1,
          },
          plugins: [
            gjsPresetWebpage,
            gjsBlocksBasic,
            gjsForms,
            gjsNavbar,
            gjsGradient,
            gjsExport,
          ],
          pluginsOpts: {
            "gjs-preset-webpage": {},
            "gjs-blocks-basic": {},
            "gjs-plugin-forms": {},
            "gjs-navbar": {},
            "gjs-style-gradient": {},
            "gjs-plugin-export": {},
          },
        });
      }
    };

    loadEditor();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    if (editorRef.current) {
      const html = editorRef.current.getHtml();
      const css = editorRef.current.getCss();
      const json = editorRef.current.getComponents();
      const pageData = {
        slug: slug,
        html,
        css,
        json: json,
        status:"draft",
      };
      try {
        await fetch("/api/admin/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pageData),
        });
      }
      catch(err){
          console.log(err)
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div ref={editorContainerRef} />
      <div className="p-4 border-t flex justify-end bg-gray-100">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Page
        </button>
      </div>
    </div>

  );
}
