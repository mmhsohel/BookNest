import mongoose from "mongoose";

const versionSchema = new mongoose.Schema({
  latestVersion: {
    type: String,
    required: true,
  },
  forceUpdate: {
    type: Boolean,
    default: false,
  },
  androidLink: {
    type: String,
    required: true,
  },
  iosLink: {
    type: String,
    required: true,
    default: 'xyz',
  },
}, { timestamps: true });

export default mongoose.model('Version', versionSchema);
