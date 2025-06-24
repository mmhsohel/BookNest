import mongoose from "mongoose";
import { createBookSchema } from "./utils/bookSchema.js";


const other4Schema = new mongoose.Schema(
 {
    serial: { type: String, default: "" },
    class: { type: String, default: "test" },
    envClass: { type: String, default: "test" },
    subs: { type: [createBookSchema()], default: [] },
    envSubs: { type: [createBookSchema()], default: [] },
  },
  { minimize: false }
);

other4Schema.pre("save", async function (next) {
  if (this.isNew) {
    const last = await mongoose
      .model("Other4Book")
      .findOne()
      .sort("-serial");
    this.serial = last ? last.serial + 1 : 1;
  }
  next();
});

const Other4Book = mongoose.model(
  "Other4Book",
  other4Schema
);

export default Other4Book;
