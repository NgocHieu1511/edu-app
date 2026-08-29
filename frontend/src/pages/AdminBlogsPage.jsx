import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { deleteBlog, getBlogs } from "../api/blogApi";

function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const response = await getBlogs();
      setBlogs(response.data.blogs || []);
    } catch {
      window.alert("Không thể tải danh sách bài viết.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchBlogs();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
      await deleteBlog(id);
      setBlogs((current) => current.filter((blog) => blog._id !== id));
    } catch (error) {
      window.alert(error.response?.data?.message || "Không thể xóa bài viết.");
    }
  };

  return (
    <MainLayout>
      <section className="py-8 sm:py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Quản trị nội dung
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Quản lý Blog
            </h1>
          </div>
          <Link
            to="/admin/blogs/add"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" /> Thêm bài viết
          </Link>
        </div>

        {loading ? (
          <p className="py-16 text-center text-gray-500">Đang tải...</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr>
                  <th className="px-5 py-4">Bài viết</th>
                  <th className="px-5 py-4">Tác giả</th>
                  <th className="px-5 py-4">Ngày đăng</th>
                  <th className="px-5 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="text-sm">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        {blog.title}
                      </p>
                      <p className="mt-1 max-w-md truncate text-gray-500">
                        {blog.excerpt || blog.content}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{blog.author}</td>
                    <td className="px-5 py-4 text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          title="Xem bài viết"
                          to={`/blog/${blog._id}`}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          title="Sửa bài viết"
                          to={`/admin/blogs/edit/${blog._id}`}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          title="Xóa bài viết"
                          onClick={() => handleDelete(blog._id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!blogs.length && (
              <p className="px-5 py-12 text-center text-gray-500">
                Chưa có bài viết nào.
              </p>
            )}
          </div>
        )}
      </section>
    </MainLayout>
  );
}

export default AdminBlogsPage;
