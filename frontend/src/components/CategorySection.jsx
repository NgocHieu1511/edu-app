import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Server,
  Smartphone,
  Bot,
  Cloud,
  Database,
  ArrowRight,
  TrendingUp,
  Users,
  BookOpen,
  Star,
  Sparkles,
  LayoutGrid,
  Monitor,
} from "lucide-react";

function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setHoveredCategory] = useState(null);

  // Category data with icons and stats
  const categoryData = useMemo(() => [
    {
      id: "frontend",
      name: "Frontend",
      icon: Monitor,
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient:
        "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
      description: "React, Vue, Angular, HTML, CSS",
      courses: 45,
      students: 3200,
      rating: 4.8,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "backend",
      name: "Backend",
      icon: Server,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient:
        "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
      description: "Node.js, Python, Java, PHP",
      courses: 38,
      students: 2800,
      rating: 4.7,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "mobile",
      name: "Mobile",
      icon: Smartphone,
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
      bgGradient:
        "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
      description: "React Native, Flutter, Swift, Kotlin",
      courses: 28,
      students: 1900,
      rating: 4.6,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "ai",
      name: "AI & Machine Learning",
      icon: Bot,
      color: "rose",
      gradient: "from-rose-500 to-orange-500",
      bgGradient:
        "from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30",
      description: "Deep Learning, NLP, Computer Vision",
      courses: 22,
      students: 1500,
      rating: 4.9,
      iconBg: "bg-rose-100 dark:bg-rose-900/30",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
    {
      id: "devops",
      name: "DevOps",
      icon: Cloud,
      color: "indigo",
      gradient: "from-indigo-500 to-blue-500",
      bgGradient:
        "from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30",
      description: "Docker, Kubernetes, AWS, CI/CD",
      courses: 30,
      students: 2100,
      rating: 4.7,
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      id: "database",
      name: "Database",
      icon: Database,
      color: "amber",
      gradient: "from-amber-500 to-yellow-500",
      bgGradient:
        "from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30",
      description: "MongoDB, PostgreSQL, MySQL, Redis",
      courses: 25,
      students: 1700,
      rating: 4.5,
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ], []);

  useEffect(() => {
    // Simulate API call
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Trong thực tế: const res = await getCategories();
        // setCategories(res.data);

        // Dùng dữ liệu mẫu
        setTimeout(() => {
          setCategories(categoryData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories(categoryData);
        setLoading(false);
      }
    };

    fetchCategories();
  }, [categoryData]);

  // Get color classes
  const getColorClasses = (color) => {
    const colors = {
      blue: {
        border: "hover:border-blue-200 dark:hover:border-blue-700",
        shadow: "shadow-blue-100 dark:shadow-blue-900/20",
        text: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-950/20",
        ring: "ring-blue-500/20",
      },
      emerald: {
        border: "hover:border-emerald-200 dark:hover:border-emerald-700",
        shadow: "shadow-emerald-100 dark:shadow-emerald-900/20",
        text: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-950/20",
        ring: "ring-emerald-500/20",
      },
      purple: {
        border: "hover:border-purple-200 dark:hover:border-purple-700",
        shadow: "shadow-purple-100 dark:shadow-purple-900/20",
        text: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-50 dark:bg-purple-950/20",
        ring: "ring-purple-500/20",
      },
      rose: {
        border: "hover:border-rose-200 dark:hover:border-rose-700",
        shadow: "shadow-rose-100 dark:shadow-rose-900/20",
        text: "text-rose-600 dark:text-rose-400",
        bg: "bg-rose-50 dark:bg-rose-950/20",
        ring: "ring-rose-500/20",
      },
      indigo: {
        border: "hover:border-indigo-200 dark:hover:border-indigo-700",
        shadow: "shadow-indigo-100 dark:shadow-indigo-900/20",
        text: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-50 dark:bg-indigo-950/20",
        ring: "ring-indigo-500/20",
      },
      amber: {
        border: "hover:border-amber-200 dark:hover:border-amber-700",
        shadow: "shadow-amber-100 dark:shadow-amber-900/20",
        text: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-950/20",
        ring: "ring-amber-500/20",
      },
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mt-2"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
                <div className="mt-4">
                  <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg mt-2"></div>
                </div>
                <div className="mt-4 flex gap-4">
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <LayoutGrid className="w-7 h-7 text-blue-600" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white">
                Danh mục nổi bật
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Khám phá các lĩnh vực lập trình phổ biến nhất hiện nay
            </p>
          </div>

          <Link
            to="/categories"
            className="group mt-4 md:mt-0 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const colors = getColorClasses(category.color);

            return (
              <Link
                key={category.id}
                to={`/courses?category=${category.id}`}
                className="group relative"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div
                  className={`
                  relative bg-white dark:bg-gray-800 rounded-2xl p-6 
                  border border-gray-100 dark:border-gray-700 
                  ${colors.border}
                  shadow-sm hover:shadow-xl 
                  transition-all duration-300 
                  hover:-translate-y-1
                  overflow-hidden
                `}
                >
                  {/* Background Gradient */}
                  <div
                    className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 
                    transition-opacity duration-500
                    bg-gradient-to-br ${category.bgGradient}
                  `}
                  ></div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon and Badge */}
                    <div className="flex items-start justify-between">
                      <div
                        className={`
                        p-3 rounded-xl ${category.iconBg} 
                        group-hover:scale-110 transition-transform duration-300
                      `}
                      >
                        <Icon className={`w-8 h-8 ${category.iconColor}`} />
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                        {category.rating}
                      </div>
                    </div>

                    {/* Title and Description */}
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                        {category.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>{category.courses} khóa học</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{category.students} học viên</span>
                      </div>
                    </div>

                    {/* Hover Effect Arrow */}
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <div
                        className={`
                        p-2 rounded-full bg-gradient-to-r ${category.gradient}
                        shadow-lg shadow-${category.color}-500/20
                      `}
                      >
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8">
                    <div
                      className={`
                      w-full h-full rounded-full 
                      bg-gradient-to-br ${category.gradient}
                      opacity-0 group-hover:opacity-10 
                      transition-opacity duration-500
                    `}
                    ></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 bg-white dark:bg-gray-800 rounded-2xl px-8 py-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-600 dark:text-gray-300">
                Đã có{" "}
                <strong className="text-gray-800 dark:text-white">150+</strong>{" "}
                khóa học
              </span>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-gray-600 dark:text-gray-300">
                <strong className="text-gray-800 dark:text-white">
                  10,000+
                </strong>{" "}
                học viên
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
