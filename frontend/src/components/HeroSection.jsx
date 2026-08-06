import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  BookOpen,
  Star,
  Users,
  Award,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { getHeroData } from "../api/heroApi"; // Tạo API function

function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [stats, setStats] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback data mặc định
  const getFallbackSlides = () => [
    {
      title: "Học lập trình từ cơ bản đến nâng cao",
      description:
        "ReactJS, NodeJS, MongoDB, JavaScript và nhiều khóa học khác.",
      image: "🚀",
      bgGradient: "from-blue-600 via-indigo-600 to-purple-600",
      stat: "5000+ Học viên",
      buttonText: "Bắt đầu ngay",
      buttonLink: "/courses",
      order: 0,
    },
    {
      title: "Xây dựng ứng dụng thực tế với ReactJS",
      description:
        "Từ Frontend đến Fullstack, trở thành lập trình viên chuyên nghiệp.",
      image: "💻",
      bgGradient: "from-emerald-500 via-teal-500 to-cyan-500",
      stat: "200+ Dự án mẫu",
      buttonText: "Khám phá ngay",
      buttonLink: "/courses",
      order: 1,
    },
    {
      title: "Khóa học JavaScript chuyên sâu",
      description: "Nắm vững ES6+, async/await, và các concept nâng cao.",
      image: "⚡",
      bgGradient: "from-orange-500 via-red-500 to-pink-500",
      stat: "100+ Bài học",
      buttonText: "Học ngay",
      buttonLink: "/courses",
      order: 2,
    },
    {
      title: "Fullstack Developer với MERN Stack",
      description:
        "MongoDB, Express.js, ReactJS, NodeJS - Trở thành Fullstack Developer.",
      image: "🌟",
      bgGradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      stat: "50+ Giờ học",
      buttonText: "Bắt đầu ngay",
      buttonLink: "/courses",
      order: 3,
    },
  ];

  const getFallbackStats = () => [
    { icon: "Users", value: "5,000+", label: "Học viên" },
    { icon: "BookOpen", value: "50+", label: "Khóa học" },
    { icon: "Award", value: "98%", label: "Hài lòng" },
    { icon: "Star", value: "4.8/5", label: "Đánh giá" },
  ];

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getHeroData();

        const slidesData = response.slides || response.data?.slides || [];
        const statsData = response.stats || response.data?.stats || [];

        setSlides(slidesData.length ? slidesData : getFallbackSlides());
        setStats(statsData.length ? statsData : getFallbackStats());
      } catch (error) {
        console.error("Lỗi lấy dữ liệu hero:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setSlides(getFallbackSlides());
        setStats(getFallbackStats());
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Auto slide
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Map icon string to component
  const getIconComponent = (iconName) => {
    const icons = {
      Users: Users,
      BookOpen: BookOpen,
      Award: Award,
      Star: Star,
    };
    return icons[iconName] || BookOpen;
  };

  // Loading state
  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Đang tải dữ liệu...
          </p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-7xl mb-4">😅</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  // Empty state
  if (slides.length === 0) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="text-7xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Chưa có dữ liệu
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Hiện tại chưa có slide nào để hiển thị
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Slide Container */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="min-w-full">
                  <div
                    className={`relative bg-gradient-to-r ${slide.bgGradient || "from-blue-600 to-indigo-600"} rounded-3xl p-8 md:p-16 overflow-hidden min-h-[500px] md:min-h-[550px] flex items-center`}
                  >
                    <div className="relative z-10 max-w-3xl">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-4xl md:text-6xl animate-bounce">
                          {slide.image || "🚀"}
                        </span>
                      </div>

                      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                        {slide.title}
                      </h1>

                      <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                        {slide.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4">
                        <Link
                          to={slide.buttonLink || "/courses"}
                          className="group bg-white text-gray-900 px-8 py-3.5 rounded-2xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                          <Play className="w-5 h-5 fill-current" />
                          {slide.buttonText || "Bắt đầu ngay"}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          to="/courses"
                          className="bg-white/20 backdrop-blur-sm text-white px-8 py-3.5 rounded-2xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
                        >
                          <BookOpen className="w-5 h-5" />
                          Xem khóa học
                        </Link>
                      </div>

                      {slide.stat && (
                        <div className="mt-8 flex items-center gap-6">
                          <div className="flex items-center gap-2 text-white/90">
                            <div className="flex -space-x-2">
                              {[1, 2, 3, 4].map((i) => (
                                <div
                                  key={i}
                                  className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center text-white font-semibold text-xs"
                                >
                                  {String.fromCharCode(64 + i)}
                                </div>
                              ))}
                            </div>
                            <span className="text-sm font-medium">
                              {slide.stat}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10">
                      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                        <div className="w-64 h-64 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full"></div>
                    <div className="absolute -left-20 -top-20 w-60 h-60 bg-white/5 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-20 hidden md:block"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-20 hidden md:block"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}

          {/* Dot Indicators */}
          {slides.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-10 bg-gradient-to-r from-blue-600 to-indigo-600"
                      : "w-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        {stats.length > 0 && (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const Icon = getIconComponent(stat.icon);
              return (
                <div
                  key={index}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
