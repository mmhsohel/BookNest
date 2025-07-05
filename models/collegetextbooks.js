import mongoose from "mongoose";
import { createBookSchema } from "./utils/bookSchema.js";

const collegeTextBookSchema = new mongoose.Schema(
  {
    serial: { type: String, default: "" },
    class: { type: String, default: "test" },
    envClass: { type: String, default: "test" },
    subs: { type: [createBookSchema()], default: [] },
    envSubs: { type: [createBookSchema()], default: [] },
  },
  { minimize: false }
);

collegeTextBookSchema.pre("save", async function (next) {
  if (this.isNew) {
    const last = await mongoose
      .model("CollegeTextBook")
      .findOne()
      .sort("-serial");
    this.serial = last ? String(Number(last.serial) + 1) : "1";
  }
  next();
});

const CollegeTextBook = mongoose.model("CollegeTextBook", collegeTextBookSchema);

export default CollegeTextBook;
