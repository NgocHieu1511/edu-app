export const getSlides = async (req, res) => {
  try {
    const slides = [
      {
        id: 1,
        title: "Học lập trình từ cơ bản đến nâng cao",
        description:
          "ReactJS, NodeJS, MongoDB, JavaScript và nhiều khóa học khác.",
        image: "🚀",
        bgGradient: "from-blue-600 via-indigo-600 to-purple-600",
        stat: "5000+ Học viên",
        buttonText: "Bắt đầu ngay",
        buttonLink: "/courses",
      },
      {
        id: 2,
        title: "Xây dựng ứng dụng thực tế với ReactJS",
        description:
          "Từ Frontend đến Fullstack, trở thành lập trình viên chuyên nghiệp.",
        image: "💻",
        bgGradient: "from-emerald-500 via-teal-500 to-cyan-500",
        stat: "200+ Dự án mẫu",
        buttonText: "Khám phá ngay",
        buttonLink: "/courses",
      },
      {
        id: 3,
        title: "Khóa học JavaScript chuyên sâu",
        description: "Nắm vững ES6+, async/await, và các concept nâng cao.",
        image: "⚡",
        bgGradient: "from-orange-500 via-red-500 to-pink-500",
        stat: "100+ Bài học",
        buttonText: "Học ngay",
        buttonLink: "/courses",
      },
      {
        id: 4,
        title: "Fullstack Developer với MERN Stack",
        description:
          "MongoDB, Express.js, ReactJS, NodeJS - Trở thành Fullstack Developer.",
        image: "🌟",
        bgGradient: "from-violet-500 via-purple-500 to-fuchsia-500",
        stat: "50+ Giờ học",
        buttonText: "Bắt đầu ngay",
        buttonLink: "/courses",
      },
    ];
    res.status(200).json(slides);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = [
      { icon: "Users", value: "5,000+", label: "Học viên" },
      { icon: "BookOpen", value: "50+", label: "Khóa học" },
      { icon: "Award", value: "98%", label: "Hài lòng" },
      { icon: "Star", value: "4.8/5", label: "Đánh giá" },
    ];

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
