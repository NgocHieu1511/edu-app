import Attendance from "../models/attendance.model.js";

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCheckInStatus = (dateString, todayDate) => {
  if (dateString === todayDate) return "Hôm nay";
  return "Đã điểm danh";
};

const getBadgeInfo = (totalDays) => {
  if (totalDays >= 30) {
    return { name: "Kim cương", color: "from-sky-500 to-cyan-500", points: 300, next: null };
  }
  if (totalDays >= 15) {
    return { name: "Vàng", color: "from-yellow-400 to-amber-500", points: 150, next: 30 };
  }
  if (totalDays >= 7) {
    return { name: "Bạc", color: "from-slate-400 to-gray-500", points: 70, next: 15 };
  }
  if (totalDays >= 3) {
    return { name: "Đồng", color: "from-orange-400 to-amber-500", points: 30, next: 7 };
  }

  return { name: "Bắt đầu", color: "from-blue-500 to-indigo-500", points: 0, next: 3 };
};

export const getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayDate = getLocalDateString();

    const records = await Attendance.find({ user: userId })
      .sort({ date: -1 })
      .limit(30)
      .lean();

    const todayRecord = records.find((item) => item.date === todayDate) || null;

    res.status(200).json({
      success: true,
      records,
      today: todayRecord,
      checkedInToday: Boolean(todayRecord),
      totalDays: records.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayDate = getLocalDateString();

    const existing = await Attendance.findOne({ user: userId, date: todayDate });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Bạn đã điểm danh hôm nay.",
        attendance: existing,
        checkedInToday: true,
      });
    }

    const attendance = await Attendance.create({
      user: userId,
      date: todayDate,
      checkedInAt: new Date(),
      status: "present",
      points: 10,
      notes: "Điểm danh hàng ngày",
    });

    res.status(201).json({
      success: true,
      message: "Điểm danh thành công.",
      attendance,
      checkedInToday: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAttendanceSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayDate = getLocalDateString();

    const records = await Attendance.find({ user: userId }).sort({ date: -1 }).lean();

    const recordDates = new Set(records.map((item) => item.date));
    let streak = 0;
    let cursor = new Date();

    while (recordDates.has(getLocalDateString(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    const totalPoints = records.reduce((sum, item) => sum + Number(item.points || 10), 0);
    const badge = getBadgeInfo(records.length);

    res.status(200).json({
      success: true,
      streak,
      totalDays: records.length,
      totalPoints,
      badge,
      checkedInToday: recordDates.has(todayDate),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getCheckInStatus };
