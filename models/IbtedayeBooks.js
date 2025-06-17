import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  id: String,
  serial: { type: String, default: "" },
  title: String,
  url: String,
  filename: String,
  imageFile: String,
  imageUrl: String,
  category: String,
});

const ibtedayeTextBookSchema = new mongoose.Schema(
  {
    serial: { type: String, default: "" },
    class: { type: String, default: "test" },
    envClass: { type: String, default: "test" },
    subs: { type: [bookSchema], default: [] },
    envSubs: { type: [bookSchema], default: [] },
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
