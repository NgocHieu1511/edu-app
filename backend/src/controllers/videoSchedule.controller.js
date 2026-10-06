import mongoose from "mongoose";
import VideoSchedule from "../models/videoSchedule.model.js";

const getScheduleFields = (body) => ({
  title: body.title,
  date: body.date,
  time: body.time,
  platform: body.platform,
  note: body.note ?? "",
});

const isValidDate = (date) => {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === date;
};

const validateScheduleFields = ({ title, date, time, platform, note }) =>
  typeof title === "string" &&
  title.trim().length > 0 &&
  title.trim().length <= 140 &&
  isValidDate(date) &&
  typeof time === "string" &&
  /^([01]\d|2[0-3]):[0-5]\d$/.test(time) &&
  ["YouTube", "TikTok", "Facebook", "Instagram", "Khác"].includes(platform) &&
  typeof note === "string" &&
  note.length <= 300;

const isValidId = (id) => mongoose.isValidObjectId(id);

export const getMyVideoSchedule = async (req, res) => {
  try {
    const items = await VideoSchedule.find({
      user: req.user.id,
      date: { $type: "string" },
    })
      .sort({ date: 1, time: 1 })
      .lean();

    res.status(200).json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createVideoSchedule = async (req, res) => {
  const fields = getScheduleFields(req.body);
  if (!validateScheduleFields(fields)) {
    return res.status(400).json({ success: false, message: "Thông tin lịch đăng video không hợp lệ." });
  }

  try {
    const item = await VideoSchedule.create({ ...fields, user: req.user.id });
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVideoSchedule = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Mã lịch đăng video không hợp lệ." });
  }

  const fields = getScheduleFields(req.body);
  if (!validateScheduleFields(fields)) {
    return res.status(400).json({ success: false, message: "Thông tin lịch đăng video không hợp lệ." });
  }

  try {
    const item = await VideoSchedule.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      fields,
      { new: true, runValidators: true },
    );
    if (!item) {
      return res.status(404).json({ success: false, message: "Không tìm thấy lịch đăng video." });
    }

    res.status(200).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteVideoSchedule = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Mã lịch đăng video không hợp lệ." });
  }

  try {
    const item = await VideoSchedule.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: "Không tìm thấy lịch đăng video." });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
