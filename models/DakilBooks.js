import mongoose from "mongoose";
import { createBookSchema } from "./utils/bookSchema";

// Nested book schema


// Main DakilTextBook schema
const dakilTextBookSchema = new mongoose.Schema(
  {
     serial: { type: String, default: "" },
     class: { type: String, default: "test" },
     envClass: { type: String, default: "test" },
     subs: { type: [createBookSchema()], default: [] },
     envSubs: { type: [createBookSchema()], default: [] },
   },
  { minimize: false }
);

// Auto-increment serial number before saving
dakilTextBookSchema.pre("save", async function (next) {
  if (this.isNew && !this.serial) {
    try {
      const lastDoc = await mongoose
        .model("DakilTextBook")
        .findOne()
        .sort({ serial: -1 }) // Correct sort syntax
        .lean();

      const lastSerial = parseInt(lastDoc?.serial || "0", 10);
      this.serial = (lastSerial + 1).toString(); // Always save as string
    } catch (err) {
      console.error("Error generating serial:", err);
      this.serial = "1"; // fallback
    }
  }
  next();
});

// Export the model
const DakilTextBook = mongoose.model("DakilTextBook", dakilTextBookSchema);
export default DakilTextBook;
