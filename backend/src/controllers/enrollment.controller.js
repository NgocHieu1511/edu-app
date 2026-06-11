import Enrollment from "../models/enrollment.model.js";

export const enrollCourse = async (req, res) => {
  try {
    const enrollment = await Enrollment.create({
      userId: req.user.id,
      courseId: req.body.courseId,
    });

    res.status(201).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const myCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      userId: req.user.id,
    }).populate("courseId");

    res.status(200).json({
      success: true,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateProgress = async (req, res) => {
  const { enrollmentId, progress } = req.body;

  const enrollment = await Enrollment.findByIdAndUpdate(
    enrollmentId,
    { progress },
    { new: true },
  );

  res.json(enrollment);
};
