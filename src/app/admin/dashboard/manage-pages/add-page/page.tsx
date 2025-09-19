"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { useRouter } from "next/navigation";

export default function AddPage() {
    const editorRef = useRef<Editor | null>(null);
    const editorContainerRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    // Form state
    const [pageName, setPageName] = useState("");
    const [pageslug, setSlug] = useState("");
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDescription, setSeoDescription] = useState("");
    const [seoKeywords, setSeoKeywords] = useState("");
    const [status, setStatus] = useState("draft");

    const [showEditor, setShowEditor] = useState(false);

    // Init GrapesJS when editor opens
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
                    panels: { defaults: [] }, // clear default so we control toolbar
                });

                // ✅ Add "open code" buttons for HTML & CSS
                editor.Panels.addButton("options", [
                    {
                        id: "open-html",
                        className: "fa fa-code",
                        command: "open-html",
                        attributes: { title: "Edit HTML" },
                    },
                    {
                        id: "open-css",
                        className: "fa fa-paint-brush",
                        command: "open-css",
                        attributes: { title: "Edit CSS" },
                    },
                ]);

                // ✅ Command: Edit HTML
                editor.Commands.add("open-html", {
                    run(editor) {
                        const html = editor.getHtml();
                        const css = editor.getCss();

                        const newHtml = prompt("Edit HTML:", html);
                        if (newHtml !== null) {
                            editor.setComponents(newHtml);
                        }
                    },
                });

                // ✅ Command: Edit CSS
                editor.Commands.add("open-css", {
                    run(editor) {
                        const css = editor.getCss();
                        const newCss = prompt("Edit CSS:", css);
                        if (newCss !== null) {
                            editor.setStyle(newCss);
                        }
                    },
                });


                editorRef.current = editor;
            };

            loadEditor();
        }
    }, [showEditor]);

    const handleSave = async (publish: boolean = false) => {
        const html = editorRef.current ? editorRef.current.getHtml() : "";
        const css = editorRef.current ? editorRef.current.getCss() : "";
        const json = editorRef.current ? editorRef.current.getComponents().toJSON() : null;

        const pageData = {
            pageName,
            slug: pageslug || pageName.toLowerCase().replace(/\s+/g, "-"),
            seoTitle,
            seoDescription,
            seoKeywords: seoKeywords.split(",").map((s) => s.trim()).filter(Boolean),
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
        } catch (err) {
            console.error("Error saving page:", err);
        }
        finally {
            router.push("/admin/dashboard/manage-pages"); // redirect if saving from form only

        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Navbar always visible */}
            <div className="flex justify-between items-center px-6 py-3 border-b bg-gray-900 text-white">
                <h2 className="font-semibold text-lg">{pageName || "New Page"}</h2>
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
                    {showEditor && (
                        <button
                            onClick={() => setShowEditor(false)}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                        >
                            Close Editor
                        </button>
                    )}
                </div>
            </div>

            {/* Form only */}
            {!showEditor && (
                <div className="flex-1 overflow-y-auto p-6">
                    <form className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-md">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold">Page Name</label>
                            <input
                                type="text"
                                value={pageName}
                                onChange={(e) => setPageName(e.target.value)}
                                className="border p-2 rounded"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold">Slug</label>
                            <input
                                type="text"
                                value={pageslug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="border p-2 rounded"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold">SEO Title</label>
                            <input
                                type="text"
                                value={seoTitle}
                                onChange={(e) => setSeoTitle(e.target.value)}
                                className="border p-2 rounded"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold">SEO Description</label>
                            <textarea
                                value={seoDescription}
                                onChange={(e) => setSeoDescription(e.target.value)}
                                className="border p-2 rounded"
                            />
                        </div>

                        <div className="flex flex-col col-span-2">
                            <label className="text-sm font-semibold">SEO Keywords</label>
                            <input
                                type="text"
                                value={seoKeywords}
                                onChange={(e) => setSeoKeywords(e.target.value)}
                                className="border p-2 rounded"
                            />
                        </div>
                    </form>

                    {/* Big button to open editor */}
                    <button
                        type="button"
                        onClick={() => setShowEditor(true)}
                        className="mt-6 bg-indigo-600 hover:bg-indigo-700 transition text-white font-bold py-5 px-10 rounded-xl shadow-xl text-lg w-fit mx-auto"
                    >
                        Open Fullscreen Code Editor
                    </button>
                </div>
            )}

            {/* Fullscreen editor */}
            {showEditor && (
                <div className="flex-1 w-full">
                    <div ref={editorContainerRef} className="w-full h-full" />
                </div>
            )}
        </div>
    );
}
