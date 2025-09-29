import mongoose, { Schema, Document } from "mongoose";

interface SubMenuItem {
  id: string;
  label: string;
  pageId: mongoose.Schema.Types.ObjectId; // reference
}

interface MenuItem {
  id: string;
  label: string;

  pageId?: mongoose.Schema.Types.ObjectId;
  type: "page" | "dropdown";
  subItems: SubMenuItem[];
}

interface Menu extends Document {
  name: string;
  menuType: "footer" | "navbar" | "none";
  items: MenuItem[];
  html: string;
  css: string;
  json: any;
}

const SubMenuItemSchema = new Schema<SubMenuItem>({
  id: { type: String, required: true },
  label: { type: String },
  pageId: { type: Schema.Types.ObjectId, ref: "Page" }, // ✅ reference
});

const MenuItemSchema = new Schema<MenuItem>({
  id: { type: String, required: true },
  label: { type: String },
  pageId: { type: Schema.Types.ObjectId, ref: "Page" }, // ✅ reference
  type: { type: String, enum: ["page", "dropdown"], required: true },
  subItems: [SubMenuItemSchema],

});

const MenuSchema = new Schema<Menu>(
  {
    name: { type: String, required: true },
    items: [MenuItemSchema],
    html: {
      type: String,  default: `<nav class="navbar">
  <div class="logo">{{name}}</div>
  <ul class="nav-links">
    {{#each menu}}
      <li class="nav-item">
        <a href="{{link}}" class="nav-link">{{label}}</a>

        {{#if subItems}}
          <ul class="dropdown">
            {{#each subItems}}
              <li><a href="{{link}}" class="dropdown-link">{{label}}</a></li>
            {{/each}}
          </ul>
       
      </li>
    
  </ul>
</nav>
`},
    css: {
      type: String,  default: `/* Navbar Container */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: black;
  padding: 12px 24px;
  font-family: Arial, sans-serif;
   color: white;
}

/* Logo */
.navbar .logo {
  font-size: 20px;
  font-weight: bold;
 
}

/* Nav Links */
.nav-links {
  display: flex;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Dropdown Menu */
.dropdown {
  display: none;
  position: absolute;
  background: white;
  color: #111;
  list-style: none;
  margin: 0;
  padding: 8px 0;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.dropdown li {
  min-width: 160px;
}

.dropdown-link {
  display: block;
  padding: 8px 12px;
  color: #111;
  text-decoration: none;
  transition: background 0.2s ease;
}

.dropdown-link:hover {
  background: #f3f4f6; /* gray-100 */
}

/* Show dropdown on hover */
.nav-item {
  position: relative;
}

.nav-item:hover .dropdown {
  display: block;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    flex-direction: column;
    position: absolute;
    top: 60px;
    right: 0;
    background: #1e3a8a;
    width: 200px;
    display: none;
  }

  .nav-links.show {
    display: flex;
  }

  .nav-link {
    padding: 12px;
    text-align: left;
  }
}
` },
    json: { type: Object, },
    menuType: { type: String, enum: ["footer", "navbar", "none"], default: "none" },
  },
  { timestamps: true }
);

export default mongoose.models.Menu ||
  mongoose.model<Menu>("Menu", MenuSchema);
