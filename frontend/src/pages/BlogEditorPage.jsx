import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { createBlog, getBlogById, updateBlog } from "../api/blogApi";

function BlogEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const defaultAuthor = currentUser?.name || "NHH Academy";
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: defaultAuthor,
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return undefined;
    getBlogById(id)
      .then(({ data }) => {
        const blog = data.blog;
        setForm({
          title: blog.title || "",
          excerpt: blog.excerpt || "",
          content: blog.content || "",
          author: blog.author || defaultAuthor,
        });
        setPreview(blog.thumbnail || "");
      })
      .catch(() => window.alert("Không thể tải bài viết."))
      .finally(() => setLoading(false));
    return undefined;
  }, [id, isEditing]);

  const handleChange = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (thumbnail) data.append("thumbnail", thumbnail);
    try {
      if (isEditing) await updateBlog(id, data);
      else await createBlog(data);
      navigate("/admin/blogs");
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      window.alert(`Không thể lưu bài viết: ${message}`);
    }
  };

  if (loading)
    return (
      <MainLayout>
        <p className="py-20 text-center text-gray-500">Đang tải...</p>
      </MainLayout>
    );

  return (
    <MainLayout>
      <section className="mx-auto max-w-3xl py-8 sm:py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          {isEditing ? "Sửa bài viết" : "Thêm bài viết"}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
        >
          {preview && (
            <img
              src={preview}
              alt="Xem trước ảnh bài viết"
              className="h-56 w-full rounded-xl object-cover"
            />
          )}
          <label className="block text-sm font-semibold text-gray-700">
            Ảnh đại diện
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 block w-full rounded-lg border border-gray-200 p-3 text-sm"
            />
          </label>
          <label className="block text-sm font-semibold text-gray-700">
            Tiêu đề
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-gray-200 p-3 font-normal outline-none focus:border-blue-500"
            />
          </label>
          <label className="block text-sm font-semibold text-gray-700">
            Mô tả ngắn
            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              rows="3"
              className="mt-2 w-full rounded-lg border border-gray-200 p-3 font-normal outline-none focus:border-blue-500"
            />
          </label>
          <label className="block text-sm font-semibold text-gray-700">
            Nội dung
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows="12"
              className="mt-2 w-full rounded-lg border border-gray-200 p-3 font-normal outline-none focus:border-blue-500"
            />
          </label>
          <label className="block text-sm font-semibold text-gray-700">
            Tác giả
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-gray-200 p-3 font-normal outline-none focus:border-blue-500"
            />
          </label>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/blogs")}
              className="rounded-lg border border-gray-200 px-5 py-3 font-medium text-gray-600"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              {isEditing ? "Cập nhật" : "Đăng bài"}
            </button>
          </div>
        </form>
      </section>
    </MainLayout>
  );
}

export default BlogEditorPage;
