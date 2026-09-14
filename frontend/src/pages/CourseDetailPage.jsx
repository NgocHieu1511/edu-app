import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseById } from "../api/courseApi";
import { enrollCourse } from "../api/enrollmentApi";
import { getLessonsByCourse } from "../api/lessonApi";
import MainLayout from "../layouts/MainLayout";
import {
  Play,
  BookOpen,
  Users,
  Clock,
  Star,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Award,
  User,
  Tag,
  MessageCircle,
  Share2,
  Heart,
  FileText,
  Video,
  FileCode,
  Loader2,
  Lock,
} from "lucide-react";

function CourseDetailPage() {
  const { id } = useParams();
  const reviewBarData = [
    { stars: 5, percent: 65 },
    { stars: 4, percent: 20 },
    { stars: 3, percent: 10 },
    { stars: 2, percent: 3 },
    { stars: 1, percent: 2 },
  ];
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedLessons, setExpandedLessons] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await enrollCourse(course._id);
      alert("🎉 Đăng ký khóa học thành công!");
      // Refresh course data
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi đăng ký");
    } finally {
      setEnrolling(false);
    }
  };

  const toggleLesson = (lessonId) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [courseRes, lessonRes] = await Promise.all([
        getCourseById(id),
        getLessonsByCourse(id),
      ]);
      setCourse(courseRes.data.course);
      setLessons(lessonRes.data.lessons || []);
    } catch (error) {
      console.error("Error fetching course data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Format price
  const formatPrice = (price) => {
    if (!price || price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get lesson icon
  const getLessonIcon = (type) => {
    const icons = {
      video: Video,
      document: FileText,
      code: FileCode,
      quiz: Award,
    };
    return icons[type] || Play;
  };

  // Get rating stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? "text-yellow-400 fill-current"
                : i === fullStars && hasHalfStar
                  ? "text-yellow-400 fill-current opacity-50"
                  : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              Đang tải khóa học...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!course) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">😅</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Không tìm thấy khóa học
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Link
              to="/courses"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition"
            >
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="course-detail-page min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <div className="course-detail-hero relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-16">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Content */}
              <div className="lg:col-span-2 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {course.category || "Khóa học"}
                  </span>
                  {course.isPublished && (
                    <span className="px-3 py-1 bg-green-500/30 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Đã xuất bản
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  {course.title}
                </h1>

                <p className="text-lg text-white/90 mb-6 max-w-2xl">
                  {course.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-white/80">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span>{course.instructor?.name || "Giảng viên"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>{lessons.length} bài học</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{course.students || 0} học viên</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{course.duration || "20 giờ"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  {renderStars(course.rating)}
                  <span className="text-white/80 text-sm">
                    {course.rating || 0} ({course.reviews || 0} đánh giá)
                  </span>
                </div>
              </div>

              {/* Right Sidebar - Quick Info */}
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="text-center">
                    <p className="text-white/80 text-sm">Giá khóa học</p>
                    <h3 className="text-3xl font-bold text-white mt-1">
                      {course.price === 0
                        ? "Miễn phí"
                        : formatPrice(course.price)}
                    </h3>
                    {course.originalPrice &&
                      course.originalPrice > course.price && (
                        <p className="text-white/60 line-through text-sm mt-1">
                          {formatPrice(course.originalPrice)}
                        </p>
                      )}
                  </div>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full mt-4 bg-white text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {enrolling ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-current" />
                        Đăng ký ngay
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column - Course Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex gap-2 mb-8 bg-white dark:bg-gray-800 rounded-2xl p-1 border border-gray-200 dark:border-gray-700">
                {[
                  { id: "overview", label: "Tổng quan", icon: BookOpen },
                  { id: "curriculum", label: "Nội dung", icon: FileText },
                  { id: "reviews", label: "Đánh giá", icon: Star },
                  { id: "discussion", label: "Thảo luận", icon: MessageCircle },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                        activeTab === tab.id
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              {activeTab === "overview" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                    Giới thiệu khóa học
                  </h3>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {course.fullDescription || course.description}
                    </p>
                  </div>

                  {/* What you'll learn */}
                  {course.learningObjectives &&
                    course.learningObjectives.length > 0 && (
                      <div className="mt-8">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                          Bạn sẽ học được gì?
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {course.learningObjectives.map((objective, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {objective}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {activeTab === "curriculum" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        Nội dung khóa học
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {lessons.length} bài học
                      </p>
                    </div>
                    <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700">
                      Mở rộng tất cả
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {lessons.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        Chưa có bài học nào
                      </div>
                    ) : (
                      lessons.map((lesson, index) => {
                        const Icon = getLessonIcon(lesson.type);
                        const isExpanded = expandedLessons[lesson._id];
                        return (
                          <div key={lesson._id} className="group">
                            <div className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                              <Link
                                to={`/learn/${course._id}/${lesson._id}`}
                                className="flex items-center gap-4 flex-1 text-left"
                              >
                                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition">
                                  <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-white">
                                    {index + 1}. {lesson.title}
                                  </p>
                                  {lesson.duration && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {lesson.duration}
                                    </p>
                                  )}
                                </div>
                              </Link>
                              <div className="flex items-center gap-3">
                                {lesson.isFree ? (
                                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                    Miễn phí
                                  </span>
                                ) : (
                                  <Lock className="w-4 h-4 text-gray-400" />
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleLesson(lesson._id);
                                  }}
                                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {isExpanded && lesson.description && (
                              <div className="px-6 pb-4 pt-1 text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700/30">
                                {lesson.description}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-800 dark:text-white">
                        {course.rating || 0}
                      </div>
                      <div className="flex justify-center mt-1">
                        {renderStars(course.rating)}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {course.reviews || 0} đánh giá
                      </p>
                    </div>
                    <div className="flex-1">
                      {reviewBarData.map((item) => (
                        <div
                          key={item.stars}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="w-8 text-gray-600 dark:text-gray-400">
                            {item.stars}★
                          </span>
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full"
                              style={{ width: `${item.percent}%` }}
                            ></div>
                          </div>
                          <span className="w-12 text-gray-500 dark:text-gray-400 text-xs">
                            {item.percent}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Chưa có đánh giá nào</p>
                    <p className="text-sm">
                      Hãy là người đầu tiên đánh giá khóa học này
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "discussion" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      Diễn đàn thảo luận
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Tham gia thảo luận cùng cộng đồng học viên
                    </p>
                    <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                      Bắt đầu thảo luận
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div>
              <div className="sticky top-24 space-y-6">
                {/* Course Info Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative">
                    <img
                      src={
                        course.thumbnail?.startsWith("http")
                          ? course.thumbnail
                          : `https://placehold.co/600x350/4F46E5/FFFFFF?text=${course.title?.substring(0, 20) || "Course"}`
                      }
                      alt={course.title}
                      className="w-full h-52 object-cover"
                    />
                    {course.price === 0 && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                        Miễn phí
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Giá khóa học
                      </p>
                      <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                        {course.price === 0
                          ? "Miễn phí"
                          : formatPrice(course.price)}
                      </h3>
                      {course.originalPrice &&
                        course.originalPrice > course.price && (
                          <p className="text-gray-400 line-through text-sm mt-1">
                            {formatPrice(course.originalPrice)}
                          </p>
                        )}
                    </div>

                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-semibold transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {enrolling ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 fill-current" />
                          Đăng ký ngay
                        </>
                      )}
                    </button>

                    <div className="border-t dark:border-gray-700 mt-6 pt-6 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <BookOpen className="w-4 h-4" />
                          Bài học
                        </span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {lessons.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          Thời lượng
                        </span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {course.duration || "20 giờ"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Users className="w-4 h-4" />
                          Học viên
                        </span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {course.students || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Tag className="w-4 h-4" />
                          Danh mục
                        </span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {course.category || "Chưa phân loại"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <User className="w-4 h-4" />
                          Giảng viên
                        </span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {course.instructor?.name || "Chưa có"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="flex-1 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
                  >
                    <Heart
                      className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {isLiked ? "Đã thích" : "Thích"}
                    </span>
                  </button>
                  <button className="flex-1 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Chia sẻ
                    </span>
                  </button>
                </div>

                {/* Requirements */}
                {course.requirements && course.requirements.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Yêu cầu
                    </h4>
                    <ul className="space-y-2">
                      {course.requirements.map((req, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Instructor Info */}
                {course.instructor && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Giảng viên
                    </h4>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                        {course.instructor.name?.charAt(0).toUpperCase() || "G"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {course.instructor.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {course.instructor.title || "Giảng viên"}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span>{course.instructor.courses || 0} khóa học</span>
                          <span>
                            {course.instructor.students || 0} học viên
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default CourseDetailPage;
