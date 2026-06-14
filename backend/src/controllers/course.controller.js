import Course from "../models/course.model.js";

export const createCourse = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  try {
    const course = await Course.create({
      ...req.body,
      // 👉 SỬA TẠI ĐÂY: Thay `/uploads/${req.file.filename}` bằng `req.file.path`
      thumbnail: req.file ? req.file.path : "",
    });

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    if (req.file) {
      // 👉 SỬA TIẾP TẠI ĐÂY: Thay thành `req.file.path` khi cập nhật ảnh mới
      updateData.thumbnail = req.file.path;
    }

    const course = await Course.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Course deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
