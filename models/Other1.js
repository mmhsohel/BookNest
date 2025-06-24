import mongoose from "mongoose";
import { createBookSchema } from "./utils/bookSchema.js";


const other1Schema = new mongoose.Schema(
 {
    serial: { type: String, default: "" },
    class: { type: String, default: "test" },
    envClass: { type: String, default: "test" },
    subs: { type: [createBookSchema()], default: [] },
    envSubs: { type: [createBookSchema()], default: [] },
  },
  { minimize: false }
);

other1Schema.pre("save", async function (next) {
  if (this.isNew) {
    const last = await mongoose
      .model("Other1Book")
      .findOne()
      .sort("-serial");
    this.serial = last ? last.serial + 1 : 1;
  }
  next();
});

const Other1Book = mongoose.model(
  "Other1Book",
  other1Schema
);

export default Other1Book;
