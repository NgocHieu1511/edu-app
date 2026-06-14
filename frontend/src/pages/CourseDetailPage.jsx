import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseById } from "../api/courseApi";
import { enrollCourse } from "../api/enrollmentApi";
import { getLessonsByCourse } from "../api/lessonApi";
import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";

function CourseDetailPage() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  const handleEnroll = async () => {
    try {
      await enrollCourse(course._id);
      alert("Đăng ký khóa học thành công");
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await getCourseById(id);
        setCourse(courseRes.data.course);

        const lessonRes = await getLessonsByCourse(id);
        setLessons(lessonRes.data.lessons);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  if (!course) {
    return (
      <MainLayout>
        <div className="text-center py-20">Đang tải...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <span className="text-sm text-orange-500 font-semibold">
                {course.category}
              </span>

              <h1 className="text-5xl font-bold mt-3 mb-5">{course.title}</h1>

              <p className="text-gray-600 text-lg leading-8">
                {course.description}
              </p>

              <div className="flex items-center gap-6 mt-6">
                <span className="font-semibold">👨‍🏫 {course.instructor}</span>

                <span className="text-gray-500">
                  📚 {lessons.length} bài học
                </span>
              </div>
            </div>

            {/* Nội dung khóa học */}
            <div className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Nội dung khóa học</h2>

                <span className="text-orange-500 font-semibold cursor-pointer">
                  Mở rộng tất cả
                </span>
              </div>

              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gray-100 p-5 flex justify-between">
                  <h3 className="font-bold text-xl">Danh sách bài học</h3>

                  <span>{lessons.length} bài học</span>
                </div>

                {lessons.map((lesson, index) => (
                  <div
                    key={lesson._id}
                    className="border-t px-5 py-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">
                          {index + 1}. {lesson.title}
                        </h4>

                        {lesson.description && (
                          <p className="text-gray-500 text-sm mt-1">
                            {lesson.description}
                          </p>
                        )}
                      </div>

                      <Link
                        to={`/learn/${id}/${lesson._id}`}
                        className="text-blue-600"
                      >
                        Học ngay
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div>
            <div className="bg-white rounded-3xl shadow-lg border p-5 sticky top-24">
              <img
                // 👉 SỬA TẠI ĐÂY: Nhận trực tiếp link ảnh online hoặc ảnh placeholder dự phòng
                src={course.thumbnail || "https://placehold.co/600x350"}
                alt={course.title}
                className="w-full h-52 object-cover rounded-2xl"
              />

              <div className="text-center mt-6">
                <p className="text-gray-500">Chi phí khóa học</p>

                <h2 className="text-4xl font-bold text-orange-500 mt-2">
                  {course.price === 0
                    ? "Miễn phí"
                    : `${course.price?.toLocaleString()} VNĐ`}
                </h2>
              </div>

              <button
                onClick={handleEnroll}
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-full text-lg font-semibold"
              >
                ĐĂNG KÝ HỌC
              </button>

              <div className="border-t mt-6 pt-6 space-y-4 text-gray-700">
                <div className="flex justify-between">
                  <span>📚 Tổng số bài học</span>
                  <span>{lessons.length}</span>
                </div>

                <div className="flex justify-between">
                  <span>🏷 Danh mục</span>
                  <span>{course.category}</span>
                </div>

                <div className="flex justify-between">
                  <span>👨‍🏫 Giảng viên</span>
                  <span>{course.instructor}</span>
                </div>

                <div className="flex justify-between">
                  <span>📱 Học mọi lúc</span>
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default CourseDetailPage;
