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

const getStartDate = (range) => {
  const startDate = new Date();

  switch (range) {
    case "week":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "year":
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(startDate.getMonth() - 1);
      break;
  }

  return startDate;
};

export const getDashboardStats = async (req, res) => {
  const range = req.query.range || "month";
  const startDate = getStartDate(range);

  const totalUsers = await User.countDocuments();
  const totalCourses = await Course.countDocuments();
  const totalEnrollments = await Enrollment.countDocuments();

  const newUsersThisMonth = await User.countDocuments({
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    },
  });

  const newCoursesThisMonth = await Course.countDocuments({
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    },
  });

  const enrollments = await Enrollment.find().populate("courseId", "price");
  const totalRevenue = enrollments.reduce(
    (sum, enrollment) => sum + (enrollment.courseId?.price || 0),
    0,
  );

  const activeUsers = await User.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  const averageRating = 4.5;

  res.json({
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalRevenue,
    averageRating,
    newUsersThisMonth,
    newCoursesThisMonth,
    activeUsers,
  });
};

export const getDashboardActivities = async (req, res) => {
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(3).lean();

  const recentCourses = await Course.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  const recentEnrollments = await Enrollment.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .populate("userId", "name")
    .populate("courseId", "title")
    .lean();

  const activities = [];

  recentUsers.forEach((user) => {
    activities.push({
      id: `user-${user._id}`,
      type: "user",
      message: `Người dùng mới đăng ký: ${user.name}`,
      date: user.createdAt,
    });
  });

  recentCourses.forEach((course) => {
    activities.push({
      id: `course-${course._id}`,
      type: "course",
      message: `Khóa học mới: ${course.title}`,
      date: course.createdAt,
    });
  });

  recentEnrollments.forEach((enrollment) => {
    activities.push({
      id: `enrollment-${enrollment._id}`,
      type: "enrollment",
      message: `${enrollment.userId?.name || "Người dùng"} đã đăng ký khóa học ${enrollment.courseId?.title || ""}`,
      date: enrollment.createdAt,
    });
  });

  activities.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(activities.slice(0, 6));
};
