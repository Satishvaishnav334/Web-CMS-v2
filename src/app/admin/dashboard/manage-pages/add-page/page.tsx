'use client';
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import StudioEditor from "@grapesjs/studio-sdk/react";
import "@grapesjs/studio-sdk/style";
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-component-code-editor/dist/grapesjs-component-code-editor.min.css';
import 'grapesjs-component-code-editor';
import { toast } from "sonner"
import { usePageContext } from "@/components/context/PageContext";
export default function AddPage() {
    const neweditorRef = useRef<any>(null);
    const router = useRouter();

    const [pageName, setPageName] = useState("");
    const [pageslug, setSlug] = useState("");
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDescription, setSeoDescription] = useState("");
    const [seoKeywords, setSeoKeywords] = useState("");
    const [showEditor, setShowEditor] = useState(false);
    const [slugEdited, setSlugEdited] = useState(false);
    const [editorKey, setEditorKey] = useState(0);
    const { setDataLoading } = usePageContext()
    // Auto-fill slug
    useEffect(() => {
        if (!slugEdited && pageName) {
            setSlug(pageName.toLowerCase().replace(/\s+/g, "-"));
        }
    }, [pageName, slugEdited]);

    const handleSave = async (publish: boolean = false) => {
        setDataLoading(true)
        const neweditor = neweditorRef.current;
        const html = neweditor ? neweditor.getHtml() : "";
        const css = neweditor ? neweditor.getCss() : "";
        const json = neweditor ? neweditor.getComponents().toJSON() : null;

        const pageData = {
            pageName,
            slug: pageslug,
            seoTitle,
            seoDescription,
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
            toast.success(`${pageName} Page Created Succesfully`)
        } catch (err) {
            console.error("Error saving page:", err);
        } finally {
            setDataLoading(false)
            if (neweditorRef.current) {
                neweditorRef.current.destroy();
                neweditorRef.current = null;
            }
            setShowEditor(false);
            setEditorKey(prev => prev + 1);
            router.push("/admin/dashboard");
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Navbar */}
            <div className="flex justify-between items-center px-6 py-3 border-b bg-gray-900 text-white shadow">
                <h2 className="font-semibold text-lg">{pageName || "New Page"}</h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleSave()}
                        className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded disabled:opacity-50"
                        disabled={!pageName || !pageslug}
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
                        disabled={!pageName || !pageslug}
                    >
                        Publish
                    </button>
                    {showEditor && (
                        <button
                            onClick={() => {
                                if (neweditorRef.current) {
                                    neweditorRef.current.destroy();
                                    neweditorRef.current = null;
                                }
                                setShowEditor(false);
                                setEditorKey(prev => prev + 1);
                            }}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                        >
                            Close Editor
                        </button>
                    )}
                </div>
            </div>

            {/* Form view */}
            {!showEditor && (
                <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                    <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-semibold mb-6">Page Details</h3>
                        <form className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold mb-1">Page Name</label>
                                <input
                                    type="text"
                                    value={pageName}
                                    onChange={(e) => { setPageName(e.target.value); setSlugEdited(false); }}
                                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Enter page name"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold mb-1">Slug</label>
                                <input
                                    type="text"
                                    value={pageslug}
                                    onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
                                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="auto-generated or custom slug"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold mb-1">SEO Title</label>
                                <input
                                    type="text"
                                    value={seoTitle}
                                    onChange={(e) => setSeoTitle(e.target.value)}
                                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="SEO-friendly title"
                                />
                            </div>
                            <div className="flex flex-col col-span-2">
                                <label className="text-sm font-semibold mb-1">SEO Description</label>
                                <textarea
                                    value={seoDescription}
                                    onChange={(e) => setSeoDescription(e.target.value)}
                                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    rows={3}
                                    placeholder="Meta description for SEO"
                                />
                            </div>
                            <div className="flex flex-col col-span-2">
                                <label className="text-sm font-semibold mb-1">SEO Keywords</label>
                                <input
                                    type="text"
                                    value={seoKeywords}
                                    onChange={(e) => setSeoKeywords(e.target.value)}
                                    className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="comma, separated, keywords"
                                />
                            </div>
                        </form>
                        <div className="mt-8 text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    // bump key so editor mounts fresh
                                    setEditorKey(prev => prev + 1);
                                    setShowEditor(true);
                                }}
                                disabled={!pageName || !pageslug}
                                className="bg-[#364153] hover:bg-[#525b69] transition text-white font-bold py-4 px-12 rounded-xl shadow-lg text-lg disabled:opacity-50"
                            >
                                Open Fullscreen Code Editor
                            </button>
                            {!pageName || !pageslug && (
                                <p className="text-sm text-red-500 mt-2">
                                    Enter Page Name and Slug before opening editor
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Fullscreen Studio Editor */}
            {showEditor && (
                <div className="flex-1 w-full">
                    <StudioEditor
                        key={editorKey}
                        onEditor={(editor) => {
                            neweditorRef.current = editor;
                            editor.setComponents('');
                            editor.setStyle('');
                        }}
                        options={{
                            project: { type: "web" },
                            modules: ['blocks', 'selector-manager', 'style-manager', 'trait-manager'],
                            // ❌ remove `grapesjs-component-code-editor`
                            plugins: [],
                            pages: false,
                        }}
                    />

                </div>
            )}
        </div>
    );
}
