import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  Calendar,
  Camera,
  Heart,
  Loader2,
  MessageCircle,
  PenLine,
  Search,
  Share2,
  Smile,
  Sparkles,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { createBlog, getBlogs } from "../api/blogApi";
import { getMediaUrl } from "../utils/mediaUrl";

function BlogPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const displayName = user?.name || "Người dùng";
  const username = user?.email ? user.email.split("@")[0] : "username";
  const avatarText = displayName?.charAt(0)?.toUpperCase() || "U";
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusText, setStatusText] = useState("");
  const [statusImage, setStatusImage] = useState(null);
  const [statusPreview, setStatusPreview] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getBlogs();
        setBlogs(response.data.blogs || []);
      } catch {
        setError("Không thể tải bài viết lúc này.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleStatusImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatusImage(file);
    setStatusPreview(URL.createObjectURL(file));
  };

  const handleCreateStatus = async () => {
    const content = statusText.trim();
    if (!content) {
      window.alert("Bạn chưa nhập trạng thái nào.");
      return;
    }

    try {
      setPosting(true);
      const formData = new FormData();
      const title = `${displayName} • ${new Date().toLocaleDateString("vi-VN")}`;
      formData.append("title", title);
      formData.append("excerpt", content.slice(0, 160));
      formData.append("content", content);
      formData.append("author", displayName);
      if (statusImage) {
        formData.append("thumbnail", statusImage);
      }

      const response = await createBlog(formData);
      const newBlog = response.data.blog;
      setBlogs((current) => [newBlog, ...current]);
      setStatusText("");
      setStatusImage(null);
      setStatusPreview("");
    } catch (submitError) {
      const message =
        submitError.response?.data?.message ||
        "Không thể đăng trạng thái. Vui lòng thử lại.";
      window.alert(message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <MainLayout>
      <section className="min-h-screen bg-[#f6f3ff] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 overflow-hidden rounded-[30px] border border-violet-200/70 bg-white shadow-[0_20px_60px_rgba(91,74,135,0.12)]">
            <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.22),_transparent_30%),linear-gradient(135deg,#fff7fb_0%,#f1ecff_45%,#eef9ff_100%)]">
              <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
              <div className="relative px-5 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 text-lg font-bold text-white shadow-lg shadow-violet-300/60">
                      {avatarText}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-500">
                        Personal Blog
                      </p>
                      <h1 className="text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">
                        {displayName}
                      </h1>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-violet-200 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-sm">
                    <Search className="h-4 w-4 text-violet-500" />
                    <span className="text-sm text-slate-500">Tìm kiếm bài viết</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-xl">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                      <Sparkles className="h-3.5 w-3.5" />
                      Góc suy nghĩ & cảm hứng
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-800 sm:text-5xl">
                      Một nơi để chia sẻ <span className="text-transparent bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text">hành trình</span> và trạng thái ngày mới.
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                      Viết xuống những suy nghĩ, khoảnh khắc đẹp và những trải nghiệm nhỏ bé nhưng meaningful trong cuộc sống.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 sm:min-w-[260px]">
                    <div className="rounded-2xl border border-violet-100 bg-white/80 p-3 shadow-sm">
                      <div className="text-xl font-black text-slate-800">128</div>
                      <div className="text-[11px] text-slate-500">Bài viết</div>
                    </div>
                    <div className="rounded-2xl border border-pink-100 bg-white/80 p-3 shadow-sm">
                      <div className="text-xl font-black text-slate-800">9.2K</div>
                      <div className="text-[11px] text-slate-500">Người theo dõi</div>
                    </div>
                    <div className="rounded-2xl border border-amber-100 bg-white/80 p-3 shadow-sm">
                      <div className="text-xl font-black text-slate-800">367</div>
                      <div className="text-[11px] text-slate-500">Thích</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-6">
              <div className="rounded-[28px] border border-violet-100 bg-white p-4 shadow-[0_18px_45px_rgba(79,70,229,0.08)] sm:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-pink-500 text-sm font-bold text-white">
                    {avatarText}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{displayName}</p>
                    <p className="text-xs text-slate-500">Đang chia sẻ điều gì đó mới</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 p-4">
                  <textarea
                    rows="3"
                    value={statusText}
                    onChange={(event) => setStatusText(event.target.value)}
                    placeholder="Hôm nay bạn đang nghĩ gì?"
                    className="w-full resize-none border-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  />
                  {statusPreview && (
                    <div className="mt-3 overflow-hidden rounded-2xl border border-violet-200 bg-white">
                      <img
                        src={statusPreview}
                        alt="Preview status"
                        className="max-h-64 w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-pink-50 px-3 py-2 font-medium text-pink-600 transition hover:bg-pink-100">
                      <Camera className="h-4 w-4" /> Ảnh
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleStatusImageChange}
                      />
                    </label>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-2 font-medium text-violet-600 transition hover:bg-violet-100"
                    >
                      <Smile className="h-4 w-4" /> Cảm xúc
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateStatus}
                    disabled={posting || !statusText.trim()}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <PenLine className="h-4 w-4" />
                    {posting ? "Đang đăng..." : "Đăng trạng thái"}
                  </button>
                </div>
              </div>

              {loading && (
                <div className="flex justify-center rounded-[24px] border border-violet-100 bg-white p-12 shadow-sm">
                  <Loader2 className="h-9 w-9 animate-spin text-violet-600" />
                </div>
              )}

              {error && (
                <div className="rounded-[24px] border border-red-100 bg-red-50 p-6 text-center text-red-600">
                  {error}
                </div>
              )}

              {!loading && !error && blogs.length === 0 && (
                <div className="rounded-[24px] border border-violet-100 bg-white p-8 text-center text-slate-500 shadow-sm">
                  Chưa có bài viết nào. Hãy chia sẻ suy nghĩ đầu tiên của bạn.
                </div>
              )}

              {!loading && !error && blogs.map((blog) => (
                <article
                  key={blog._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => blog._id && navigate(`/blog/${blog._id}`)}
                  onKeyDown={(event) => {
                    if ((event.key === "Enter" || event.key === " ") && blog._id) {
                      event.preventDefault();
                      navigate(`/blog/${blog._id}`);
                    }
                  }}
                  className="cursor-pointer overflow-hidden rounded-[28px] border border-violet-100 bg-white shadow-[0_18px_45px_rgba(79,70,229,0.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(79,70,229,0.12)] focus:outline-none focus:ring-2 focus:ring-violet-300"
                >
                  <div className="flex items-center justify-between p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-bold text-white">
                        {avatarText}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{displayName}</p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(blog.createdAt || new Date())}
                        </div>
                      </div>
                    </div>

                    <button className="rounded-full border border-violet-100 bg-violet-50 p-2 text-violet-600 transition hover:bg-violet-100">
                      <Bookmark className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                    <h3 className="text-xl font-black tracking-tight text-slate-800 sm:text-2xl">
                      {blog.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-[15px]">
                      {blog.excerpt || blog.content || "Một ngày mới bắt đầu với những suy nghĩ tích cực và niềm tin rằng mọi thứ sẽ tốt hơn từng ngày."}
                    </p>

                    {blog.thumbnail && (
                      <div className="mt-4 overflow-hidden rounded-[22px] border border-violet-100 bg-slate-100">
                        <img
                          src={getMediaUrl(blog.thumbnail)}
                          alt={blog.title}
                          className="h-64 w-full object-cover sm:h-80"
                        />
                      </div>
                    )}

                    {!blog.thumbnail && (
                      <div className="mt-4 rounded-[22px] bg-gradient-to-br from-violet-500 via-pink-500 to-orange-400 p-5 text-white shadow-lg shadow-violet-200/60">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-50">
                          Mood of the day
                        </div>
                        <p className="text-lg font-semibold leading-8">
                          “Mỗi ngày không cần phải hoàn hảo. Chỉ cần mình biết bước tiếp, tập trung vào điều tốt đẹp và giữ niềm tin.”
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-2 text-sm font-medium text-pink-600 transition hover:bg-pink-100"
                      >
                        <Heart className="h-4 w-4" /> 128
                      </button>
                      <button
                        type="button"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-2 text-sm font-medium text-sky-600 transition hover:bg-sky-100"
                      >
                        <MessageCircle className="h-4 w-4" /> 24
                      </button>
                      <button
                        type="button"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-2 text-sm font-medium text-violet-600 transition hover:bg-violet-100"
                      >
                        <Share2 className="h-4 w-4" /> Chia sẻ
                      </button>

                      <Link
                        to={`/blog/${blog._id}`}
                        onClick={(event) => event.stopPropagation()}
                        className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-violet-600 transition hover:text-violet-700"
                      >
                        Đọc thêm <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="space-y-6">
              <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(79,70,229,0.08)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 text-lg font-bold text-white">
                      {avatarText}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{displayName}</p>
                      <p className="text-xs text-slate-500">@{username}</p>
                    </div>
                  </div>
                  <button className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                    Theo dõi
                  </button>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  “Yêu một điều gì đó thật sự là biết đặt từng khoảnh khắc nhỏ vào cuộc sống và giữ chúng thật đẹp.”
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-2xl bg-violet-50 p-3">
                    <div className="text-lg font-black text-slate-800">126</div>
                    <div className="text-[10px] text-slate-500">Bài đăng</div>
                  </div>
                  <div className="rounded-2xl bg-pink-50 p-3">
                    <div className="text-lg font-black text-slate-800">3.8K</div>
                    <div className="text-[10px] text-slate-500">Người hâm mộ</div>
                  </div>
                  <div className="rounded-2xl bg-amber-50 p-3">
                    <div className="text-lg font-black text-slate-800">52</div>
                    <div className="text-[10px] text-slate-500">Bài hay</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(79,70,229,0.08)]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-800">Chủ đề nổi bật</h3>
                  <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-600">
                    Trending
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    "#SuyNghĩ",
                    "#CuộcSốngMỗiNgày",
                    "#HànhTrình",
                    "#ĐờiSốngĐẹp",
                    "#KhámPhá",
                  ].map((tag) => (
                    <button
                      key={tag}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                    >
                      <span>{tag}</span>
                      <span className="text-xs text-slate-400">24</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-violet-100 bg-gradient-to-br from-violet-600 to-pink-500 p-5 text-white shadow-[0_20px_50px_rgba(168,85,247,0.35)]">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-50">
                  <Sparkles className="h-3.5 w-3.5" />
                  Daily note
                </div>
                <h3 className="text-xl font-black leading-8">
                  Tự do để viết ra những điều mình thích.
                </h3>
                <p className="mt-3 text-sm leading-7 text-violet-50/90">
                  Chia sẻ cảm xúc, suy nghĩ và những hình ảnh đẹp như một nhật ký cá nhân sống động.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default BlogPage;
