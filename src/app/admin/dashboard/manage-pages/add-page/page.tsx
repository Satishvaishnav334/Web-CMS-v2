"use client";

import { useEffect, useRef } from "react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { usePageContext } from "@/components/context/PageContext";
import { useRouter } from "next/navigation";
export default function GrapesEditor() {
    const editorRef = useRef<Editor | null>(null);
    const editorContainerRef = useRef<HTMLDivElement | null>(null);
    const { slug, setSlug } = usePageContext()

    const router = useRouter()
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
    const clearEditor = (editor: Editor) => {
    try {
      editor.DomComponents.clear();
      editor.CssComposer.clear();
    } catch (err) {
      console.warn("Clear failed, fallback used", err);
      editor.setComponents("");
     
    }
  };
    const handleSave = async () => {
        if (!editorRef.current) return;

        const html = editorRef.current.getHtml();
        const css = editorRef.current.getCss();
        const json = editorRef.current.getComponents().toJSON();
        const styles = editorRef.current.getStyle().toJSON();

        const pageData = {
            slug,
            html,
            css,
            json,
            styles,
            status: "draft",
        };

        try {
            await fetch("/api/admin/pages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pageData),
            });
             clearEditor(editorRef.current);
            } catch (err) {
                console.error("Error saving page:", err);
            }
            finally{
                router.push('/admin/dashboard/manage-pages')
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
