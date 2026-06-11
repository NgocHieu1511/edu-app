import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createLesson } from "../api/lessonApi";

function AddLessonPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    pdfUrl: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createLesson({
        ...formData,
        courseId,
      });

      alert("Thêm bài học thành công");

      navigate(`/admin/courses/${courseId}/lessons`);
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Thêm bài học</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Tên bài học"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <textarea
          name="description"
          placeholder="Mô tả"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="videoUrl"
          placeholder="Link video Youtube"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          name="pdfUrl"
          placeholder="Link PDF"
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <button
          className="bg-blue-600 text-white px-6 py-3 rounded"
          type="submit"
        >
          Thêm bài học
        </button>
      </form>
    </div>
  );
}

export default AddLessonPage;
