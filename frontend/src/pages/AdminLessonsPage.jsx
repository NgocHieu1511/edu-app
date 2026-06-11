import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLessonsByCourse, deleteLesson } from "../api/lessonApi";
import MainLayout from "../layouts/MainLayout";

function AdminLessonsPage() {
  const { courseId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa bài học này?");

    if (!confirmDelete) return;

    try {
      await deleteLesson(id);

      setLessons((prev) => prev.filter((lesson) => lesson._id !== id));

      alert("Xóa bài học thành công");
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await getLessonsByCourse(courseId);

        setLessons(res.data.lessons);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchLessons();
    }
  }, [courseId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-20">Đang tải danh sách bài học...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Quản lý bài học</h1>

        <Link
          to={`/admin/courses/${courseId}/lessons/add`}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Thêm bài học
        </Link>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 mt-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">Tên bài học</th>
                <th className="border p-3">Mô tả</th>
                <th className="border p-3">Video</th>
                <th className="border p-3">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson._id}>
                  <td className="border p-3">{lesson.title}</td>

                  <td className="border p-3">{lesson.description}</td>

                  <td className="border p-3">
                    <a
                      href={lesson.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Xem video
                    </a>
                  </td>

                  <td className="border p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(lesson._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {lessons.length === 0 && (
            <p className="text-center mt-6 text-gray-500">
              Chưa có bài học nào.
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default AdminLessonsPage;
