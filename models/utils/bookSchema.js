// utils/bookSchema.js

import mongoose from "mongoose";

export function createBookSchema() {
  return new mongoose.Schema(
   {
  id: { type: String, default: "" },
  serial: { type: String, default: "" },
  title: { type: String, default: "" },
  url: { type: String, default: "" },
  backupUrl: { type: String, default: "" },
  filename: { type: String, default: "" },
  imageFile: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  category: { type: String, default: "" },
} 
  );
}
