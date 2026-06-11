import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getLessonById, getLessonsByCourse } from "../api/lessonApi";

function LessonLearningPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const lessonRes = await getLessonById(lessonId);
        setLesson(lessonRes.data.lesson);
        const lessonsRes = await getLessonsByCourse(courseId);
        setLessons(lessonsRes.data.lessons);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, lessonId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-5 text-gray-600 font-medium">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <p className="text-red-500 font-semibold">Không tìm thấy bài học.</p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Quay lại khóa học
          </button>
        </div>
      </div>
    );
  }

  // Xử lý YouTube embed URL (giữ nguyên logic)
  let embedUrl = "";
  if (lesson.videoUrl) {
    if (lesson.videoUrl.includes("watch?v=")) {
      embedUrl = lesson.videoUrl.replace("watch?v=", "embed/");
    } else if (lesson.videoUrl.includes("youtu.be/")) {
      const videoId = lesson.videoUrl.split("youtu.be/")[1]?.split("?")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (lesson.videoUrl.includes("youtube.com/embed/")) {
      embedUrl = lesson.videoUrl;
    } else {
      embedUrl = lesson.videoUrl;
    }
  }

  const currentIndex = lessons.findIndex((item) => item._id === lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const progress =
    lessons.length > 0
      ? Math.round(((currentIndex + 1) / lessons.length) * 100)
      : 0;

  const formatDuration = (duration) => {
    if (!duration) return null;
    if (typeof duration === "number") {
      const mins = Math.floor(duration / 60);
      const secs = duration % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    return duration;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER - Sticky, hiện đại */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/70 shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              aria-label="Quay lại"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
            <h1 className="font-semibold text-gray-800 text-base sm:text-lg truncate max-w-[200px] sm:max-w-md">
              {lesson.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress bar - desktop */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                {progress}%
              </span>
              <div className="w-32 lg:w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <Link
              to={`/courses/${courseId}`}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-200"
            >
              Khóa học
            </Link>
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium rounded-xl bg-gray-800 text-white shadow-sm hover:bg-gray-900 transition-all duration-200"
            >
              Trang chủ
            </Link>
          </div>
        </div>

        {/* Progress bar - mobile (dưới header) */}
        <div className="md:hidden px-4 pb-2">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Tiến trình</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT: flex column trên mobile, row trên lg */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* KHU VỰC NỘI DUNG CHÍNH (video + mô tả) */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Video player */}
          <div className="w-full bg-black/5 border-b border-gray-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
              <div className="relative rounded-xl overflow-hidden shadow-xl bg-black aspect-video">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={lesson.title}
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
                    <div className="text-center">
                      <svg
                        className="w-16 h-16 mx-auto text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-2">Không có video cho bài học này</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Thông tin bài học + nút điều hướng */}
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 lg:py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {lesson.title}
              </h1>
              <div className="mt-4 prose prose-gray max-w-none text-gray-600 leading-relaxed">
                {lesson.description ? (
                  <p>{lesson.description}</p>
                ) : (
                  <p className="italic text-gray-400">
                    Chưa có mô tả chi tiết cho bài học này.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
                {prevLesson ? (
                  <Link
                    to={`/learn/${courseId}/${prevLesson._id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Bài trước
                  </Link>
                ) : (
                  <div></div>
                )}

                {nextLesson && (
                  <Link
                    to={`/learn/${courseId}/${nextLesson._id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 transition-all duration-200"
                  >
                    Bài tiếp theo
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR - Danh sách bài học */}
        <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col overflow-hidden lg:sticky lg:top-16 lg:self-start max-h-[calc(100vh-4rem)]">
          <div className="p-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
            <h2 className="font-bold text-xl text-gray-800">
              Nội dung khóa học
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {lessons.length} bài học
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {lessons.map((item, index) => {
              const isActive = item._id === lessonId;
              return (
                <Link
                  key={item._id}
                  to={`/learn/${courseId}/${item._id}`}
                  className={`block px-5 py-4 transition-all duration-150 ${
                    isActive
                      ? "bg-blue-50/80 border-l-4 border-blue-600"
                      : "hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium truncate ${
                          isActive ? "text-blue-700" : "text-gray-800"
                        }`}
                      >
                        {item.title}
                      </p>
                      {item.duration && (
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {formatDuration(item.duration)}
                        </p>
                      )}
                    </div>
                    {isActive && (
                      <svg
                        className="w-5 h-5 text-blue-600 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonLearningPage;
