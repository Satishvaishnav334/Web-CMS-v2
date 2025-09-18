// components/ui/MenuItem.tsx
'use client';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

interface Page {
  _id: string;
  pageName: string;
}

export interface MenuItemType {
  id: string;
  label: string;
  pageId: string;
  subMenu: MenuItemType[];
}

interface MenuItemProps {
  item: MenuItemType;
  index: number;
  menuItems: MenuItemType[];
  setMenuItems: (items: MenuItemType[]) => void;
  pages: Page[];
}

export default function MenuItem({ item, index, menuItems, setMenuItems, pages }: MenuItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const addSubMenu = () => {
    const newItems = [...menuItems];
    newItems[index].subMenu.push({ id: Date.now().toString(), label: "", pageId: "", subMenu: [] });
    setMenuItems(newItems);
  };

  const handleSubPageSelect = (subIndex: number, pageId: string) => {
    const newItems = [...menuItems];
    const selectedPage = pages.find(p => p._id === pageId);
    if (selectedPage) {
      newItems[index].subMenu[subIndex].pageId = pageId;
      newItems[index].subMenu[subIndex].label = selectedPage.pageName;
      setMenuItems(newItems);
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="border p-2 mb-2 rounded">
      <div className="flex justify-between items-center">
        <span>{item.label || "Select Page"}</span>
        <button
          onClick={addSubMenu}
          className="bg-gray-600 text-white px-2 py-1 rounded"
        >
          Add Submenu
        </button>
      </div>

      {item.subMenu.map((sub, i) => (
        <div key={sub.id} className="ml-6 flex gap-2 items-center mt-2">
          <select
            value={sub.pageId}
            onChange={(e) => handleSubPageSelect(i, e.target.value)}
            className="border p-1 rounded w-full"
          >
            <option value="">Select Page</option>
            {pages.map(p => (
              <option key={p._id} value={p._id}>
                {p.pageName}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
