import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Loader2, PenLine } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { getBlogs } from "../api/blogApi";
import { getMediaUrl } from "../utils/mediaUrl";

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getBlogs();
        setBlogs(response.data.blogs || []);
      } catch {
        setError("Không thể tải bài viết lúc này.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <MainLayout>
      <section className="py-8 sm:py-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              <PenLine className="h-4 w-4" /> Góc học tập
            </p>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Blog NHH Academy
            </h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              Kiến thức, kinh nghiệm và cảm hứng học tập dành cho bạn.
            </p>
          </div>
        </div>

        {loading && (
          <Loader2 className="mx-auto my-20 h-10 w-10 animate-spin text-blue-600" />
        )}
        {error && <p className="py-16 text-center text-red-500">{error}</p>}
        {!loading && !error && blogs.length === 0 && (
          <p className="py-16 text-center text-gray-500">
            Chưa có bài viết nào.
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog._id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {blog.thumbnail ? (
                <img
                  src={getMediaUrl(blog.thumbnail)}
                  alt={blog.title}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="h-48 bg-gradient-to-br from-blue-600 to-indigo-700" />
              )}
              <div className="p-6">
                <p className="mb-3 flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                </p>
                <h2 className="line-clamp-2 text-xl font-bold text-gray-900">
                  {blog.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                  {blog.excerpt || blog.content}
                </p>
                <Link
                  to={`/blog/${blog._id}`}
                  className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
                >
                  Đọc bài viết <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}

export default BlogPage;
