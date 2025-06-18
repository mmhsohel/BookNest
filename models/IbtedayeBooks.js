import mongoose from "mongoose";
import { createBookSchema } from "./utils/bookSchema";



const ibtedayeTextBookSchema = new mongoose.Schema(
  {
     serial: { type: String, default: "" },
     class: { type: String, default: "test" },
     envClass: { type: String, default: "test" },
     subs: { type: [createBookSchema()], default: [] },
     envSubs: { type: [createBookSchema()], default: [] },
   },
  { minimize: false }
);

ibtedayeTextBookSchema.pre("save", async function (next) {
  if (this.isNew) {
    const last = await mongoose
      .model("IbtedayeTextBook")
      .findOne()
      .sort("-serial");
    this.serial = last ? last.serial + 1 : 1;
  }
  next();
});

const IbtedayeTextBook = mongoose.model(
  "IbtedayeTextBook",
  ibtedayeTextBookSchema
);

export default IbtedayeTextBook;
