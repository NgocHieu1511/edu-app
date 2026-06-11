import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
