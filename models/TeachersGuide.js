import mongoose from "mongoose";
import { createBookSchema } from "./utils/bookSchema";



const TeachersGuideSchema = new mongoose.Schema(
  {
     serial: { type: String, default: "" },
     class: { type: String, default: "test" },
     envClass: { type: String, default: "test" },
     subs: { type: [createBookSchema()], default: [] },
     envSubs: { type: [createBookSchema()], default: [] },
   },
  { minimize: false }
);

TeachersGuideSchema.pre("save", async function (next) {
  if (this.isNew) {
    const last = await mongoose
      .model("TeachersGuide")
      .findOne()
      .sort("-serial");
    this.serial = last ? last.serial + 1 : 1;
  }
  next();
});

const TeachersGuide = mongoose.model("TeachersGuide", TeachersGuideSchema);

export default TeachersGuide;
