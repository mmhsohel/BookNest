import mongoose from "mongoose";

const carouselImageSchema = new mongoose.Schema({
  serial: { type: String, default: "" },
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  imageFile: {
    type: String
  }
});

carouselImageSchema.pre("save", async function (next) {
  if (this.isNew) {
    const last = await mongoose
      .model("CarouselImage")
      .findOne()
      .sort("-serial");
    this.serial = last ? last.serial + 1 : 1;
  }
  next();
});

const CarouselImage = mongoose.model("CarouselImage", carouselImageSchema);

export default CarouselImage;
