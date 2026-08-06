import { useEffect, useMemo, useState } from "react";
import { getCourses, deleteCourse } from "../api/courseApi";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
  Grid3x3,
  LayoutList,
  AlertCircle,
  CheckCircle,
  User,
  FolderOpen,
} from "lucide-react";

function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const categories = useMemo(
    () => ["all", ...new Set(courses.map((c) => c.category).filter(Boolean))],
    [courses],
  );

  const filteredCourses = useMemo(() => {
    let filtered = [...courses];

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (course) => course.category === selectedCategory,
      );
    }

    if (selectedStatus === "published") {
      filtered = filtered.filter((course) => course.isPublished);
    } else if (selectedStatus === "draft") {
      filtered = filtered.filter((course) => !course.isPublished);
    }

    return filtered;
  }, [courses, searchTerm, selectedCategory, selectedStatus]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await getCourses();
      let coursesData = [];
      if (res.data && res.data.courses) {
        coursesData = res.data.courses;
      } else if (Array.isArray(res.data)) {
        coursesData = res.data;
      }
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    setCourseToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCourse(courseToDelete);
      setCourses((prev) =>
        prev.filter((course) => course._id !== courseToDelete),
      );
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi xóa khóa học");
    }
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map((c) => c._id));
    }
  };

  const handleSelectCourse = (id) => {
    if (selectedCourses.includes(id)) {
      setSelectedCourses(selectedCourses.filter((c) => c !== id));
    } else {
      setSelectedCourses([...selectedCourses, id]);
    }
  };

  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse,
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const formatPrice = (price) => {
    if (!price) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (course) => {
    if (course.isPublished) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold">
          <CheckCircle className="w-3 h-3" />
          Đã xuất bản
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-semibold">
        <AlertCircle className="w-3 h-3" />
        Bản nháp
      </span>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              Đang tải danh sách khóa học...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
                Quản lý khóa học
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Quản lý tất cả khóa học trong hệ thống
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchCourses}
                className="p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Link
                to="/admin/courses/add"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Thêm khóa học
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="all">Tất cả danh mục</option>
                {categories
                  .filter((c) => c !== "all")
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-600 shadow-sm"
                      : "hover:bg-white/50 dark:hover:bg-gray-600/50"
                  }`}
                >
                  <Grid3x3 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-600 shadow-sm"
                      : "hover:bg-white/50 dark:hover:bg-gray-600/50"
                  }`}
                >
                  <LayoutList className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            {/* Selected count */}
            {selectedCourses.length > 0 && (
              <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  Đã chọn {selectedCourses.length} khóa học
                </span>
                <button
                  onClick={() => setSelectedCourses([])}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tổng số
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {courses.length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Đã xuất bản
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {courses.filter((c) => c.isPublished).length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bản nháp
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {courses.filter((c) => !c.isPublished).length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Đang hiển thị
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {filteredCourses.length}
              </p>
            </div>
          </div>

          {/* Course Grid/List */}
          {currentCourses.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Không tìm thấy khóa học
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || selectedCategory !== "all"
                  ? "Không có khóa học phù hợp với bộ lọc"
                  : "Chưa có khóa học nào trong hệ thống"}
              </p>
              {(searchTerm || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedStatus("all");
                  }}
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        course.thumbnail?.startsWith("http")
                          ? course.thumbnail
                          : `https://placehold.co/600x400/4F46E5/FFFFFF?text=${course.title?.substring(0, 20) || "Course"}`
                      }
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      {getStatusBadge(course)}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-1">
                        {course.title}
                      </h3>
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course._id)}
                        onChange={() => handleSelectCourse(course._id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {course.instructor?.name || "Chưa có"}
                      </span>
                      <span className="flex items-center gap-1">
                        <FolderOpen className="w-3 h-3" />
                        {course.category || "Chưa phân loại"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(course.price)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/admin/courses/edit/${course._id}`}
                          className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Link>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                        <Link
                          to={`/admin/courses/${course._id}/lessons`}
                          className="p-1.5 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                        >
                          <BookOpen className="w-4 h-4 text-green-600" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedCourses.length === filteredCourses.length &&
                            filteredCourses.length > 0
                          }
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Khóa học
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                        Danh mục
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                        Giảng viên
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Giá
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {currentCourses.map((course) => (
                      <tr
                        key={course._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedCourses.includes(course._id)}
                            onChange={() => handleSelectCourse(course._id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                course.thumbnail?.startsWith("http")
                                  ? course.thumbnail
                                  : `https://placehold.co/50x50/4F46E5/FFFFFF?text=C`
                              }
                              alt={course.title}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-800 dark:text-white line-clamp-1">
                                {course.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                {course.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                            {course.category || "Chưa phân loại"}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-600 dark:text-gray-300">
                          {course.instructor?.name || "Chưa có"}
                        </td>
                        <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">
                          {formatPrice(course.price)}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {getStatusBadge(course)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Link
                              to={`/admin/courses/edit/${course._id}`}
                              className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                              title="Sửa"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </Link>
                            <button
                              onClick={() => handleDelete(course._id)}
                              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                            <Link
                              to={`/admin/courses/${course._id}/lessons`}
                              className="p-1.5 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                              title="Quản lý bài học"
                            >
                              <BookOpen className="w-4 h-4 text-green-600" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị {indexOfFirstCourse + 1} -{" "}
                {Math.min(indexOfLastCourse, filteredCourses.length)} /{" "}
                {filteredCourses.length} khóa học
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-9 h-9 rounded-lg font-medium transition ${
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
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Xác nhận xóa
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Bạn có chắc chắn muốn xóa khóa học này? Hành động này không thể
                hoàn tác.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition shadow-lg shadow-red-600/20"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default AdminCoursesPage;
