import mongoose from "mongoose";
import { createBookSchema } from "./utils/bookSchema.js";


const other2Schema = new mongoose.Schema(
 {
    serial: { type: String, default: "" },
    class: { type: String, default: "test" },
    envClass: { type: String, default: "test" },
    subs: { type: [createBookSchema()], default: [] },
    envSubs: { type: [createBookSchema()], default: [] },
  },
  { minimize: false }
);

other2Schema.pre("save", async function (next) {
  if (this.isNew) {
    const last = await mongoose
      .model("Other2Book")
      .findOne()
      .sort("-serial");
    this.serial = last ? last.serial + 1 : 1;
  }
  next();
});

const Other2Book = mongoose.model(
  "Other2Book",
  other2Schema
);

export default Other2Book;
