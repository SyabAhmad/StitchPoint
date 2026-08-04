import React from "react";
import Hero from "../components/home/Hero";
import AnnouncementMarquee from "../components/home/AnnouncementMarquee";
import FeaturedServices from "../components/home/FeaturedServices";
import CraftsmanshipStory from "../components/home/CraftsmanshipStory";
import CollectionsSection from "../components/home/CollectionsSection";
import NewArrivals from "../components/home/NewArrivals";
import TopSaleProducts from "../components/home/TopSaleProducts";
import BespokeBanner from "../components/home/BespokeBanner";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";

export default function HomePage() {
  return (
    <div className="home-page">
      <Hero />
      <AnnouncementMarquee />
      <FeaturedServices />
      <CraftsmanshipStory />
      <NewArrivals />
      <CollectionsSection />
      <TopSaleProducts />
      <BespokeBanner />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
