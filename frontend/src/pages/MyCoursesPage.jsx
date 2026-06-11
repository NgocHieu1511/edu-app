import { useEffect, useState } from "react";

import { getMyCourses } from "../api/enrollmentApi";

function MyCoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await getMyCourses();

      setCourses(res.data.enrollments);
    };

    fetchCourses();
  }, []);
  console.log(courses);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Khóa học của tôi</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((item) => (
          <div key={item._id} className="bg-white shadow rounded-xl p-5">
            <h3 className="font-bold">{item.courseId?.title}</h3>

            <p>{item.courseId?.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyCoursesPage;
