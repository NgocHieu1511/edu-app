import { useEffect, useState, useMemo } from "react";
import { getCourses } from "../api/courseApi";
import CourseCard from "./CourseCard";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
  Filter,
  Grid3x3,
  LayoutList,
} from "lucide-react";

function FeaturedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(6);

  // Fallback data khi API lỗi
  const getFallbackCourses = () => {
    return [
      {
        _id: "1",
        title: "ReactJS Từ Cơ Bản Đến Nâng Cao",
        description: "Xây dựng ứng dụng thực tế với ReactJS và Hooks",
        price: 499000,
        originalPrice: 999000,
        image: "https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=ReactJS",
        category: "Frontend",
        level: "Trung cấp",
        rating: 4.8,
        students: 1250,
        duration: "40 giờ",
        lessons: 120,
        isFree: false,
        isPopular: true,
        isNew: true,
        instructor: {
          name: "Nguyễn Văn A",
          avatar: "https://via.placeholder.com/40/4F46E5/FFFFFF?text=NA",
        },
      },
      {
        _id: "2",
        title: "Node.js & Express.js REST API",
        description: "Xây dựng REST API chuyên nghiệp với Node.js",
        price: 0,
        originalPrice: 0,
        image: "https://via.placeholder.com/400x250/059669/FFFFFF?text=NodeJS",
        category: "Backend",
        level: "Trung cấp",
        rating: 4.9,
        students: 980,
        duration: "35 giờ",
        lessons: 95,
        isFree: true,
        isPopular: true,
        isNew: false,
        instructor: {
          name: "Trần Thị B",
          avatar: "https://via.placeholder.com/40/059669/FFFFFF?text=TB",
        },
      },
      {
        _id: "3",
        title: "MongoDB Database Design",
        description: "Thiết kế và tối ưu database với MongoDB",
        price: 399000,
        originalPrice: 799000,
        image: "https://via.placeholder.com/400x250/7C3AED/FFFFFF?text=MongoDB",
        category: "Database",
        level: "Nâng cao",
        rating: 4.7,
        students: 760,
        duration: "25 giờ",
        lessons: 80,
        isFree: false,
        isPopular: false,
        isNew: true,
        instructor: {
          name: "Lê Văn C",
          avatar: "https://via.placeholder.com/40/7C3AED/FFFFFF?text=LC",
        },
      },
    ];
  };

  // Filters
  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "popular", label: "Phổ biến" },
    { id: "new", label: "Mới nhất" },
    { id: "free", label: "Miễn phí" },
    { id: "paid", label: "Trả phí" },
  ];

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getCourses();

        // Xử lý response từ API
        let coursesData = [];
        if (res.data && res.data.courses) {
          coursesData = res.data.courses;
        } else if (Array.isArray(res.data)) {
          coursesData = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          coursesData = res.data.data;
        }

        setCourses(coursesData);
      } catch (error) {
        console.error("Lỗi lấy khóa học:", error);
        setError("Không thể tải danh sách khóa học. Vui lòng thử lại sau.");
        // Fallback data
        setCourses(getFallbackCourses());
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    let filtered = [...courses];

    switch (activeFilter) {
      case "popular":
        filtered = filtered.filter((c) => c.isPopular);
        break;
      case "new":
        filtered = filtered.filter((c) => c.isNew);
        break;
      case "free":
        filtered = filtered.filter((c) => c.isFree);
        break;
      case "paid":
        filtered = filtered.filter((c) => !c.isFree);
        break;
      default:
        break;
    }

    return filtered;
  }, [activeFilter, courses]);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse,
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  if (loading) {
    return (
      <section className="featured-courses py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Đang tải khóa học...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-courses py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">😅</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Không thể tải khóa học
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Thử lại
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-courses py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-7 h-7 text-blue-600" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white">
                Khóa học nổi bật
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Khám phá những khóa học chất lượng cao được yêu thích nhất
            </p>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <div className="flex bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <Filter className="w-5 h-5 text-gray-400 mr-2" />
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterChange(filter.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {filter.label}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {filteredCourses.length} khóa học
          </span>
        </div>

        {/* Courses Grid/List */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Chưa có khóa học nào
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Không tìm thấy khóa học phù hợp với bộ lọc này
            </p>
          </div>
        ) : (
          <div
            data-course-grid
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {currentCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-lg font-medium transition ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-10">
          <button className="group px-8 py-3.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-white font-semibold rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 flex items-center gap-2 mx-auto">
            Xem tất cả khóa học
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCourses;
