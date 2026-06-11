function CategorySection() {
  const categories = [
    "Frontend",
    "Backend",
    "Mobile",
    "AI",
    "DevOps",
    "Database",
  ];

  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold mb-8">Danh mục nổi bật</h2>

      <div className="grid md:grid-cols-3 gap-5">
        {categories.map((item) => (
          <div
            key={item}
            className="border rounded-xl p-6 hover:shadow-lg transition"
          >
            <h3 className="font-bold text-xl">{item}</h3>

            <p className="text-gray-500 mt-2">Khóa học về {item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
