import mongoose from "mongoose";
import { createBookSchema } from "./utils/bookSchema.js";


const btptBookSchema = new mongoose.Schema(
  {
    serial: { type: String, default: "" },
    class: { type: String, default: "test" },
    envClass: { type: String, default: "test" },
    subs: { type: [createBookSchema()], default: [] },
    envSubs: { type: [createBookSchema()], default: [] },
  }, { minimize: false });

btptBookSchema.pre('save', async function (next) {
  if (this.isNew) {
    const last = await mongoose.model('BtptBook').findOne().sort('-serial');
    this.serial = last ? last.serial + 1 : 1;
  }
  next();
});


const BtptBook = mongoose.model("BtptBook", btptBookSchema);

export default BtptBook;
