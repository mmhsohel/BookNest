import mongoose from "mongoose";
import { createBookSchema } from "./utils/bookSchema";


const technicalTextBookSchema = new mongoose.Schema(
 {
    serial: { type: String, default: "" },
    class: { type: String, default: "test" },
    envClass: { type: String, default: "test" },
    subs: { type: [createBookSchema()], default: [] },
    envSubs: { type: [createBookSchema()], default: [] },
  },
  { minimize: false }
);

technicalTextBookSchema.pre("save", async function (next) {
  if (this.isNew) {
    const last = await mongoose
      .model("TechnicalTextBook")
      .findOne()
      .sort("-serial");
    this.serial = last ? last.serial + 1 : 1;
  }
  next();
});

const TechnicalTextBook = mongoose.model(
  "TechnicalTextBook",
  technicalTextBookSchema
);

export default TechnicalTextBook;
