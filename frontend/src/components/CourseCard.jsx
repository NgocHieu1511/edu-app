import { Link } from "react-router-dom";
import {
  Star,
  Users,
  Clock,
  BookOpen,
  Award,
  PlayCircle,
  ChevronRight,
  Zap,
  Heart,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";

function CourseCard({ course, viewMode = "grid" }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Format price
  const formatPrice = (price) => {
    if (!price) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get level color
  const getLevelColor = (level) => {
    const levels = {
      "Cơ bản":
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      "Trung cấp":
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      "Nâng cao":
        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      "Chuyên gia":
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return (
      levels[level] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    );
  };

  // Get rating color
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-emerald-500";
    if (rating >= 4.0) return "text-blue-500";
    if (rating >= 3.5) return "text-yellow-500";
    return "text-gray-500";
  };

  // Truncate text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // List View
  if (viewMode === "list") {
    return (
      <Link
        to={`/courses/${course._id}`}
        className="course-card shadcn-course-card group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700"
      >
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative md:w-72 lg:w-80 flex-shrink-0 overflow-hidden">
            <img
              src={
                course.thumbnail?.startsWith("http")
                  ? course.thumbnail
                  : `https://placehold.co/600x400/4F46E5/FFFFFF?text=${course.title?.substring(0, 20) || "Course"}`
              }
              alt={course.title}
              className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {course.isFree && (
              <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                Miễn phí
              </div>
            )}
            {course.isPopular && (
              <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Hot
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {course.title}
              </h3>
              <Badge className={`shadcn-level-badge ${getLevelColor(course.level)}`}>
                {course.level || "Trung cấp"}
              </Badge>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{course.students || 0} học viên</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{course.duration || "20 giờ"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{course.lessons || 0} bài học</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className={getRatingColor(course.rating)}>
                  {course.rating || 4.5}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              <div>
                {course.originalPrice && course.originalPrice > course.price && (
                  <span className="text-sm text-gray-400 line-through mr-2">
                    {formatPrice(course.originalPrice)}
                  </span>
                )}
                <span
                  className={`text-xl font-bold ${course.isFree ? "text-emerald-500" : "text-blue-600 dark:text-blue-400"}`}
                >
                  {course.isFree ? "Miễn phí" : formatPrice(course.price)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold group-hover:bg-blue-700 transition-colors flex items-center gap-1">
                  Xem chi tiết
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View
  return (
    <Link
      to={`/courses/${course._id}`}
      className="course-card shadcn-course-card group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={
            course.thumbnail?.startsWith("http")
              ? course.thumbnail
              : `https://placehold.co/600x400/4F46E5/FFFFFF?text=${course.title?.substring(0, 20) || "Course"}`
          }
          alt={course.title}
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {course.isFree && (
            <Badge className="shadcn-image-badge shadcn-free-badge">
              <Award className="w-3 h-3" />
              Miễn phí
            </Badge>
          )}
          {course.isPopular && (
            <Badge className="shadcn-image-badge shadcn-hot-badge">
              <Zap className="w-3 h-3" />
              Phổ biến
            </Badge>
          )}
          {course.isNew && (
            <Badge className="shadcn-image-badge shadcn-new-badge">
              <Zap className="w-3 h-3" />
              Mới
            </Badge>
          )}
        </div>

        {/* Quick view button on hover */}
        <button
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/90 backdrop-blur-sm text-gray-800 rounded-xl font-semibold text-sm shadow-lg hover:bg-white transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          onClick={(e) => {
            e.preventDefault();
            // Handle quick view
          }}
        >
          <Eye className="w-4 h-4 inline mr-2" />
          Xem nhanh
        </button>

        {/* Action buttons */}
        <button
          className={`absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 ${
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
        >
          <Heart
            className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category and Level */}
        <div className="flex items-center justify-between mb-3">
          <Badge className="shadcn-category-badge">
            {course.category || "Khóa học"}
          </Badge>
          <Badge className={`shadcn-level-badge ${getLevelColor(course.level)}`}>
            {course.level || "Trung cấp"}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {truncateText(course.description, 80)}
        </p>

        {/* Instructor */}
        {course.instructor && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
              {course.instructor.name?.charAt(0).toUpperCase() || "T"}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {course.instructor.name || "Giảng viên"}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{course.students || 0}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{course.duration || "20h"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className={getRatingColor(course.rating)}>
              {course.rating || 4.5}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>{course.lessons || 0}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-4"></div>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div>
            {course.originalPrice && course.originalPrice > course.price && (
              <span className="text-xs text-gray-400 line-through mr-2">
                {formatPrice(course.originalPrice)}
              </span>
            )}
            <span
              className={`text-xl font-bold ${course.isFree ? "text-emerald-500" : "text-blue-600 dark:text-blue-400"}`}
            >
              {course.isFree ? "Miễn phí" : formatPrice(course.price)}
            </span>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30">
            <PlayCircle className="w-4 h-4" />
            Đăng ký
          </button>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;
