import React from "react";
import Hero from "../components/home/Hero";
import FeaturedServices from "../components/home/FeaturedServices";
import ClassesSection from "../components/home/ClassesSection";
import NewArrivals from "../components/home/NewArrivals";
import CardsSection from "../components/home/CardsSection";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";

export default function HomePage() {
  return (
    <div className="home-page">
      <Hero />
      <FeaturedServices />
      <ClassesSection />
      <NewArrivals />
      <CardsSection />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
