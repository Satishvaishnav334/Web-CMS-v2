// 'use client';
// import { useState, useRef, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import StudioEditor from "@/components/Editor";
// import "@grapesjs/studio-sdk/style";
// import 'grapesjs/dist/css/grapes.min.css';
// import { toast } from "sonner";
// import { usePageContext } from "@/components/context/PageContext";
// import axios from "axios";

// export default function NavbarEditor() {
//     const { id } = useParams(); // menu ID from URL
//     const editorRef = useRef<any>(null);
//     const router = useRouter();
//     const { setDataLoading } = usePageContext();

//     const [menu, setMenu] = useState<{ name: string, items: any[], html?: string, css?: string }>({ name: '', items: [] });
//     const [showEditor, setShowEditor] = useState(true);
//     const [editorKey, setEditorKey] = useState(0);

//     // Fetch menu data
//     useEffect(() => {
//         const fetchMenu = async () => {
//             try {
//                 const res = await axios.get(`/api/admin/menus/${id}`);
//                 setMenu(res.data.menu);
//             } catch (err) {
//                 console.error("Failed to fetch menu:", err);
//             }
//         };
//         if (id) fetchMenu();
//     }, [id]);

//     // Build navbar HTML from menu items
//     function buildNavbarHTML(menuData: any) {
//         if (!menuData?.items || !menuData.items.length) {
//             // Default navbar
//             return `
//       <nav class="bg-blue-600 text-white p-4 flex justify-between items-center">
//         <div class="logo font-bold text-lg">MySite</div>
//         <ul class="flex gap-4">
//           <li><a href="/" class="hover:underline">Home</a></li>
//           <li><a href="/about" class="hover:underline">About</a></li>
//           <li><a href="/contact" class="hover:underline">Contact</a></li>
//         </ul>
//       </nav>
//     `;
//         }

//         const menuItemsHTML = menuData.items.map((item: any) => {
//             if (item.subItems && item.subItems.length) {
//                 const subItemsHTML = item.subItems.map((sub: any) => `
//             <li><a href="${sub.pageId?.slug ? '/' + sub.pageId.slug : '#'}" class="block px-4 py-2 hover:bg-gray-100">${sub.label}</a></li>
//           `).join('');

//                 return `
//             <li class="relative group">
//               <button class="px-4 py-2 hover:bg-gray-700">${item.label}</button>
//               <ul class="absolute hidden group-hover:block bg-white text-black shadow-lg mt-2">
//                 ${subItemsHTML}
//               </ul>
//             </li>
//           `;
//             }

//             return `<li><a href="${item.pageId?.slug ? '/' + item.pageId.slug : '#'}" class="px-4 py-2 hover:bg-gray-700">${item.label}</a></li>`;
//         }).join('');

//         return `
//       <nav class="bg-blue-600 text-white p-4 flex justify-between items-center">
//         <div class="logo font-bold text-lg">MySite</div>
//         <ul class="flex gap-4">
//           ${menuItemsHTML}
//         </ul>
//       </nav>
//     `;
//     }

//     const handleSave = async () => {
//         setDataLoading(true);
//         const editor = editorRef.current;
//         const html = editor ? editor.getHtml() : menu.html || buildNavbarHTML(menu);
//         const css = editor ? editor.getCss() : menu.css || "";

//         try {
//             await axios.put(`/api/admin/menus/style/${id}`, { html, css });
//             toast.success("Navbar updated successfully!");
//         } catch (err) {
//             console.error("Error updating navbar:", err);
//             toast.error("Failed to update navbar!");
//         } finally {
//             setDataLoading(false);
//         }
//     };

//     return (
//         <div className="h-screen flex flex-col bg-gray-100">
//             {/* Header */}
//             <div className="flex justify-between items-center px-6 py-3 border-b bg-gray-900 text-white shadow">
//                 <h2 className="font-semibold text-lg">{menu.name || "Navbar Editor"}</h2>
//                 <div className="flex gap-3">
//                     <button
//                         onClick={handleSave}
//                         className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
//                     >
//                         Save Navbar
//                     </button>
//                     {showEditor && (
//                         <button
//                             onClick={() => {
//                                 if (editorRef.current) editorRef.current.destroy();
//                                 setShowEditor(false);
//                                 setEditorKey(prev => prev + 1);
//                             }}
//                             className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
//                         >
//                             Close Editor
//                         </button>
//                     )}
//                 </div>
//             </div>

