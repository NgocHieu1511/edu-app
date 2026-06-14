import { Link } from "react-router-dom";

function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course._id}`}
      className="block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
    >
      <img
        src={
          course.thumbnail?.startsWith("http")
            ? course.thumbnail
            : "https://placehold.co/600x400?text=NH7+Course"
        }
        alt={course.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-5">
        <h3 className="font-bold text-xl mb-2">{course.title}</h3>

        <p className="text-gray-600 mb-4">{course.description}</p>

        <div className="font-bold text-blue-600">
          {course.price?.toLocaleString()} VNĐ
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;
