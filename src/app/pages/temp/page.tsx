// "use client"
// import React, { useState, useEffect } from 'react';
// import { Plus, Trash2, ChevronDown, ChevronRight, Edit2, Save, Eye, Code } from 'lucide-react';
// import axios from 'axios';

const NavbarEditor = () => {}
//   const [navbarData, setNavbarData] = useState<{ name: string, items: any[], html?: string, css?: string }>({ name: '', items: [] });
//   useEffect(() => {
//     const fetchMenu = async () => {
//       try {
//         const res = await axios.get(`/api/admin/menus/68cd25a0af13f7dae75214fa`);
//         setNavbarData(res.data.menu);
//       } catch (err) {
//         console.error("Failed to fetch menu:", err);
//       }
//     };
//     fetchMenu();
//   }, []);
//   const [activeTab, setActiveTab] = useState('navbar');
//   const [editMode, setEditMode] = useState('menu');


//   const getCurrentData = () =>  navbarData ;
//   const setCurrentData = (data: any) =>  setNavbarData(data);
//   const renderPreview = (data: any) => {
//     let htmlContent = data.html;

//     htmlContent = htmlContent?.replace(/\{\{name\}\}/g, data.name);

//     const menuHtml = data.items?.map(item => {
//       let itemHtml = `
//         <div class="navbar-item ${item.subItems && item.subItems.length > 0 ? 'has-dropdown' : ''}">
//           <a href="${item.label}" class="navbar-link">
//             ${item.label}
//             ${item.subItems && item.subItems.length > 0 ? '<span class="dropdown-icon">▼</span>' : ''}
//           </a>
//       `;

//       if (item.subItems && item.subItems.length > 0) {
//         itemHtml += '<div class="navbar-dropdown">';
//         item.subItems.forEach(sub => {
//           itemHtml += `<a href="${sub.label}" class="dropdown-item">${sub.label}</a>`;
//         });
//         itemHtml += '</div>';
//       }

//       itemHtml += '</div>';
//       return itemHtml;
//     }).join('');

//     if (activeTab === 'navbar') {
//       htmlContent = htmlContent?.replace(/\{\{#each menu\}\}[\s\S]*?\{\{\/each\}\}/g, menuHtml);
//     } else {
//       const footerColumns = data.items?.map(section => {
//         let columnHtml = `
//           <div class="footer-column">
//             <h3 class="footer-heading">${section.label}</h3>
//         `;

//         if (section.subItems && section.subItems.length > 0) {
//           columnHtml += '<ul class="footer-links">';
//           section.subItems.forEach(item => {
//             columnHtml += `<li><a href="${item.label}">${item.label}</a></li>`;
//           });
//           columnHtml += '</ul>';
//         }

//         columnHtml += '</div>';
//         return columnHtml;
//       }).join('');

//       htmlContent = htmlContent.replace(/\{\{#each menu\}\}[\s\S]*?\{\{\/each\}\}/g, footerColumns);
//     }

//     return (
//       <div>
//         <style>{data.css}</style>
//         <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
//       </div>
//     );
//   };


//   const generateRenderedHTML = (data: any) => {
//     let htmlContent = data.html || '';

//     htmlContent = htmlContent.replace(/\{\{name\}\}/g, data.name);

//     const menuHtml = data.items?.map(item => {
//       let itemHtml = `
//       <div class="navbar-item ${item.subItems && item.subItems.length > 0 ? 'has-dropdown' : ''}">
//         <a href="${item.label}" class="navbar-link">
//           ${item.label}
//           ${item.subItems && item.subItems.length > 0 ? '<span class="dropdown-icon">▼</span>' : ''}
//         </a>
//     `;

//       if (item.subItems && item.subItems.length > 0) {
//         itemHtml += '<div class="navbar-dropdown">';
//         item.subItems.forEach(sub => {
//           itemHtml += `<a href="${sub.label}" class="dropdown-item">${sub.label}</a>`;
//         });
//         itemHtml += '</div>';
//       }

//       itemHtml += '</div>';
//       return itemHtml;
//     }).join('');

//     if (activeTab === 'navbar') {
//       htmlContent = htmlContent.replace(/\{\{#each menu\}\}[\s\S]*?\{\{\/each\}\}/g, menuHtml);
//     } else {
//       const footerColumns = data.items?.map(section => {
//         let columnHtml = `
//         <div class="footer-column">
//           <h3 class="footer-heading">${section.label}</h3>
//       `;

//         if (section.subItems && section.subItems.length > 0) {
//           columnHtml += '<ul class="footer-links">';
//           section.subItems.forEach(item => {
//             columnHtml += `<li><a href="${item.label}">${item.label}</a></li>`;
//           });
//           columnHtml += '</ul>';
//         }

