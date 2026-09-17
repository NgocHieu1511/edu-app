import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Flame,
  Loader2,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import {
  checkInAttendance,
  getAttendanceSummary,
  getMyAttendance,
} from "../api/attendanceApi";

const todayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getMonthLabel = (date) =>
  date.toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });

const getCalendarDays = (date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const startDay = new Date(firstDay);
  startDay.setDate(startDay.getDate() - firstDay.getDay());

  const days = [];
  for (let index = 0; index < 42; index += 1) {
    const current = new Date(startDay);
    current.setDate(startDay.getDate() + index);
    days.push(current);
  }

  return days;
};

function AttendancePage() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const [summary, setSummary] = useState({
    streak: 0,
    totalDays: 0,
    totalPoints: 0,
    badge: { name: "Bắt đầu", color: "from-blue-500 to-indigo-500", points: 0, next: 3 },
    checkedInToday: false,
  });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryRes, attendanceRes] = await Promise.all([
          getAttendanceSummary(),
          getMyAttendance(),
        ]);

        setSummary({
          streak: summaryRes.data.streak || 0,
          totalDays: summaryRes.data.totalDays || 0,
          totalPoints: summaryRes.data.totalPoints || 0,
          badge: summaryRes.data.badge || { name: "Bắt đầu", color: "from-blue-500 to-indigo-500", points: 0, next: 3 },
          checkedInToday: Boolean(summaryRes.data.checkedInToday),
        });

        setRecords(attendanceRes.data.records || []);
      } catch (error) {
        console.error("Error loading attendance data:", error);
        setMessage(error.response?.data?.message || "Không thể tải dữ liệu chấm công.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, user]);

  const checkedInToday = useMemo(() => {
    return summary.checkedInToday || records.some((item) => item.date === todayString());
  }, [records, summary.checkedInToday]);

  const attendanceSet = useMemo(
    () => new Set((records || []).map((item) => item.date)),
    [records],
  );

  const calendarDays = useMemo(
    () => getCalendarDays(calendarMonth),
    [calendarMonth],
  );

  const handleCheckIn = async () => {
    if (!user) return;

    try {
      setSubmitting(true);
      setMessage("");
      const res = await checkInAttendance();

      const nextSummary = await getAttendanceSummary();
      const nextRecords = await getMyAttendance();

      setSummary({
        streak: nextSummary.data.streak || 0,
        totalDays: nextSummary.data.totalDays || 0,
        totalPoints: nextSummary.data.totalPoints || 0,
        badge: nextSummary.data.badge || { name: "Bắt đầu", color: "from-blue-500 to-indigo-500", points: 0, next: 3 },
        checkedInToday: Boolean(nextSummary.data.checkedInToday),
      });
      setRecords(nextRecords.data.records || []);
      setMessage(res.data.message || "Điểm danh thành công.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Điểm danh thất bại, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="text-lg text-gray-600">Đang chuyển hướng đến trang đăng nhập...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-blue-100">Daily attendance</p>
            <h1 className="text-3xl font-bold">Chấm công hàng ngày</h1>
          </div>

          <button
            type="button"
            onClick={handleCheckIn}
            disabled={checkedInToday || submitting || loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-base font-semibold text-blue-700 shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CalendarCheck className="h-5 w-5" />}
            {checkedInToday ? "Đã điểm danh hôm nay" : "Điểm danh hôm nay"}
          </button>
        </div>

        {message && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </div>
        )}

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-blue-600">
              <Flame className="h-5 w-5" />
              <span className="text-sm font-semibold">Chuỗi điểm danh</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{summary.streak} ngày</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-indigo-600">
              <CalendarCheck className="h-5 w-5" />
              <span className="text-sm font-semibold">Tổng ngày</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{summary.totalDays} ngày</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-yellow-500">
              <span className="text-lg font-bold">★</span>
              <span className="text-sm font-semibold">Điểm tích lũy</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{summary.totalPoints}</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-semibold">Trạng thái</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {checkedInToday ? "Đã chấm công" : "Chưa chấm công"}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-gray-200 bg-gradient-to-r from-slate-50 to-blue-50 p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Badge hiện tại</p>
              <div className="mt-2 flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r ${summary.badge.color} text-lg font-bold text-white`}>
                  {summary.badge.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">{summary.badge.name}</p>
                  <p className="text-sm text-gray-600">
                    {summary.badge.next
                      ? `Cần ${summary.badge.next - summary.totalDays} ngày nữa để lên hạng tiếp theo`
                      : "Bạn đã đạt hạng cao nhất"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Điểm nhận được / ngày</p>
              <p className="mt-1 text-2xl font-bold text-blue-700">+10</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <CalendarCheck className="h-5 w-5 text-blue-600" />
              Lịch chấm công theo tháng
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCalendarMonth(
                    new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1),
                  )
                }
                className="rounded-xl border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100"
                aria-label="Tháng trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-[150px] text-center text-sm font-semibold text-gray-700">
                {getMonthLabel(calendarMonth)}
              </span>
              <button
                type="button"
                onClick={() =>
                  setCalendarMonth(
                    new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1),
                  )
                }
                className="rounded-xl border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100"
                aria-label="Tháng sau"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang tải dữ liệu...
            </div>
          ) : records.length === 0 ? (
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-6 text-slate-600">
              <CircleAlert className="h-4 w-4" />
              Chưa có dữ liệu điểm danh nào.
            </div>
          ) : (
            <>
              <div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                  <div key={day} className="py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day) => {
                  const yyyy = day.getFullYear();
                  const mm = String(day.getMonth() + 1).padStart(2, '0');
                  const dd = String(day.getDate()).padStart(2, '0');
                  const dateKey = `${yyyy}-${mm}-${dd}`;
                  const isCurrentMonth = day.getMonth() === calendarMonth.getMonth();
                  const isToday = dateKey === todayString();
                  const isChecked = attendanceSet.has(dateKey);

                  return (
                    <div
                      key={dateKey}
                      className={`flex min-h-[72px] flex-col rounded-2xl border p-2 transition ${
                        isCurrentMonth ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 text-gray-400'
                      } ${isToday ? 'ring-2 ring-blue-200' : ''} ${isChecked ? 'border-emerald-200 bg-emerald-50' : ''}`}
                    >
                      <span
                        className={`mb-1 text-right text-xs font-semibold ${
                          isToday ? 'text-blue-600' : isChecked ? 'text-emerald-700' : 'text-gray-500'
                        }`}
                      >
                        {day.getDate()}
                      </span>

                      {isChecked ? (
                        <div className="mt-auto flex items-center justify-center rounded-xl bg-emerald-500 px-2 py-1 text-[10px] font-semibold text-white">
                          Có mặt
                        </div>
                      ) : isToday ? (
                        <div className="mt-auto flex items-center justify-center rounded-xl bg-blue-100 px-2 py-1 text-[10px] font-semibold text-blue-700">
                          Hôm nay
                        </div>
                      ) : (
                        <div className="mt-auto h-6" />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default AttendancePage;