//             {/* Info & Open Editor Button */}
//             {!showEditor && (
//                 <div className="flex-1 overflow-y-auto p-8 flex justify-center">
//                     <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg">
//                         <h3 className="text-xl font-semibold mb-6">Navbar Links</h3>
//                         <ul className="flex flex-col gap-2 mb-8">
//                             {menu?.items?.map((item, idx) => (
//                                 <li key={idx} className="text-gray-700">
//                                     {item.label} → {item.pageId?.slug || '#'}
//                                 </li>
//                             ))}
//                         </ul>
//                         <div className="text-center">
//                             <button
//                                 type="button"
//                                 onClick={() => setShowEditor(true)}
//                                 disabled={!menu.items || menu.items.length === 0}
//                                 className="bg-[#364153] hover:bg-[#525b69] transition text-white font-bold py-4 px-12 rounded-xl shadow-lg text-lg disabled:opacity-50"
//                             >
//                                 Open Fullscreen Editor
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* GrapesJS Editor */}
//             {showEditor && (
//                 <div className="flex-1 w-full">
//                     <StudioEditor
//                         key={editorKey}
//                         onEditor={editor => {
//                             editorRef.current = editor;
//                             editor.setComponents(menu.html || buildNavbarHTML(menu));
//                             editor.setStyle(menu.css || `
//         nav { transition: all 0.3s ease; }
//         nav ul li ul { display: none; }
//         nav ul li:hover ul { display: block; }
//       `);
//                         }}
//                         options={{
//                             project: { type: "web" },
//                             modules: ['blocks', 'selector-manager', 'style-manager', 'trait-manager'],
//                             plugins: [],
//                             pages: false,
//                         }}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// }

