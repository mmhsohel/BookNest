import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  serial: { type: String, default: "" },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  itemData: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
   imageFile: {
    type: String
  },
  screen: {
    type: String,
    required: true,
  },
});

cardSchema.pre("save", async function (next) {
  if (this.isNew) {
    const last = await mongoose.model("Card").findOne().sort("-serial");
    this.serial = last ? last.serial + 1 : 1;
  }
  next();
});

const Card = mongoose.model("Card", cardSchema);

export default Card;
