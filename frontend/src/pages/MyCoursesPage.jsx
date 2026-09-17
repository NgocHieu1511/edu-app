import { useMemo, useState } from "react";
import { CalendarClock, BellRing, Plus, Trash2 } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

const STORAGE_KEY = "studyReminders";

const safeParseReminders = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const formatDate = (dateValue) => {
  if (!dateValue) return "Chưa cập nhật";

  const parsedDate = dateValue.includes("T")
    ? new Date(dateValue)
    : new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Chưa cập nhật";
  }

  return parsedDate.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCountdown = (dateValue) => {
  if (!dateValue) return "Chưa có hạn";

  const target = dateValue.includes("T")
    ? new Date(dateValue)
    : new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(target.getTime())) {
    return "Chưa có hạn";
  }

  const diffMs = target.getTime() - Date.now();
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) return `Quá hạn ${Math.abs(diffDays)} ngày`;
  if (diffHours <= 24) return `Còn ${diffHours} giờ`;
  return `Còn ${diffDays} ngày`;
};

function MyCoursesPage() {
  const [form, setForm] = useState({ lessonName: "", dueDate: "" });
  const [reminders, setReminders] = useState(safeParseReminders);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const isAdmin = currentUser?.role === "admin";

  const persistReminders = (nextList) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    setReminders(nextList);
    window.dispatchEvent(new Event("study-reminders-updated"));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isAdmin) {
      setError("Chỉ admin mới có quyền thêm lời nhắc.");
      setMessage("");
      return;
    }

    const lessonName = form.lessonName.trim();
    const dueDate = form.dueDate;

    if (!lessonName || !dueDate) {
      setError("Vui lòng nhập tên bài học và hạn thêm bài.");
      setMessage("");
      return;
    }

    const nextReminder = {
      id: Date.now().toString(),
      lessonName,
      dueDate,
      createdAt: new Date().toISOString(),
    };

    const nextList = [nextReminder, ...safeParseReminders()];
    persistReminders(nextList);
    setForm({ lessonName: "", dueDate: "" });
    setError("");
    setMessage("Lời nhắc đã được lưu và hiển thị trên trang chủ.");
  };

  const handleDelete = (id) => {
    const filtered = safeParseReminders().filter((item) => item.id !== id);
    persistReminders(filtered);
    setMessage("Lời nhắc đã được xoá.");
    setError("");
  };

  return (
    <MainLayout>
      <div className="reminder-page-shell">
        <div className="reminder-page-header">
          <div>
            <p className="reminder-eyebrow">Quản lý lời nhắc</p>
            <h1>Thêm lời nhắc bài học mới</h1>
          </div>
          <div className="reminder-badge">
            <BellRing size={16} />
            {reminders.length} lời nhắc
          </div>
        </div>

        <div className="reminder-grid">
          <form className="reminder-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <CalendarClock size={18} />
              <span>Thông tin nhắc nhở</span>
            </div>

            {message && <div className="form-message success">{message}</div>}
            {error && <div className="form-message error">{error}</div>}

            <label className="field-group">
              <span>Tên bài học</span>
              <input
                type="text"
                value={form.lessonName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, lessonName: event.target.value }))
                }
                placeholder="Ví dụ: JavaScript nâng cao"
                disabled={!isAdmin}
              />
            </label>

            <label className="field-group">
              <span>Hạn nộp thêm bài</span>
              <input
                type="datetime-local"
                value={form.dueDate}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, dueDate: event.target.value }))
                }
                disabled={!isAdmin}
              />
            </label>

            <button type="submit" className="submit-button" disabled={!isAdmin}>
              <Plus size={16} />
              Thêm lời nhắc
            </button>
          </form>

          <div className="reminder-list-wrap">
            <div className="list-header">
              <h2>Danh sách lời nhắc</h2>
            </div>

            {reminders.length === 0 ? (
              <div className="empty-state">
                Chưa có lời nhắc nào. Admin hãy thêm thông tin bài học mới.
              </div>
            ) : (
              <div className="reminder-list">
                {reminders.map((item) => (
                  <div className="reminder-item" key={item.id}>
                    <div className="reminder-main">
                      <span className="lesson-tag">Bài học</span>
                      <h3>{item.lessonName}</h3>
                      <p>
                        <strong>Hạn thêm bài:</strong> {formatDate(item.dueDate)}
                      </p>
                      <small>{formatCountdown(item.dueDate)}</small>
                    </div>

                    {isAdmin && (
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDelete(item.id)}
                        aria-label="Xoá lời nhắc"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default MyCoursesPage;
