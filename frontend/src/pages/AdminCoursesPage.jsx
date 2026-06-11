import { useEffect, useState } from "react";
import { getCourses, deleteCourse } from "../api/courseApi";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa khóa học này?");

    if (!confirmDelete) return;

    try {
      await deleteCourse(id);

      setCourses((prev) => prev.filter((course) => course._id !== id));

      alert("Xóa khóa học thành công");
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getCourses();
        setCourses(res.data.courses);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-20">Đang tải danh sách khóa học...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Quản lý khóa học</h1>

        <Link
          to="/admin/courses/add"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Thêm khóa học
        </Link>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 mt-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">Tên khóa học</th>
                <th className="border p-3">Danh mục</th>
                <th className="border p-3">Giảng viên</th>
                <th className="border p-3">Giá</th>
                <th className="border p-3">Thao tác</th>
                <th className="border p-3">Bài học</th>
              </tr>
            </thead>

            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td className="border p-3">{course.title}</td>
                  <td className="border p-3">{course.category}</td>
                  <td className="border p-3">{course.instructor}</td>
                  <td className="border p-3">
                    {course.price?.toLocaleString()} VNĐ
                  </td>
                  <td className="border p-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/courses/edit/${course._id}`}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                      >
                        Sửa
                      </Link>

                      <button
                        onClick={() => handleDelete(course._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                  <td className="border p-3">
                    <Link
                      to={`/admin/courses/${course._id}/lessons`}
                      className="bg-blue-500 text-white px-3 py-2 rounded"
                    >
                      Quản lý
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {courses.length === 0 && (
            <p className="text-center mt-6 text-gray-500">
              Chưa có khóa học nào.
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default AdminCoursesPage;
