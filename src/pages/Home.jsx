import { useState, useEffect } from "react";
import CategoryNav from "../components/CategoryNav.jsx";
import { useBannerStore } from "@/store/banner.store";
import CategorySlider from "../components/CategorySlider.jsx";
import SubcategoryList from "../components/SubcategoryList.jsx";
import PromoSection from "@/components/PromoSection.jsx";
import RecentProductsCarousel from "@/components/RecentProductsCarousel.jsx";
import TopProductsCarousel from "@/components/TopProductsCarousel.jsx";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { banners, fetchactiveBanners } = useBannerStore();

  useEffect(() => {
    fetchactiveBanners();
  }, []);

  return (
    <div>
      {/* 🔹 Category Navigation */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </section>

      {/* 🔹 Category Slider */}
      <section className="max-w-7xl mx-auto px-4">
        <CategorySlider category={selectedCategory} defaultBanners={banners} />
      </section>

      {/* 🔹 Subcategories */}
      <section className="max-w-7xl mx-auto px-4 py-5">
        <SubcategoryList category={selectedCategory} />
      </section>

      {/* 🔹 Recent Products */}
      <section className="max-w-7xl mx-auto px-4 py-5">
        <RecentProductsCarousel />
      </section>

<<<<<<< HEAD
=======
      {/* 🔹 Free Shipping Banner */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <img 
          src="/assets/free_shipping_297.png" 
          alt="Free Shipping on orders above ₹297" 
          className="w-full h-auto rounded-lg shadow-md"
        />
      </section>

>>>>>>> 460700d960a77f96500b74421728d156211c487a
      {/* 🔹 Promo Section */}
      <section className="max-w-7xl mx-auto">
        <PromoSection />
      </section>

      {/* 🔹 Top Products */}
      <section className="max-w-7xl mx-auto px-4 py-5">
        <TopProductsCarousel />
      </section>
    </div>
  );
}
