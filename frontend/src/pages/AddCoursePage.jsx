import { useState } from "react";
import { createCourse } from "../api/courseApi";
import { useNavigate } from "react-router-dom";

function AddCoursePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    instructor: "",
    price: "",
  });

  const [thumbnail, setThumbnail] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
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
        // 👉 SỬA TẠI ĐÂY: Đổi tên key từ "thumbnail" thành "image" để khớp với Multer backend
        data.append("thumbnail", thumbnail);
      }

      await createCourse(data);

      alert("Thêm khóa học thành công");
      navigate("/admin/courses");
    } catch (error) {
      alert(error.response?.data?.message || "Đã xảy ra lỗi khi thêm khóa học");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Thêm khóa học</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Tên khóa học"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required // Nên thêm required để tránh gửi form rỗng
        />

        <textarea
          name="description"
          placeholder="Mô tả"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Danh mục"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="instructor"
          placeholder="Giảng viên"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Giá"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <input
          type="file"
          accept="image/*"
          className="w-full border p-3 rounded"
          onChange={handleFileChange}
        />

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium transition"
          type="submit"
        >
          Thêm khóa học
        </button>
      </form>
    </div>
  );
}

export default AddCoursePage;
