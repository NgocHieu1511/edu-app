import { useEffect, useState } from "react";
import { getCourses } from "../api/courseApi";
import CourseCard from "./CourseCard";

function FeaturedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await getCourses();

        // Nếu API trả về:
        // { success: true, courses: [...] }
        setCourses(res.data.courses || []);
      } catch (error) {
        console.error("Lỗi lấy khóa học:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-center">
        <h2 className="text-xl font-semibold">Đang tải khóa học...</h2>
      </div>
    );
  }

  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold mb-8">Khóa học nổi bật</h2>

      {courses.length === 0 ? (
        <p>Chưa có khóa học nào.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedCourses;
