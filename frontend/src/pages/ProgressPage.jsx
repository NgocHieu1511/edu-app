import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Clock3, Loader2, Plus, Target, Trash2 } from "lucide-react";
import {
  addStudiedMinutes as addStudiedMinutesApi,
  createProgress,
  deleteProgress,
  getMyProgress,
} from "../api/progressApi";

/* ---------- Progress ring (SVG + Tailwind) ---------- */
function ProgressRing({
  percentage,
  size = 96,
  strokeWidth = 8,
  trackClass = "stroke-slate-200",
  valueClass = "stroke-indigo-500",
  textClass = "text-lg text-slate-800",
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      aria-label={`${percentage}% hoàn thành`}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          className={`fill-none ${trackClass}`}
          strokeWidth={strokeWidth}
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          className={`fill-none ${valueClass} transition-[stroke-dashoffset] duration-700 ease-out`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className={`absolute font-bold ${textClass}`}>{percentage}%</span>
    </div>
  );
}

/* ---------- Stat card ---------- */
const STAT_ACCENTS = {
  indigo: "from-indigo-500 to-blue-500 shadow-indigo-500/30",
  violet: "from-violet-500 to-purple-500 shadow-violet-500/30",
  emerald: "from-emerald-500 to-teal-500 shadow-emerald-500/30",
};

function StatCard({ icon: Icon, label, value, accent = "indigo" }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg ${STAT_ACCENTS[accent]}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );
}

