import React from "react";
import Hero from "../components/home/Hero";
import FeaturedServices from "../components/home/FeaturedServices";
import CollectionsSection from "../components/home/CollectionsSection";
import NewArrivals from "../components/home/NewArrivals";
import TopSaleProducts from "../components/home/TopSaleProducts";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";

export default function HomePage() {
  return (
    <div className="home-page">
      <Hero />
      <FeaturedServices />
      <NewArrivals />
      <CollectionsSection />
      <TopSaleProducts />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
