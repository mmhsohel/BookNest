import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  id: { type: String, default: "" },
  serial: { type: String, default: "" },
  title: { type: String, default: "" },
  url: { type: String, default: "" },
  filename: { type: String, default: "" },
  imageFile: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  category: { type: String, default: "" },
});

const btptBookSchema = new mongoose.Schema(
  {
    serial: { type: String, default: "" },
    class: { type: String, default: "test" },
    envClass: { type: String, default: "test" },
    subs: { type: [bookSchema], default: [] },
    envSubs: { type: [bookSchema], default: [] },
  },
  { minimize: false }
);

btptBookSchema.pre("save", async function (next) {
  if (this.isNew) {
    const last = await mongoose.model("MEdBook").findOne().sort("-serial");
    this.serial = last ? last.serial + 1 : 1;
  }
  next();
});

const MEdBook = mongoose.model("MEdBook", btptBookSchema);

export default MEdBook;
