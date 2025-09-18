// Page type (from DB)
export interface Page {
  _id: string;
  pageName: string;
  slug: string;
  content?: string;
}

// Sub-menu item
export interface SubMenuItem {
  id: string;          // local unique id (UUID or timestamp)
  label: string;       // display name
  pageId: string;      // reference to Page._id
}

// Top-level menu item
export interface MenuItem {
  id: string;              // local unique id
  label: string;           // display name
  pageId: string;          // reference to Page._id
  subItems: SubMenuItem[]; // nested submenu
}

// Whole menu
export interface Menu {
  id: string;
  name: string;
  items: MenuItem[];
}
