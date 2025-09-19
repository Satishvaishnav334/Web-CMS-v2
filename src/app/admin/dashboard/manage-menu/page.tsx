'use client'
import axios from "axios";
import { useEffect, useState } from "react";
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
    DragEndEvent,
    closestCenter,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Trash2,
    Plus,
    Save,
    Edit2,
    GripVertical,
    ChevronDown,
    Link,
} from "lucide-react";
import MenuTypeDropdown from "@/components/ui/MenuType";
// Types
interface Page {
    _id: string;
    pageName: string;
}

interface SubMenuItem {
    id: string;
    label: string;
    pageId: string;
}

interface MenuItemType {
    id: string;
    label: string;
    pageId?: string;
    type: "page" | "dropdown";
    subItems: SubMenuItem[];
}

interface Menu {
    _id: string;
    menuType:string;
    name: string;
    items: MenuItemType[];
    createdAt: string;
}


export  function SortableSubItem({
subItem,
  parentId,
  menuItems,
  setMenuItems,
  pages,
  usedPageIds,
}: {
  subItem: SubMenuItem;
  parentId: string;
  menuItems: MenuItemType[];
  setMenuItems: (items: MenuItemType[]) => void;
  pages: Page[];
  usedPageIds: string[];
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: subItem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // 🟢 Normalize IDs to strings
  const currentPageId = subItem.pageId ? String(subItem.pageId) : "";

  const handlePageSelect = (pageId: string) => {
    const newItems = [...menuItems];
    const parentItem = newItems.find((item) => item.id === parentId);
    if (parentItem) {
      const subItemIndex = parentItem.subItems.findIndex(
        (sub) => sub.id === subItem.id
      );
      if (subItemIndex !== -1) {
        const selectedPage = pages.find((p) => String(p._id) === pageId);
        parentItem.subItems[subItemIndex].pageId = pageId;
        parentItem.subItems[subItemIndex].label = selectedPage?.pageName || "";
        setMenuItems(newItems);
      }
    }
  };

  const removeSubItem = () => {
    const newItems = [...menuItems];
    const parentItem = newItems.find((item) => item.id === parentId);
    if (parentItem) {
      parentItem.subItems = parentItem.subItems.filter(
        (sub) => sub.id !== subItem.id
      );
      setMenuItems(newItems);
    }
  };

  const availablePages = pages.filter(
    (page) => !usedPageIds.includes(String(page._id)) || String(page._id) === currentPageId
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg ml-6 mb-2"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical size={16} className="text-gray-400" />
      </div>

      <select
        value={currentPageId}
        onChange={(e) => handlePageSelect(e.target.value)}
        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a page...</option>
        {availablePages.map((page) => (
          <option key={String(page._id)} value={String(page._id)}>
            {page.pageName}
          </option>
        ))}
      </select>

      <button
        onClick={removeSubItem}
        className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        title="Remove Sub Item"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

// Sortable Menu Item Component
function SortableMenuItem({
    item,
    menuItems,
    setMenuItems,
    pages,
    usedPageIds,
}: {
    item: MenuItemType;
    menuItems: MenuItemType[];
    setMenuItems: (items: MenuItemType[]) => void;
    pages: Page[];
    usedPageIds: string[];
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: item.id });

    const subItemSensors = useSensors(useSensor(PointerSensor)); // ✅ moved outside conditional

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const generateUniqueId = () =>
        `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const handleTypeChange = (type: "page" | "dropdown") => {
        const newItems = [...menuItems];
        const itemIndex = newItems.findIndex((i) => i.id === item.id);
        if (itemIndex !== -1) {
            newItems[itemIndex].type = type;
            if (type === "dropdown") {
                newItems[itemIndex].pageId = undefined;
                newItems[itemIndex].label = newItems[itemIndex].label || "Dropdown Menu";
            } else {
                newItems[itemIndex].subItems = [];
                newItems[itemIndex].pageId = "";
                newItems[itemIndex].label = "";
            }
            setMenuItems(newItems);
        }
    };

    const handlePageSelect = (pageId: string) => {
        const newItems = [...menuItems];
        const itemIndex = newItems.findIndex((i) => i.id === item.id);
        const selectedPage = pages.find((p) => p._id === pageId);

        if (itemIndex !== -1 && selectedPage) {
            newItems[itemIndex].pageId = pageId;
            newItems[itemIndex].label = selectedPage.pageName;
            setMenuItems(newItems);
        }
    };

    const handleLabelChange = (label: string) => {
        const newItems = [...menuItems];
        const itemIndex = newItems.findIndex((i) => i.id === item.id);
        if (itemIndex !== -1) {
            newItems[itemIndex].label = label;
            setMenuItems(newItems);
        }
    };

    const addSubItem = () => {
        const newItems = [...menuItems];
        const itemIndex = newItems.findIndex((i) => i.id === item.id);
        if (itemIndex !== -1) {
            newItems[itemIndex].subItems.push({
                id: generateUniqueId(),
                label: "",
                pageId: "",
            });
            setMenuItems(newItems);
        }
    };

    const removeItem = () => {
        const newItems = menuItems.filter((i) => i.id !== item.id);
        setMenuItems(newItems);
    };

    const handleSubItemDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const newItems = [...menuItems];
        const itemIndex = newItems.findIndex((i) => i.id === item.id);
        if (itemIndex !== -1) {
            const oldIndex = item.subItems.findIndex((sub) => sub.id === active.id);
            const newIndex = item.subItems.findIndex((sub) => sub.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                newItems[itemIndex].subItems = arrayMove(item.subItems, oldIndex, newIndex);
                setMenuItems(newItems);
            }
        }
    };

    const availablePages = pages.filter(
        (page) => !usedPageIds.includes(page._id) || page._id === item.pageId
    );

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="border rounded-lg mb-4 bg-white shadow-sm"
        >
            <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                    <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                        <GripVertical size={20} className="text-gray-400" />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name={`type-${item.id}`}
                                checked={item.type === "page"}
                                onChange={() => handleTypeChange("page")}
                                className="text-blue-600"
                            />
                            <Link size={16} />
                            <span className="text-sm">Page Link</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name={`type-${item.id}`}
                                checked={item.type === "dropdown"}
                                onChange={() => handleTypeChange("dropdown")}
                                className="text-blue-600"
                            />
                            <ChevronDown size={16} />
                            <span className="text-sm">Dropdown</span>
                        </label>
                    </div>

                    <button
                        onClick={removeItem}
                        className="ml-auto flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        title="Remove Item"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {item.type === "page" ? (
                    <div className="flex items-center gap-3">
                        <select
                            value={item.pageId || ""}
                            onChange={(e) => handlePageSelect(e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a page...</option>
                            {availablePages.map((page) => (
                                <option key={page._id} value={page._id}>
                                    {page.pageName}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <input
                                type="text"
                                value={item.label}
                                onChange={(e) => handleLabelChange(e.target.value)}
                                placeholder="Enter dropdown menu name..."
                                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                onClick={addSubItem}
                                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                                <Plus size={16} />
                                Add Sub Item
                            </button>
                        </div>

                        {item.subItems.length > 0 && (
                            <DndContext
                                sensors={subItemSensors} // ✅ hook-safe
                                onDragEnd={handleSubItemDragEnd}
                                collisionDetection={closestCenter}
                            >
                                <SortableContext
                                    items={item.subItems.map((sub) => sub.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {item.subItems.map((subItem) => (
                                        <SortableSubItem
                                            key={subItem.id}
                                            subItem={subItem}
                                            parentId={item.id}
                                            menuItems={menuItems}
                                            setMenuItems={setMenuItems}
                                            pages={pages}
                                            usedPageIds={usedPageIds}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MenuBuilder() {
    const [menuName, setMenuName] = useState("");
    const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
    const [pages, setPages] = useState<Page[]>([]);
    const [existingMenus, setExistingMenus] = useState<Menu[]>([]);
    const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        fetchPages();
        fetchMenus();
    }, []);

    const fetchPages = async () => {
        try {
            const res = await axios.get("/api/admin/pages/drafts")
            setPages(res.data);
        } catch (error) {
            console.error("Error fetching pages:", error);
            setError("Failed to fetch pages");
        }
    };

    const fetchMenus = async () => {
        try {
            const res = await axios.get("/api/admin/menus");
            console.log(res.data)
            setExistingMenus(res.data.menus);
        } catch (error) {
            console.error("Error fetching menus:", error);
        }
    };

    // Get all used page IDs in current menu to prevent duplicates
    const getUsedPageIds = (): string[] => {
        const usedIds: string[] = [];

        menuItems.forEach(item => {
            if (item.pageId) {
                usedIds.push(item.pageId);
            }
            item.subItems.forEach(subItem => {
                if (subItem.pageId) {
                    usedIds.push(subItem.pageId);
                }
            });
        });

        return usedIds;
    };

    const generateUniqueId = () => `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const addMenuItem = () => {
        setMenuItems(prev => [
            ...prev,
            {
                id: generateUniqueId(),
                label: "",
                pageId: "",
                type: 'page',
                subItems: []
            }
        ]);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = menuItems.findIndex(item => item.id === active.id);
        const newIndex = menuItems.findIndex(item => item.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            setMenuItems(arrayMove(menuItems, oldIndex, newIndex));
        }
    };

    const validateMenu = (): string | null => {
        if (!menuName.trim()) {
            return "Please enter a menu name";
        }

        if (menuItems.length === 0) {
            return "Please add at least one menu item";
        }

        for (const item of menuItems) {
            if (item.type === 'page' && !item.pageId) {
                return "Please select pages for all page link items";
            }

            if (item.type === 'dropdown') {
                if (!item.label.trim()) {
                    return "Please enter names for all dropdown items";
                }

                if (item.subItems.length === 0) {
                    return "Dropdown items must have at least one sub-item";
                }

                for (const subItem of item.subItems) {
                    if (!subItem.pageId) {
                        return "Please select pages for all sub-items";
                    }
                }
            }
        }

        return null;
    };

    const saveMenu = async () => {
        const validationError = validateMenu();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError("");

        try {
            let response;
            if (editingMenu) {
                response = await fetch("/api/admin/menus", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: editingMenu._id,
                        name: menuName,
                        items: menuItems
                    })
                });
            } else {
                response = await fetch("/api/admin/menus", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: menuName,
                        items: menuItems
                    })
                });
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            // Reset form
            setMenuName("");
            setMenuItems([]);
            setEditingMenu(null);
            fetchMenus();
            alert(`Menu ${editingMenu ? 'updated' : 'created'} successfully!`);
        } catch (error: any) {
            console.error("Error saving menu:", error);
            setError(error.message || "Failed to save menu");
        } finally {
            setLoading(false);
        }
    };

    const editMenu = (menu: Menu) => {
        setEditingMenu(menu);
        setMenuName(menu?.name);
        setMenuItems(menu?.items);
        console.log(menu?.items)
    };

    const deleteMenu = async (menuId: string) => {
        if (!confirm("Are you sure you want to delete this menu?")) return;

        try {
            const response = await fetch(`/api/admin/menus?id=${menuId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.success) {
                fetchMenus();
                alert("Menu deleted successfully!");
            } else {
                throw new Error(data.message);
            }
        } catch (error: any) {
            console.error("Error deleting menu:", error);
            alert("Failed to delete menu");
        }
    };

    const resetForm = () => {
        setMenuName("");
        setMenuItems([]);
        setEditingMenu(null);
        setError("");
    };

    const usedPageIds = getUsedPageIds();

    return (
        <div className=" h-full overflow-y-scroll mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu Builder</h1>
                <p className="text-gray-600">Create 2-level navigation menus with drag & drop functionality</p>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Menu Creation Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">
                            {editingMenu ? "Edit Menu" : "Create New Menu"}
                        </h2>
                        {editingMenu && (
                            <button
                                onClick={resetForm}
                                className="text-sm text-gray-600 hover:text-gray-800"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Menu Name
                            </label>
                            <input
                                type="text"
                                value={menuName}
                                onChange={(e) => setMenuName(e.target.value)}
                                placeholder="Enter unique menu name (e.g., Main Navigation, Footer Menu)"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Menu Items
                                </label>
                                <button
                                    onClick={addMenuItem}
                                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus size={16} />
                                    Add Item
                                </button>
                            </div>

                            <div>
                                {menuItems.length > 0 ? (
                                    <DndContext
                                        sensors={sensors}
                                        onDragEnd={handleDragEnd}
                                        collisionDetection={closestCenter}
                                    >
                                        <SortableContext
                                            items={menuItems.map((item) => item.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {menuItems.map((item) => (
                                                <SortableMenuItem
                                                    key={item.id}
                                                    item={item}
                                                    menuItems={menuItems}
                                                    setMenuItems={setMenuItems}
                                                    pages={pages}
                                                    usedPageIds={usedPageIds}
                                                />
                                            ))}
                                        </SortableContext>
                                    </DndContext>
                                ) : (
                                    <p className="text-sm text-gray-500">No menu items added yet.</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={saveMenu}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <Save size={16} />
                                {loading ? "Saving..." : editingMenu ? "Update Menu" : "Save Menu"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Existing Menus */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Existing Menus</h2>

                    {existingMenus.length > 0 ? (
                        <ul className="space-y-4">
                            {existingMenus.map((menu) => (
                                <li
                                    key={menu._id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                >
                                    <div>
                                        <h3 className="font-medium">{menu.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {menu.items.length} items • Created {new Date(menu.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                    <MenuTypeDropdown menuId={menu._id} currentType={menu.menuType} />
                                        <button
                                            onClick={() => editMenu(menu)}
                                            className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                                        >
                                            <Edit2 size={14} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteMenu(menu._id)}
                                            className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No menus found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
