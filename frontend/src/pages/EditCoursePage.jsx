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

        // 👉 SỬA TẠI ĐÂY: Sử dụng trực tiếp link ảnh từ database (vì đã là link Cloudinary)
        // Nếu là ảnh cũ lưu dạng "/uploads/...", ta dùng ảnh placeholder hoặc giữ nguyên tùy bạn
        if (course.thumbnail) {
          setPreview(
            course.thumbnail.startsWith("http")
              ? course.thumbnail
              : "https://placehold.co/600x400?text=NH7+Course",
          );
        }
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
      setPreview(URL.createObjectURL(file)); // Xem trước ảnh mới chọn từ máy tính local
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
        // 👉 SỬA TẠI ĐÂY: Đổi "thumbnail" thành "image" cho đồng bộ với Multer ở Backend
        data.append("thumbnail", thumbnail);
      }

      await updateCourse(id, data);

      alert("Cập nhật khóa học thành công");
      navigate("/admin/courses");
    } catch (error) {
      alert(error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật");
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
            className="w-full h-64 object-cover rounded-lg border mb-2"
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
          placeholder="Tên khóa học"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Mô tả"
        />

        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Danh mục"
        />

        <input
          name="instructor"
          value={formData.instructor}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Giảng viên"
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Giá"
        />

        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 font-medium text-white px-6 py-3 rounded transition"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
}

export default EditCoursePage;
