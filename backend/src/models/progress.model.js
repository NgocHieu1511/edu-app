import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    plannedMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    studiedMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

progressSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Progress", progressSchema);