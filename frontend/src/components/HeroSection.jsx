function HeroSection() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold">
          Học lập trình từ cơ bản đến nâng cao
        </h1>

        <p className="mt-6 text-gray-600 text-lg">
          ReactJS, NodeJS, MongoDB, JavaScript và nhiều khóa học khác.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            Khám phá khóa học
          </button>

          <button className="border px-6 py-3 rounded-lg">Xem miễn phí</button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
