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
  isActive: boolean;
  items: MenuItem[];
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
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Menu ||
  mongoose.model<Menu>("Menu", MenuSchema);
