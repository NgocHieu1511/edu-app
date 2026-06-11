import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseById, updateCourse } from "../api/courseApi";

function EditCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    instructor: "",
    price: "",
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseById(id);
        const course = res.data.course;

        setFormData({
          title: course.title,
          description: course.description,
          category: course.category,
          instructor: course.instructor,
          price: course.price,
        });

        setPreview(
          course.thumbnail ? `http://localhost:5000${course.thumbnail}` : "",
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("instructor", formData.instructor);
      data.append("price", formData.price);

      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }

      await updateCourse(id, data);

      alert("Cập nhật khóa học thành công");

      navigate("/admin/courses");
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sửa khóa học</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {preview && (
          <img
            src={preview}
            alt="thumbnail"
            className="w-full h-64 object-cover rounded-lg"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="instructor"
          value={formData.instructor}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="bg-yellow-500 text-white px-6 py-3 rounded"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
}

export default EditCoursePage;
