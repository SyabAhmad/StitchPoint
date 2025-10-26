import React from "react";
import Hero from "./Hero";
import About from "./About";
import FeaturedServices from "./FeaturedServices";
import ClassesSection from "./ClassesSection";
import CardsSection from "./CardsSection";
import NewArrivals from "./NewArrivals";
import Testimonials from "./Testimonials";
import Newsletter from "./Newsletter";

export default function HomePage() {
  return (
    <div className="home-page">
      <Hero />
      <About />
      <FeaturedServices />
      <ClassesSection />
      <CardsSection />
      <NewArrivals />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
