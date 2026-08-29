import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { getBlogById } from "../api/blogApi";
import { getMediaUrl } from "../utils/mediaUrl";

function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBlogById(id)
      .then((response) => setBlog(response.data.blog))
      .catch(() => setError("Không tìm thấy bài viết."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <MainLayout>
        <Loader2 className="mx-auto my-20 h-10 w-10 animate-spin text-blue-600" />
      </MainLayout>
    );
  if (error || !blog)
    return (
      <MainLayout>
        <p className="py-20 text-center text-red-500">
          {error || "Không tìm thấy bài viết."}
        </p>
      </MainLayout>
    );

  return (
    <MainLayout>
      <article className="mx-auto max-w-4xl py-8 sm:py-12">
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 font-medium text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" /> Tất cả bài viết
        </Link>
        {blog.thumbnail && (
          <img
            src={getMediaUrl(blog.thumbnail)}
            alt={blog.title}
            className="mb-8 max-h-[28rem] w-full rounded-2xl object-cover"
          />
        )}
        <p className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="h-4 w-4" />
          {new Date(blog.createdAt).toLocaleDateString("vi-VN")} · {blog.author}
        </p>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-5xl">
          {blog.title}
        </h1>
        {blog.excerpt && (
          <p className="mt-5 text-lg leading-8 text-gray-600">{blog.excerpt}</p>
        )}
        <div className="mt-8 whitespace-pre-line text-base leading-8 text-gray-700">
          {blog.content}
        </div>
      </article>
    </MainLayout>
  );
}

export default BlogDetailPage;
