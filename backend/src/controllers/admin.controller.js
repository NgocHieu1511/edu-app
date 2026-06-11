import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";

export const getDashboard = async (req, res) => {
  const totalUsers = await User.countDocuments();

  const totalCourses = await Course.countDocuments();

  const totalEnrollments = await Enrollment.countDocuments();

  res.json({
    totalUsers,
    totalCourses,
    totalEnrollments,
  });
};
