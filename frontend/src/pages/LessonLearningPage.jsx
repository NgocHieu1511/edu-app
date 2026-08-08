import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getLessonById, getLessonsByCourse } from "../api/lessonApi";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  CheckCircle,
  Clock,
  BookOpen,
  ChevronRight,
  Menu,
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Share2,
  Heart,
  Flag,
  FileText,
  Video,
  FileCode,
  Award,
  Loader2,
  Check,
} from "lucide-react";

function LessonLearningPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [progress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [lessonRes, lessonsRes] = await Promise.all([
          getLessonById(lessonId),
          getLessonsByCourse(courseId),
        ]);
        setLesson(lessonRes.data.lesson);
        setLessons(lessonsRes.data.lessons || []);
      } catch (error) {
        console.error("Error fetching lesson:", error);
        setError("Không thể tải bài học. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, lessonId]);

  // Calculate progress
  const currentIndex = lessons.findIndex((item) => item._id === lessonId);
  const totalLessons = lessons.length;
  const progressPercentage =
    totalLessons > 0
      ? Math.round(((currentIndex + 1) / totalLessons) * 100)
      : 0;

  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < totalLessons - 1 ? lessons[currentIndex + 1] : null;

  // Format duration
  const formatDuration = (duration) => {
    if (!duration) return null;
    if (typeof duration === "number") {
      const mins = Math.floor(duration / 60);
      const secs = duration % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    return duration;
  };

  // Get lesson type icon
  const getLessonTypeIcon = (type) => {
    const icons = {
      video: Video,
      document: FileText,
      code: FileCode,
      quiz: Award,
    };
    return icons[type] || Play;
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Mark lesson as completed
  const markAsCompleted = async () => {
    setIsCompleted(!isCompleted);
    // API call to mark as completed
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Đang tải bài học...
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Vui lòng chờ trong giây lát
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😅</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Không tìm thấy bài học
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Bài học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition"
          >
            Quay lại khóa học
          </button>
        </div>
      </div>
    );
  }

  // Xử lý YouTube embed URL
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-700/60 shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

            <div className="hidden sm:flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate max-w-md">
                {lesson.title}
              </span>
            </div>

            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Progress */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {progressPercentage}%
              </span>
              <div className="w-32 lg:w-40 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <Link
              to={`/courses/${courseId}`}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Khóa học</span>
            </Link>
          </div>
        </div>

        {/* Mobile Progress */}
        <div className="md:hidden px-4 pb-2">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Tiến trình</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Video/Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Video Player */}
          <div className="w-full bg-black/5 dark:bg-black/20 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={lesson.title}
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto bg-blue-600/20 rounded-full flex items-center justify-center">
                        <FileText className="w-12 h-12 text-blue-400" />
                      </div>
                      <p className="mt-4 text-white/70 font-medium">
                        Bài học không có video
                      </p>
                      <p className="text-sm text-white/40 mt-1">
                        Nội dung sẽ được cập nhật sau
                      </p>
                    </div>
                  </div>
                )}

                {/* Video Controls Overlay */}
                {embedUrl && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                      <div className="flex-1 h-1 bg-white/30 rounded-full cursor-pointer">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
                      >
                        {isFullscreen ? (
                          <Minimize2 className="w-5 h-5" />
                        ) : (
                          <Maximize2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lesson Info */}
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 lg:py-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                      Bài {currentIndex + 1} / {totalLessons}
                    </span>
                    {lesson.type && (
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-semibold flex items-center gap-1">
                        {(() => {
                          const Icon = getLessonTypeIcon(lesson.type);
                          return <Icon className="w-3 h-3" />;
                        })()}
                        {lesson.type}
                      </span>
                    )}
                    {isCompleted && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Đã hoàn thành
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                    {lesson.title}
                  </h1>
                  {lesson.duration && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Thời lượng: {formatDuration(lesson.duration)}
                    </p>
                  )}
                </div>
                <button
                  onClick={markAsCompleted}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    isCompleted
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <Check className="w-4 h-4" />
                      Đã hoàn thành
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Đánh dấu hoàn thành
                    </>
                  )}
                </button>
              </div>

              {/* Description */}
              <div className="mt-6 prose prose-gray dark:prose-invert max-w-none">
                {lesson.description ? (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {lesson.description}
                  </p>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 italic">
                    Chưa có mô tả chi tiết cho bài học này.
                  </p>
                )}
              </div>

              {/* Navigation */}
              <div className="flex flex-wrap justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                {prevLesson ? (
                  <Link
                    to={`/learn/${courseId}/${prevLesson._id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Bài trước
                  </Link>
                ) : (
                  <div></div>
                )}

                {nextLesson ? (
                  <Link
                    to={`/learn/${courseId}/${nextLesson._id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 group"
                  >
                    Bài tiếp theo
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link
                    to={`/courses/${courseId}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:from-emerald-600 hover:to-green-600 transition-all duration-200"
                  >
                    <Award className="w-4 h-4" />
                    Hoàn thành khóa học
                  </Link>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                    isLiked
                      ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                  />
                  {isLiked ? "Đã thích" : "Thích"}
                </button>
                <button className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Chia sẻ
                </button>
                <button className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Báo cáo
                </button>
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Ghi chú
                </button>
              </div>

              {/* Notes Section */}
              {showNotes && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Ghi chú của bạn
                  </h4>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Viết ghi chú cho bài học này..."
                    className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2 gap-2">
                    <button className="px-4 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                      Hủy
                    </button>
                    <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                      Lưu ghi chú
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Lesson List */}
        <div
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } lg:block w-full lg:w-96 bg-white dark:bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden lg:sticky lg:top-16 lg:self-start max-h-[calc(100vh-4rem)]`}
        >
          <div className="p-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg text-gray-800 dark:text-white">
                  Nội dung khóa học
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {totalLessons} bài học
                </p>
              </div>
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {progressPercentage}%
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-3 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
            {lessons.map((item, index) => {
              const isActive = item._id === lessonId;
              const Icon = getLessonTypeIcon(item.type);
              const isCompleted = item.isCompleted || false;

              return (
                <Link
                  key={item._id}
                  to={`/learn/${courseId}/${item._id}`}
                  className={`block px-5 py-4 transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-50/80 dark:bg-blue-900/20 border-l-4 border-blue-600"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {isCompleted ? (
                        <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : isActive ? (
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                          <Play className="w-3.5 h-3.5 text-white" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-medium truncate ${
                            isActive
                              ? "text-blue-700 dark:text-blue-400"
                              : isCompleted
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {item.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                          <Icon className="w-3 h-3" />
                          {item.type || "video"}
                        </div>
                        {item.duration && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(item.duration)}
                          </span>
                        )}
                      </div>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    )}
                    {isCompleted && !isActive && (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between gap-2 z-50">
        {prevLesson ? (
          <Link
            to={`/learn/${courseId}/${prevLesson._id}`}
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Trước
          </Link>
        ) : (
          <div className="flex-1"></div>
        )}

        <button
          onClick={markAsCompleted}
          className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition ${
            isCompleted
              ? "bg-green-500 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isCompleted ? "✅ Hoàn thành" : "Hoàn thành"}
        </button>

        {nextLesson ? (
          <Link
            to={`/learn/${courseId}/${nextLesson._id}`}
            className="flex-1 px-4 py-2.5 bg-blue-600 rounded-xl text-white font-medium text-sm hover:bg-blue-700 transition flex items-center justify-center gap-1"
          >
            Sau
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            to={`/courses/${courseId}`}
            className="flex-1 px-4 py-2.5 bg-emerald-500 rounded-xl text-white font-medium text-sm hover:bg-emerald-600 transition flex items-center justify-center gap-1"
          >
            <Award className="w-4 h-4" />
            Xong
          </Link>
        )}
      </div>

      {/* Bottom padding for mobile */}
      <div className="h-16 lg:h-0"></div>
    </div>
  );
}

export default LessonLearningPage;
