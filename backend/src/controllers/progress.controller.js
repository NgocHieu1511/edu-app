import Progress from "../models/progress.model.js";

const findUserProgress = (id, userId) => Progress.findOne({ _id: id, user: userId });

export const getMyProgress = async (req, res) => {
  try {
    const items = await Progress.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProgress = async (req, res) => {
  try {
    const { title, plannedMinutes, imageUrl = "" } = req.body;
    const item = await Progress.create({
      user: req.user.id,
      title,
      plannedMinutes,
      imageUrl,
    });
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addStudiedMinutes = async (req, res) => {
  try {
    const minutes = Number(req.body.minutes);
    if (!Number.isFinite(minutes) || minutes < 1) {
      return res.status(400).json({ success: false, message: "Số phút không hợp lệ." });
    }

    const item = await findUserProgress(req.params.id, req.user.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Không tìm thấy mục tiêu học." });
    }

    item.studiedMinutes += Math.round(minutes);
    await item.save();
    res.status(200).json({ success: true, item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteProgress = async (req, res) => {
  try {
    const item = await Progress.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) {
      return res.status(404).json({ success: false, message: "Không tìm thấy mục tiêu học." });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};