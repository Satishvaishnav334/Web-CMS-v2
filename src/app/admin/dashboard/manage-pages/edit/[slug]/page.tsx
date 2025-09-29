"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import StudioEditor from "@grapesjs/studio-sdk/react";
import "@grapesjs/studio-sdk/style";
import 'grapesjs-component-code-editor'; // Code editor plugin
import 'grapesjs-component-code-editor/dist/grapesjs-component-code-editor.min.css';
import axios from "axios";

export default function EditPage() {
  const router = useRouter();
  const { slug } = useParams();

  const [pageName, setPageName] = useState("");
  const [pageslug, setSlug] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [status, setStatus] = useState("draft");
  const [page, setPage] = useState<any>(null);
  const [showEditor, setShowEditor] = useState(false);

  // Editor reference
  const [editorRef, setEditorRef] = useState<any>(null);
  const [editorKey, setEditorKey] = useState(0); // force remount

  // Fetch page from DB
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await axios.get(`/api/admin/pages/${slug}`);
        const data = res.data.page;
        setPage(data);

        if (data) {
          setPageName(data.pageName || "");
          setSlug(data.slug || "");
          setSeoTitle(data.seoTitle || "");
          setSeoDescription(data.seoDescription || "");
          setSeoKeywords((data.seoKeywords || []).join(", "));
          setStatus(data.status || "draft");
        }
      } catch (err) {
        console.error("Failed to fetch page:", err);
      }
    };
    if (slug) fetchPage();
  }, [slug]);

  // Save or publish page
  const handleSave = async (publish: boolean = false) => {
    const html = editorRef ? editorRef.getHtml() : page?.html;
    const css = editorRef ? editorRef.getCss() : page?.css;
    const json = editorRef ? editorRef.getComponents().toJSON() : page?.json;

    const pageData = {
      pageName,
      newslug: pageslug || slug,
      seoTitle,
      seoDescription,
      seoKeywords: seoKeywords.split(",").map(s => s.trim()).filter(Boolean),
      html,
      css,
      json,
      status: publish ? "published" : "draft",
    };

    try {
      await fetch(`/api/admin/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData),
      });

      setPage({ ...page, ...pageData });

      if (editorRef) {
        editorRef.DomComponents.clear(); // clear components (HTML)
        editorRef.CssComposer.clear();   // clear styles (CSS)
        editorRef.UndoManager.clear();   // clear undo/redo history
      }
    } catch (err) {
      console.error("Error saving page:", err);
    } finally {
      
      if (editorRef) {
        editorRef.destroy();
        setEditorRef(null);
      }
      setShowEditor(false);
      setEditorKey(prev => prev + 1); // reinit with clean editor
      router.push("/admin/dashboard");
    }
  };


  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <div className="flex justify-between items-center px-6 py-3 border-b bg-gray-900 text-white shadow">
        <h2 className="font-semibold text-lg">{pageName || "Untitled Page"}</h2>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave()}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Save To Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Save & Publish
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

      {/* Form */}
      {!showEditor && (
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-6">Page Details</h3>
            <form className="grid grid-cols-2 gap-6">
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

              <div className="flex flex-col col-span-2">
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
             <div className="mt-8 text-center">
            {/* Open Editor */}
            <button
              type="button"
              onClick={() => setShowEditor(true)}
              className="mt-6 bg-[#364153] hover:bg-[#525b69] transition text-white font-bold py-5 px-10 rounded-xl shadow-xl text-lg w-fit mx-auto"
            >
              Open Fullscreen Code Editor
            </button>
            </div>
          </div>

        </div>
      )}

      {/* Fullscreen Studio Editor */}
      {showEditor && (
        <div className="flex-1 h-full w-full">
          <StudioEditor
            key={editorKey}
            onEditor={(editor) => {
              setEditorRef(editor);

              // Load existing content after editor is ready
              setTimeout(() => {
                if (page) {
                  if (page.json) editor.setComponents(page.json);
                  else if (page.html) editor.setComponents(page.html);

                  if (page.css) editor.setStyle(page.css);
                }
              }, 100);
            }}
            options={{
              project: { type: "web" },
               modules: ['blocks', 'selector-manager', 'style-manager', 'trait-manager'], // disable pages
              plugins: ['grapesjs-component-code-editor'],
              pluginsOpts: {
                'grapesjs-component-code-editor': {
                  panel: {
                    buttons: [
                      {
                        attributes: { title: 'Open Code Editor' },
                        className: 'fa fa-code',
                        command: 'open-code',
                      },
                    ],
                  },
                },
              },
              pages: false,
              fromElement: true,
            }}
          />
        </div>
      )}
    </div>
  );
}
