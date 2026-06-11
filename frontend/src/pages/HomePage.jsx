import MainLayout from "../layouts/MainLayout";
import HeroSection from "../components/HeroSection";
import CategorySection from "../components/CategorySection";
import FeaturedCourses from "../components/FeaturedCourses";

function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <CategorySection />
      <FeaturedCourses />
    </MainLayout>
  );
}

export default HomePage;
