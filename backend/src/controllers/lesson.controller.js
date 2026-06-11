import Lesson from "../models/lesson.model.js";

export const createLesson = async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);

    res.status(201).json({
      success: true,
      lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({
      courseId: req.params.courseId,
    });

    res.status(200).json({
      success: true,
      lessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lesson deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    res.status(200).json({
      success: true,
      lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
