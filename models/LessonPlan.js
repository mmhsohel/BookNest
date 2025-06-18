import mongoose from "mongoose";
import { createBookSchema } from "./utils/bookSchema";



const lessonplanSchema = new mongoose.Schema(
   {
      serial: { type: String, default: "" },
      class: { type: String, default: "test" },
      envClass: { type: String, default: "test" },
      subs: { type: [createBookSchema()], default: [] },
      envSubs: { type: [createBookSchema()], default: [] },
    },
  { minimize: false }
);

lessonplanSchema.pre("save", async function (next) {
  if (this.isNew) {
    const last = await mongoose
      .model("LessonPlan")
      .findOne()
      .sort("-serial");
    this.serial = last ? last.serial + 1 : 1;
  }
  next();
});

const LessonPlan = mongoose.model(
  "LessonPlan",
  lessonplanSchema
);

export default LessonPlan;
