import mongoose from "mongoose";
import { createBookSchema } from "./utils/bookSchema.js";


const other5Schema = new mongoose.Schema(
 {
    serial: { type: String, default: "" },
    class: { type: String, default: "test" },
    envClass: { type: String, default: "test" },
    subs: { type: [createBookSchema()], default: [] },
    envSubs: { type: [createBookSchema()], default: [] },
  },
  { minimize: false }
);

other5Schema.pre("save", async function (next) {
  if (this.isNew) {
    const last = await mongoose
      .model("Other5Book")
      .findOne()
      .sort("-serial");
    this.serial = last ? last.serial + 1 : 1;
  }
  next();
});

const Other5Book = mongoose.model(
  "Other5Book",
  other5Schema
);

export default Other5Book;
