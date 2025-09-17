"use client";

import { useEffect, useRef } from "react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { usePageContext } from "@/components/context/PageContext";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function GrapesEditor() {
    const editorRef = useRef<Editor | null>(null);
    const editorContainerRef = useRef<HTMLDivElement | null>(null);
    const { slug } = usePageContext();
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

                // fetch page data by slug
                // fetch page data by slug
                if (slug) {
                    try {
                        const res = await axios.get(`/api/admin/pages/${slug}`);
                        const page = res.data.page;

                        if (page && editorRef.current) {
                            // restore components (json or html)
                            if (page.json) {
                                editorRef.current.setComponents(page.json);
                            } else if (page.html) {
                                editorRef.current.setComponents(page.html);
                            }

                            // restore CSS
                            if (page.css) {
                                editorRef.current.setStyle(page.css);
                            }
                        }
                    } catch (err) {
                        console.error("Failed to load page:", err);
                    }
                }

            }
        };

        loadEditor();

        return () => {
            isMounted = false;
        };
    }, [slug]);

    const clearEditor = (editor: Editor) => {
        try {
            editor.DomComponents.clear();
            editor.CssComposer.clear();
        } catch (err) {
            console.warn("Clear failed, fallback used", err);
            editor.setComponents("");
            editor.setStyle("");
        }

    };
    const handleSave = async (publish: boolean = false) => {
        if (!editorRef.current) return;

        const html = editorRef.current.getHtml();
        const css = editorRef.current.getCss();
        const json = editorRef.current.getComponents().toJSON();

        const pageData = {
            slug,
            html,
            css,
            json,
            status: publish ? "published" : "draft", // ✅ control status here
        };

        try {
            await fetch(`/api/admin/pages/${slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pageData),
            });

            clearEditor(editorRef.current);
        } catch (err) {
            console.error("Error saving page:", err);
        }
        finally {
            router.push('/admin/dashboard/manage-pages')
        }
    };

    return (
        <div className="flex flex-col justify-between h-screen">
            {/* Editor container */}
            <div ref={editorContainerRef} className="!h-screen w-full" />

            {/* Fixed-position buttons */}
            <div className="fixed  w-full justify-center items-center top-1 flex gap-3 z-50">
                <button
                    onClick={() => handleSave()}
                    className="bg-gray-600 cursor-pointer text-white px-2 py-1 text-sm rounded shadow-lg"
                >
                    Save 
                </button>

                <button
                    onClick={() => handleSave(true)}
                    className="bg-gray-400 cursor-pointer text-white px-2 py-1 text-sm rounded shadow-lg"
                >
                    Publish 
                </button>
            </div>
        </div>
    );
}