/* ---------- Page ---------- */
function ProgressPage() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [plannedMinutes, setPlannedMinutes] = useState(30);
  const [goalImage, setGoalImage] = useState("");
  const [message, setMessage] = useState("");
  const [activeItemId, setActiveItemId] = useState(null);
  const [additionalMinutes, setAdditionalMinutes] = useState(30);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getMyProgress()
      .then(({ data }) => {
        if (isMounted) {
          setItems(data.items || []);
        }
      }).catch((error) => {
        if (isMounted) {
          setLoadError(error.response?.data?.message || "Không thể tải tiến độ học tập từ cơ sở dữ liệu.");
        }
      }).finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = useMemo(() => {
    const planned = items.reduce((total, item) => total + item.plannedMinutes, 0);
    const studied = items.reduce((total, item) => total + item.studiedMinutes, 0);
    return {
      planned,
      studied,
      percentage: planned ? Math.min(100, Math.round((studied / planned) * 100)) : 0,
    };
  }, [items]);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setGoalImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    const minutes = Number(plannedMinutes);

    if (!cleanTitle || !Number.isFinite(minutes) || minutes < 1) {
      setMessage("Vui lòng nhập nội dung và thời gian dự kiến hợp lệ.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      const { data } = await createProgress({
        title: cleanTitle,
        plannedMinutes: Math.round(minutes),
        imageUrl: goalImage || "",
      });
      setItems((currentItems) => [data.item, ...currentItems]);
      setTitle("");
      setPlannedMinutes(30);
      setGoalImage("");
      setMessage("Đã lưu nội dung học vào cơ sở dữ liệu.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Không thể lưu nội dung học vào cơ sở dữ liệu.");
    } finally {
      setSaving(false);
    }
  };

  const addStudiedMinutes = async (id) => {
    const minutes = Number(additionalMinutes);

    if (!Number.isFinite(minutes) || minutes < 1) {
      return;
    }

    try {
      setUpdatingItemId(id);
      setMessage("");
      const { data } = await addStudiedMinutesApi(id, Math.round(minutes));
      setItems((currentItems) =>
        currentItems.map((item) => (item._id === id ? data.item : item)),
      );
      setActiveItemId(null);
      setAdditionalMinutes(30);
    } catch (error) {
      setMessage(error.response?.data?.message || "Không thể lưu thời gian học vào cơ sở dữ liệu.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingItemId(id);
      setMessage("");
      await deleteProgress(id);
      setItems((currentItems) => currentItems.filter((item) => item._id !== id));
      setMessage("Đã xóa nội dung học.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Không thể xóa nội dung học khỏi cơ sở dữ liệu.");
    } finally {
      setDeletingItemId(null);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* ---------- Header ---------- */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-xl shadow-indigo-500/20 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/90 backdrop-blur">
                <Target className="h-3.5 w-3.5" /> Study tracker
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Tiến độ học tập</h1>
              <p className="mt-2 text-sm text-white/80 sm:text-base">
                Lập mục tiêu học, ghi nhận thời gian đã học và theo dõi tiến độ của bạn.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-4 backdrop-blur">
              <ProgressRing
                percentage={summary.percentage}
                size={120}
                strokeWidth={7}
                trackClass="stroke-white/25"
                valueClass="stroke-white"
                textClass="text-2xl text-white"
              />
              <span className="text-[11px] font-medium uppercase tracking-wider text-white/80">
                Tổng tiến độ
              </span>
            </div>
          </div>
        </header>

        {/* ---------- Summary ---------- */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={Clock3}
            label="Thời gian đã học"
            value={`${summary.studied} phút`}
            accent="indigo"
          />
          <StatCard
            icon={BookOpen}
            label="Thời gian mục tiêu"
            value={`${summary.planned} phút`}
            accent="violet"
          />
          <StatCard
            icon={CheckCircle2}
            label="Nội dung đang theo dõi"
            value={items.length}
            accent="emerald"
          />
        </div>

        {/* ---------- Main layout ---------- */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Thêm nội dung cần học</h2>
                <p className="text-sm text-slate-500">Đặt tổng số phút bạn muốn hoàn thành.</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Nội dung học
                </span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Ví dụ: Ôn lại React hooks"
                  maxLength={100}
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Thời gian cần hoàn thành (phút)
                </span>
                <input
                  type="number"
                  min="1"
                  value={plannedMinutes}
                  onChange={(event) => setPlannedMinutes(event.target.value)}
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Ảnh mục tiêu (tùy chọn)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-200"
                />
                {goalImage && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <img
                      src={goalImage}
                      alt="Ảnh mục tiêu preview"
                      className="h-28 w-full object-cover"
                    />
                  </div>
                )}
              </label>
            </div>

            {message && (
              <p className="mt-4 rounded-xl bg-indigo-50 px-3 py-2 text-sm text-indigo-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving || loading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {saving ? "Đang lưu vào cơ sở dữ liệu..." : "Thêm mục tiêu"}
            </button>
          </form>

          {/* List */}
          <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-500">
                  Your goals
                </p>
                <h2 className="text-lg font-semibold text-slate-800">Nội dung của bạn</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {loading ? "Đang tải..." : `${items.length} mục`}
              </span>
            </div>

              {loading ? (
                <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 px-6 py-14 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tải dữ liệu từ cơ sở dữ liệu...
                </div>
              ) : loadError ? (
                <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-8 text-center text-sm text-rose-700">
                  Không thể tải dữ liệu đã lưu: {loadError}
                </div>
              ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-14 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-500 shadow-sm">
                  <BookOpen className="h-6 w-6" />
                </div>
                <strong className="text-slate-700">Chưa có nội dung học</strong>
                <p className="mt-1 max-w-xs text-sm text-slate-500">
                  Thêm mục tiêu đầu tiên để bắt đầu ghi nhận thời gian.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  const percentage = Math.min(
                    100,
                    Math.round((item.studiedMinutes / item.plannedMinutes) * 100),
                  );
                  const isActive = activeItemId === item._id;
                  const isDone = percentage >= 100;

                  return (
                    <article
                      key={item._id}
                      className={`rounded-2xl border p-4 transition ${
                        isActive
                          ? "border-indigo-200 bg-indigo-50/40 shadow-sm"
                          : "border-slate-200/70 bg-white hover:border-indigo-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex min-w-0 flex-1 items-start gap-4">
                          {item.imageUrl ? (
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : null}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="truncate font-semibold text-slate-800">
                                {item.title}
                              </h3>
                              <button
                                type="button"
                                onClick={() => handleDelete(item._id)}
                                disabled={deletingItemId === item._id}
                                aria-label={`Xóa ${item.title}`}
                                className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                              >
                                {deletingItemId === item._id
                                  ? <Loader2 className="h-4 w-4 animate-spin" />
                                  : <Trash2 className="h-4 w-4" />}
                              </button>
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                              <span>
                                Mục tiêu:{" "}
                                <strong className="font-semibold text-slate-700">
                                  {item.plannedMinutes} phút
                                </strong>
                              </span>
                              <span>
                                Đã học:{" "}
                                <strong
                                  className={`font-semibold ${
                                    isDone ? "text-emerald-600" : "text-indigo-600"
                                  }`}
                                >
                                  {item.studiedMinutes} phút
                                </strong>
                              </span>
                            </div>

                            <button
                              type="button"
                              disabled={Boolean(updatingItemId)}
                              onClick={() => {
                                setActiveItemId(isActive ? null : item._id);
                                setAdditionalMinutes(30);
                              }}
                              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
                            >
                              <Plus className="h-3.5 w-3.5" /> Thêm thời gian
                            </button>

                            {isActive && (
                              <form
                                onSubmit={(event) => {
                                  event.preventDefault();
                                  addStudiedMinutes(item._id);
                                }}
                                className="mt-3 flex items-end gap-2 rounded-xl border border-indigo-100 bg-white p-3"
                              >
                                <label className="flex-1">
                                  <span className="mb-1 block text-xs font-medium text-slate-600">
                                    Số phút
                                  </span>
                                  <input
                                    type="number"
                                    min="1"
                                    value={additionalMinutes}
                                    onChange={(event) =>
                                      setAdditionalMinutes(event.target.value)
                                    }
                                    autoFocus
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                  />
                                </label>
                                <button
                                  type="submit"
                                  disabled={updatingItemId === item._id}
                                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-95"
                                >
                                  {updatingItemId === item._id ? "Đang lưu..." : "Lưu"}
                                </button>
                              </form>
                            )}
                          </div>
                        </div>

                        <div className="ml-auto mt-2 flex justify-end">
                          <ProgressRing
                            percentage={percentage}
                            size={68}
                            strokeWidth={9}
                            valueClass={isDone ? "stroke-emerald-500" : "stroke-indigo-500"}
                            textClass="text-sm text-slate-700"
                          />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProgressPage;