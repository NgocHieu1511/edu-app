import mongoose from "mongoose";

const videoScheduleSchema = new mongoose.Schema(
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
      maxlength: 140,
    },
    day: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },
    time: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
    platform: {
      type: String,
      required: true,
      enum: ["YouTube", "TikTok", "Facebook", "Instagram", "Khác"],
    },
    note: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
  },
  { timestamps: true },
);

videoScheduleSchema.index({ user: 1, day: 1, time: 1 });

export default mongoose.model("VideoSchedule", videoScheduleSchema);