//         columnHtml += '</div>';
//         return columnHtml;
//       }).join('');

//       htmlContent = htmlContent.replace(/\{\{#each menu\}\}[\s\S]*?\{\{\/each\}\}/g, footerColumns);
//     }

//     return htmlContent;
//   };
// const handleSave = async () => {
//   const data = getCurrentData();

//   const renderedHTML = generateRenderedHTML(data);

//   const payload = {
//     html: renderedHTML, // rendered HTML instead of template
//     css: data.css,
//     items: data.items,
//     name: data.name,
//   };

//   try {
//     const endpoint = activeTab === 'navbar'
//       ? `/api/admin/menus/style/navbar/${navbarData._id || '68cd25a0af13f7dae75214fa'}`
//       : `/api/admin/menus/style/footer/${footerData._id || 'footer-id'}`;

//     await axios.put(endpoint, payload);
//     alert(`${activeTab === 'navbar' ? 'Navbar' : 'Footer'} saved successfully!`);
//   } catch (err) {
//     console.error("Save failed:", err);
//     alert("Failed to save data.");
//   }
// };


//   return (
//     <div className="min-h-screen mt-20 bg-gray-100">
//       <div className="bg-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold text-gray-800">Navigation CMS Editor</h1>
//             <button
//               onClick={handleSave}
//               className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//             >
//               <Save className="w-4 h-4" />
//               Save
//             </button>

//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-6">
//         <div className="grid grid-cols-1  gap-6">
//           {/* Editor Panel */}
//           <div className="bg-white rounded-lg shadow-lg">
//             <div className="border-b">
             
//               <div className="flex border-t">
//                 <button
//                   onClick={() => setEditMode('html')}
//                   className={`flex-1 px-4 py-2 text-sm font-medium ${editMode === 'html' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
//                 >
//                   HTML
//                 </button>
//                 <button
//                   onClick={() => setEditMode('css')}
//                   className={`flex-1 px-4 py-2 text-sm font-medium ${editMode === 'css' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
//                 >
//                   CSS
//                 </button>
//               </div>
//             </div>

//             <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto">
            

//               {editMode === 'html' && (
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <label className="block font-semibold text-lg">HTML Template</label>
//                     <span className="text-sm text-gray-500">Use Handlebars syntax</span>
//                   </div>
//                   <div className="text-xs bg-blue-50 p-3 rounded border border-blue-200">
//                     <p className="font-semibold mb-1">Available Variables:</p>
//                     <ul className="list-disc list-inside space-y-1 text-gray-700">
//                       <li><code className="bg-white px-1 rounded">{'{{name}}'}</code> - Navigation name</li>
//                       <li><code className="bg-white px-1 rounded">{'{{#each menu}}'}</code> - Loop through menu items</li>
//                       <li><code className="bg-white px-1 rounded">{'{{label}}'}</code> - Menu item label</li>
//                       <li><code className="bg-white px-1 rounded">{'{{label}}'}</code> - Menu item link</li>
//                       <li><code className="bg-white px-1 rounded">{'{{#each subItems}}'}</code> - Loop through sub items</li>
//                     </ul>
//                   </div>
//                   <textarea
//                     value={getCurrentData().html}
//                     onChange={(e) => setCurrentData({ ...getCurrentData(), html: e.target.value })}
//                     className="w-full border rounded p-3 font-mono text-sm"
//                     rows="18"
//                     placeholder="Enter HTML template..."
//                   />
//                 </div>
//               )}

//               {editMode === 'css' && (
//                 <div className="space-y-3">
//                   <label className="block font-semibold text-lg">CSS Styles</label>
//                   <textarea
//                     value={getCurrentData().css}
//                     onChange={(e) => setCurrentData({ ...getCurrentData(), css: e.target.value })}
//                     className="w-full border rounded p-3 font-mono text-sm"
//                     rows="20"
//                     placeholder="Enter CSS styles..."
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Live Preview Panel */}
//           <div className="bg-white rounded-lg shadow-lg sticky top-6">
//             <div className="border-b px-6 py-3 bg-gray-50">
//               <div className="flex items-center gap-2">
//                 <Eye className="w-5 h-5 text-gray-600" />
//                 <h2 className="font-semibold text-lg">Live Preview</h2>
//               </div>
//             </div>
//             <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto">
//               {renderPreview(getCurrentData())}
//             </div>
//           </div>
//         </div>



//       </div>
//     </div>
//   );
// };

export default NavbarEditor;