"use client"
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePageContext } from "@/components/context/PageContext";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, Edit2, Save, Eye, Code } from 'lucide-react';
import axios from 'axios';
const NavbarEditor = () => {
    const [navbarData, setNavbarData] = useState<{ name: string, items: any[], html?: string, css?: string }>({ name: '', items: [] });
    const { setDataLoading } = usePageContext()
    const [editMode, setEditMode] = useState('html');
    const getCurrentData = () => navbarData;
    const setCurrentData = (data: any) => setNavbarData(data);
    const { id } = useParams()

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await axios.get(`/api/admin/menus/${id}`);
                setNavbarData(res.data.menu);
            } catch (err) {
                console.error("Failed to fetch menu:", err);
            }

        };
        fetchMenu();
    }, []);
    console.log(navbarData)
    const renderPreview = (data: any) => {
        let htmlContent = data.html;

        htmlContent = htmlContent?.replace(/\{\{name\}\}/g, data.name);

        const menuHtml = data.items?.map(item => {
            let itemHtml = `
        <div class="navbar-item ${item.subItems && item.subItems.length > 0 ? 'has-dropdown' : ''}">
          <a href="${item.label}" class="navbar-link">
            ${item.label}
            ${item.subItems && item.subItems.length > 0 ? '<span class="dropdown-icon">▼</span>' : ''}
          </a>
      `;

            if (item.subItems && item.subItems.length > 0) {
                itemHtml += '<div class="navbar-dropdown">';
                item.subItems.forEach(sub => {
                    itemHtml += `<a href="${sub.label}" class="dropdown-item">${sub.label}</a>`;
                });
                itemHtml += '</div>';
            }

            itemHtml += '</div>';
            return itemHtml;
        }).join('');


        htmlContent = htmlContent?.replace(/\{\{#each menu\}\}[\s\S]*?\{\{\/each\}\}/g, menuHtml);


        return (
            <div>
                <style>{data.css}</style>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
        );
    };


    const generateRenderedHTML = (data: any) => {
        let htmlContent = data.html || '';
        htmlContent = htmlContent.replace(/\{\{name\}\}/g, data.name);

        const menuHtml = data.items?.map(item => {
            let itemHtml = `
                <div class="navbar-item ${item.subItems && item.subItems.length > 0 ? 'has-dropdown' : ''}">
             <a href="${item.label}" class="navbar-link">
             ${item.label}
            ${item.subItems && item.subItems.length > 0 ? '<span class="dropdown-icon">▼</span>' : ''}
             </a>
                `;

            if (item.subItems && item.subItems.length > 0) {
                itemHtml += '<div class="navbar-dropdown">';
                item.subItems.forEach(sub => {
                    itemHtml += `<a href="${sub.label}" class="dropdown-item">${sub.label}</a>`;
                });
                itemHtml += '</div>';
            }

            itemHtml += '</div>';
            return itemHtml;
        }).join('');
        htmlContent = htmlContent.replace(/\{\{#each menu\}\}[\s\S]*?\{\{\/each\}\}/g, menuHtml);
        return htmlContent;
    };

    const handleSave = async () => {
        const data = getCurrentData();

        const renderedHTML = generateRenderedHTML(data);

        const payload = {
            html: renderedHTML, // rendered HTML instead of template
            css: data.css,
            items: data.items,
            name: data.name,
        };

        try {
            await axios.put(`/api/admin/menus/style/navbar/${id}`, payload);
            toast.success('Navbar saved successfully!')
        } catch (err) {
            console.error("Save failed:", err);
            alert("Failed to save data.");
        }
    };


    return (
        <div className="min-h-screen  bg-gray-100">
            <div className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">Navigation CMS Editor</h1>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                            <Save className="w-4 h-4" />
                            Save
                        </button>

                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1  gap-6">
                    {/* Editor Panel */}
                    <div className="bg-white rounded-lg shadow-lg">
                        <div className="border-b">

                            <div className="flex border-t">
                                <button
                                    onClick={() => setEditMode('html')}
                                    className={`flex-1 px-4 py-2 text-sm font-medium ${editMode === 'html' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                                >
                                    HTML
                                </button>
                                <button
                                    onClick={() => setEditMode('css')}
                                    className={`flex-1 px-4 py-2 text-sm font-medium ${editMode === 'css' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                                >
                                    CSS
                                </button>
                            </div>
                        </div>

                        <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto">


                            {editMode === 'html' && (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="block font-semibold text-lg">HTML Template</label>
                                        <span className="text-sm text-gray-500">Use Handlebars syntax</span>
                                    </div>
                                    <div className="text-xs bg-blue-50 p-3 rounded border border-blue-200">
                                        <p className="font-semibold mb-1">Available Variables:</p>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                                            <li><code className="bg-white px-1 rounded">{'{{name}}'}</code> - Navigation name</li>
                                            <li><code className="bg-white px-1 rounded">{'{{#each menu}}'}</code> - Loop through menu items</li>
                                            <li><code className="bg-white px-1 rounded">{'{{label}}'}</code> - Menu item label</li>
                                            <li><code className="bg-white px-1 rounded">{'{{label}}'}</code> - Menu item link</li>
                                            <li><code className="bg-white px-1 rounded">{'{{#each subItems}}'}</code> - Loop through sub items</li>
                                        </ul>
                                    </div>
                                    <textarea
                                        defaultValue={navbarData?.html}
                                        value={getCurrentData().html}
                                        onChange={(e) => setCurrentData({ ...getCurrentData(), html: e.target.value })}
                                        className="w-full border rounded p-3 font-mono text-sm"
                                        rows="18"
                                        placeholder="Enter HTML template..."
                                    />
                                </div>
                            )}

                            {editMode === 'css' && (
                                <div className="space-y-3">
                                    <label className="block font-semibold text-lg">CSS Styles</label>
                                    <textarea
                                        defaultValue={navbarData?.css}
                                        value={getCurrentData().css}
                                        onChange={(e) => setCurrentData({ ...getCurrentData(), css: e.target.value })}
                                        className="w-full border rounded p-3 font-mono text-sm"
                                        rows="20"
                                        placeholder="Enter CSS styles..."
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Live Preview Panel */}
                    <div className="bg-white rounded-lg shadow-lg sticky top-6">
                        <div className="border-b px-6 py-3 bg-gray-50">
                            <div className="flex items-center gap-2">
                                <Eye className="w-5 h-5 text-gray-600" />
                                <h2 className="font-semibold text-lg">Live Preview</h2>
                            </div>
                        </div>
                        <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto">
                            {renderPreview(getCurrentData())}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavbarEditor;