import mongoose from "mongoose";
import { createBookSchema } from "./utils/bookSchema";


const btptBookSchema = new mongoose.Schema(
  {
    serial: { type: String, default: "" },
    class: { type: String, default: "test" },
    envClass: { type: String, default: "test" },
    subs: { type: [createBookSchema()], default: [] },
    envSubs: { type: [createBookSchema()], default: [] },
  },
  { minimize: false }
);

btptBookSchema.pre("save", async function (next) {
  if (this.isNew) {
    const last = await mongoose.model("BEdBook").findOne().sort("-serial");
    this.serial = last ? last.serial + 1 : 1;
  }
  next();
});

const BEdBook = mongoose.model("BEdBook", btptBookSchema);

export default BEdBook;
