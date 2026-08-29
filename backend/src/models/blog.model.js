import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    excerpt: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "NHH Academy",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Blog", blogSchema);
