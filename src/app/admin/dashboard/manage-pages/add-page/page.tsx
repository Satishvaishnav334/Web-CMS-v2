"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { useRouter } from "next/navigation";

export default function GrapesEditor() {
    const editorRef = useRef<Editor | null>(null);
    const editorContainerRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    // ✅ Form state
    const [pageName, setPageName] = useState("");
    const [slug, setSlug] = useState("");
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDescription, setSeoDescription] = useState("");
    const [seoKeywords, setSeoKeywords] = useState("");

    const [showEditor, setShowEditor] = useState(false);
    const [isSaved, setIsSaved] = useState(true);

    // ✅ Warn before unload
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!isSaved) {
                e.preventDefault();
                e.returnValue = "You have unsaved changes. Save as draft before leaving?";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isSaved]);

    // ✅ Init GrapesJS only when editor is opened
    useEffect(() => {
        if (showEditor && editorContainerRef.current && !editorRef.current) {
            const loadEditor = async () => {
                const gjsPresetWebpage = (await import("grapesjs-preset-webpage")).default;
                const gjsBlocksBasic = (await import("grapesjs-blocks-basic")).default;
                const gjsForms = (await import("grapesjs-plugin-forms")).default;
                const gjsNavbar = (await import("grapesjs-navbar")).default;
                const gjsGradient = (await import("grapesjs-style-gradient")).default;
                const gjsExport = (await import("grapesjs-plugin-export")).default;

                const editor = grapesjs.init({
                    container: editorContainerRef.current,
                    height: "100%",
                    width: "100%",
                    storageManager: { type: "local", autosave: false, autoload: false },
                    plugins: [gjsPresetWebpage, gjsBlocksBasic, gjsForms, gjsNavbar, gjsGradient, gjsExport],
                });

                editor.on("update", () => setIsSaved(false));
                editorRef.current = editor;
            };

            loadEditor();
        }
    }, [showEditor]);

    const clearEditor = (editor: Editor) => {
        try {
            editor.DomComponents.clear();
            editor.CssComposer.clear();
            editor.setComponents("");
            editor.setStyle("");
        } catch (err) {
            console.warn("Clear failed, fallback used", err);
        }
    };

    const handleSave = async (publish: boolean = false) => {
        if (!editorRef.current) return;

        const html = editorRef.current.getHtml();
        const css = editorRef.current.getCss();
        const json = editorRef.current.getComponents().toJSON();

        // frontend: send flat seo fields
        const pageData = {
            pageName,
            slug,
            seoTitle: seoTitle,
            seoDescription: seoDescription,
            seoKeywords: seoKeywords.split(",").map(s => s.trim()).filter(Boolean),
            html,
            css,    
            json,
            status: publish ? "published" : "draft",
        };


        try {
            await fetch("/api/admin/pages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pageData),
            });
            console.log(pageData)
            clearEditor(editorRef.current);
            setIsSaved(true);
        } catch (err) {
            console.error("Error saving page:", err);
        } finally {
            setShowEditor(false);
            router.push("/admin/dashboard/manage-pages");
        }
    };

    // ✅ Validate uniqueness before opening editor
    const validatePage = async () => {
        if (!pageName.trim() || !slug.trim()) {
            alert("Page Name and Slug are required");
            return false;
        }

        try {
            const res = await axios.get("/api/admin/pages");
            const data = await res.data;
            console.log(data)
            const exists = data.some(
                (p: any) =>
                    p.slug.toLowerCase() === slug.toLowerCase() ||
                    p.pageName.toLowerCase() === pageName.toLowerCase()
            );

            if (exists) {
                alert("Page Name or Slug already exists, please choose another.");
                return false;
            }
        } catch (err) {
            console.error("Failed to fetch pages", err);
            return false;
        }

        return true;
    };

    const handleOpenEditor = async () => {
        const isValid = await validatePage();
        if (isValid) setShowEditor(true);
    };

    return (
        <div className="h-screen flex flex-col gap-6 p-6 bg-gray-50">
            {/* ✅ Page details form */}
            <form className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-md">
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Page Name</label>
                    <input
                        type="text"
                        value={pageName}
                        onChange={(e) => setPageName(e.target.value)}
                        className="border p-2 rounded"
                        placeholder="Enter page name"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Slug</label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="border p-2 rounded"
                        placeholder="unique-slug"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">SEO Title</label>
                    <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        className="border p-2 rounded"
                        placeholder="SEO optimized title"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">SEO Description</label>
                    <textarea
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        className="border p-2 rounded"
                        placeholder="Short SEO description"
                    />
                </div>
                <div className="flex flex-col col-span-2">
                    <label className="text-sm font-semibold">SEO Keywords</label>
                    <input
                        type="text"
                        value={seoKeywords}
                        onChange={(e) => setSeoKeywords(e.target.value)}
                        className="border p-2 rounded"
                        placeholder="keyword1, keyword2, keyword3"
                    />
                </div>
            </form>

            {/* ✅ Big button to open editor */}
            <button
                type="button"
                onClick={handleOpenEditor}
                className="bg-indigo-600 hover:bg-indigo-700 transition text-white font-bold py-5 px-10 rounded-xl shadow-xl text-lg w-fit mx-auto"
            >
                Open Fullscreen Code Editor
            </button>

            {/* ✅ Fullscreen Editor Overlay */}
            {showEditor && (
                <div className="fixed inset-0 bg-white z-50 flex flex-col">
                    {/* Editor Header */}
                    <div className="flex justify-between items-center px-6 py-3 border-b bg-gray-900 text-white">
                        <h2 className="font-semibold text-lg">{pageName || "Untitled Page"}</h2>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleSave()}
                                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                            >
                                Save Draft
                            </button>
                            <button
                                onClick={() => handleSave(true)}
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                            >
                                Publish
                            </button>
                            <button
                                onClick={() => setShowEditor(false)}
                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    {/* GrapesJS Editor */}
                    <div ref={editorContainerRef} className="flex-1 w-full" />
                </div>
            )}
        </div>
    );
}
