import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Check,
  Clapperboard,
  Clock3,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  createVideoSchedule,
  deleteVideoSchedule,
  getMyVideoSchedule,
  updateVideoSchedule,
} from "../api/videoScheduleApi";

const WEEKDAYS = [
  { value: 1, label: "Thứ Hai", shortLabel: "T2" },
  { value: 2, label: "Thứ Ba", shortLabel: "T3" },
  { value: 3, label: "Thứ Tư", shortLabel: "T4" },
  { value: 4, label: "Thứ Năm", shortLabel: "T5" },
  { value: 5, label: "Thứ Sáu", shortLabel: "T6" },
  { value: 6, label: "Thứ Bảy", shortLabel: "T7" },
  { value: 7, label: "Chủ Nhật", shortLabel: "CN" },
];

const PLATFORMS = ["YouTube", "TikTok", "Facebook", "Instagram", "Khác"];

const createEmptyForm = () => ({
  title: "",
  day: "1",
  time: "19:00",
  platform: "YouTube",
  note: "",
});

const readCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

function RoadmapPage() {
  const navigate = useNavigate();
  const [user] = useState(readCurrentUser);
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [form, setForm] = useState(createEmptyForm);
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    let isCurrentRequest = true;
    const loadSchedule = async () => {
      try {
        const response = await getMyVideoSchedule();
        if (isCurrentRequest) setSchedule(response.data.items || []);
      } catch (loadError) {
        if (isCurrentRequest) {
          setError(loadError.response?.data?.message || "Không thể tải lịch đăng video từ máy chủ.");
        }
      } finally {
        if (isCurrentRequest) setLoading(false);
      }
    };

    void loadSchedule();
    return () => {
      isCurrentRequest = false;
    };
  }, [navigate, user]);

  const scheduledDays = useMemo(
    () => new Set(schedule.map((item) => Number(item.day))).size,
    [schedule],
  );

  const itemsByDay = useMemo(() => {
    const grouped = new Map(WEEKDAYS.map((day) => [day.value, []]));
    schedule.forEach((item) => grouped.get(Number(item.day)).push(item));
    grouped.forEach((items) => items.sort((first, second) => first.time.localeCompare(second.time)));
    return grouped;
  }, [schedule]);

  const resetForm = () => {
    setForm(createEmptyForm());
    setEditingId("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setError("Vui lòng nhập tên video.");
      return;
    }

    const data = {
      title,
      day: Number(form.day),
      time: form.time,
      platform: form.platform,
      note: form.note.trim(),
    };

    try {
      setSubmitting(true);
      setError("");
      const response = editingId
        ? await updateVideoSchedule(editingId, data)
        : await createVideoSchedule(data);
      const savedItem = response.data.item;
      setSchedule((currentSchedule) => editingId
        ? currentSchedule.map((item) => item._id === editingId ? savedItem : item)
        : [...currentSchedule, savedItem]);
      resetForm();
    } catch (saveError) {
      setError(saveError.response?.data?.message || "Không thể lưu lịch đăng video vào cơ sở dữ liệu.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      day: String(item.day),
      time: item.time,
      platform: item.platform,
      note: item.note,
    });
    setEditingId(item._id);
    setError("");
    document.getElementById("schedule-title")?.focus();
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Bạn có chắc muốn xóa lịch đăng video "${item.title}"?`)) return;
    try {
      setDeletingId(item._id);
      setError("");
      await deleteVideoSchedule(item._id);
      setSchedule((currentSchedule) => currentSchedule.filter((entry) => entry._id !== item._id));
      if (editingId === item._id) resetForm();
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || "Không thể xóa lịch đăng video.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="weekly-schedule-page">
      <section className="weekly-schedule-hero">
        <div className="weekly-schedule-shell">
          <p className="weekly-schedule-eyebrow">
            <CalendarDays size={15} />
            KẾ HOẠCH HẰNG TUẦN
          </p>
          <div className="weekly-schedule-heading">
            <div>
              <h1>Lịch học <span>& lịch đăng video</span></h1>
              <p>Sắp xếp thời gian đăng video cố định trong tuần và theo dõi kế hoạch của bạn.</p>
            </div>
            <div className="weekly-schedule-stats" aria-label="Tổng quan lịch đăng">
              <div>
                <strong>{schedule.length}</strong>
                <span>Lịch đăng</span>
              </div>
              <div>
                <strong>{scheduledDays}/7</strong>
                <span>Ngày có lịch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="weekly-schedule-shell weekly-schedule-content">
        <section className="schedule-editor">
          <div className="schedule-section-heading">
            <div className="schedule-heading-icon"><Clapperboard size={19} /></div>
            <div>
              <h2>{editingId ? "Chỉnh sửa lịch đăng" : "Thêm lịch đăng video"}</h2>
              <p>Lịch sẽ lặp lại vào ngày và giờ đã chọn mỗi tuần.</p>
            </div>
          </div>

          {error && <div className="schedule-error" role="alert">{error}</div>}

          <form className="schedule-form" onSubmit={handleSubmit}>
            <div className="schedule-field schedule-field-title">
              <label htmlFor="schedule-title">Tên video</label>
              <input
                id="schedule-title"
                type="text"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Ví dụ: JavaScript trong 5 phút"
                maxLength={140}
                required
              />
            </div>
            <div className="schedule-field">
              <label htmlFor="schedule-day">Ngày đăng</label>
              <select
                id="schedule-day"
                value={form.day}
                onChange={(event) => setForm({ ...form, day: event.target.value })}
              >
                {WEEKDAYS.map((day) => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>
            <div className="schedule-field">
              <label htmlFor="schedule-time">Giờ đăng</label>
              <input
                id="schedule-time"
                type="time"
                value={form.time}
                onChange={(event) => setForm({ ...form, time: event.target.value })}
                required
              />
            </div>
            <div className="schedule-field">
              <label htmlFor="schedule-platform">Nền tảng</label>
              <select
                id="schedule-platform"
                value={form.platform}
                onChange={(event) => setForm({ ...form, platform: event.target.value })}
              >
                {PLATFORMS.map((platform) => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>
            <div className="schedule-field schedule-field-note">
              <label htmlFor="schedule-note">Ghi chú <span>(không bắt buộc)</span></label>
              <input
                id="schedule-note"
                type="text"
                value={form.note}
                onChange={(event) => setForm({ ...form, note: event.target.value })}
                placeholder="Nội dung cần chuẩn bị..."
                maxLength={300}
              />
            </div>
            <div className="schedule-form-actions">
              {editingId && (
                <button className="schedule-cancel-button" type="button" onClick={resetForm}>
                  <X size={16} /> Hủy
                </button>
              )}
              <button className="schedule-save-button" type="submit" disabled={submitting || loading}>
                {editingId ? <Check size={17} /> : <Plus size={17} />}
                {submitting ? "Đang lưu..." : editingId ? "Lưu thay đổi" : "Thêm vào lịch"}
              </button>
            </div>
          </form>
        </section>

        <section className="weekly-calendar" aria-label="Lịch đăng video trong tuần">
          <div className="schedule-calendar-heading">
            <div>
              <span>LỊCH CỐ ĐỊNH</span>
              <h2>Kế hoạch trong tuần</h2>
            </div>
            <span className="schedule-timezone">Lặp lại hằng tuần</span>
          </div>

          {loading ? (
            <div className="weekly-calendar-empty">Đang tải lịch từ cơ sở dữ liệu...</div>
          ) : (
          <div className="weekly-calendar-grid">
            {WEEKDAYS.map((day) => {
              const dayItems = itemsByDay.get(day.value);
              return (
                <article className="weekly-day-column" key={day.value}>
                  <header className="weekly-day-header">
                    <span className="weekly-day-short">{day.shortLabel}</span>
                    <h3>{day.label}</h3>
                    <span className="weekly-day-count">{dayItems.length}</span>
                  </header>

                  {dayItems.length ? (
                    <div className="weekly-day-items">
                      {dayItems.map((item) => (
                        <div className="weekly-video-card" key={item._id}>
                          <div className="weekly-video-time">
                            <Clock3 size={14} /> {item.time}
                          </div>
                          <h4>{item.title}</h4>
                          <span className="weekly-video-platform">{item.platform}</span>
                          {item.note && <p>{item.note}</p>}
                          <div className="weekly-video-actions">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              aria-label={`Sửa lịch ${item.title}`}
                              disabled={Boolean(deletingId)}
                            >
                              <Pencil size={14} /> Sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              aria-label={`Xóa lịch ${item.title}`}
                              disabled={deletingId === item._id}
                            >
                              <Trash2 size={14} /> Xóa
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="weekly-day-empty">Chưa có lịch</p>
                  )}
                </article>
              );
            })}
          </div>
          )}

          {!loading && schedule.length === 0 && (
            <div className="weekly-calendar-empty">
              Chưa có lịch đăng video. Thêm lịch đầu tiên bằng biểu mẫu phía trên nhé.
            </div>
          )}
        </section>
        <p className="schedule-storage-note">Lịch đăng được lưu trong cơ sở dữ liệu gắn với tài khoản của bạn.</p>
      </div>
    </main>
  );
}

export default RoadmapPage;
