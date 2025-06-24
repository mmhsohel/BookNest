import mongoose from "mongoose";
import { createBookSchema } from "./utils/bookSchema.js";


const otherSchema = new mongoose.Schema(
 {
    serial: { type: String, default: "" },
    class: { type: String, default: "test" },
    envClass: { type: String, default: "test" },
    subs: { type: [createBookSchema()], default: [] },
    envSubs: { type: [createBookSchema()], default: [] },
  },
  { minimize: false }
);

otherSchema.pre("save", async function (next) {
  if (this.isNew) {
    const last = await mongoose
      .model("OtherBook")
      .findOne()
      .sort("-serial");
    this.serial = last ? last.serial + 1 : 1;
  }
  next();
});

const OtherBook = mongoose.model(
  "OtherBook",
  otherSchema
);

export default OtherBook;
