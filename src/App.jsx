import "./App.css";
import { BrowserRouter } from "react-router-dom";
import MainHeader from "./components/header/MainHeader";
import HeroCarousel from "./components/sections/HeroCarousel";
import FeaturedProductsSection from "./components/sections/FeaturedProductsSection";
import BrandsSection from "./components/sections/BrandsSection";
import TestimonialsSection from "./components/sections/TestimonialsSection";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <BrowserRouter>
      <MainHeader isLoggedIn={false} onMobileMenuToggle={() => {}} />
      <HeroCarousel />
      <FeaturedProductsSection />
      <BrandsSection />
      <TestimonialsSection />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
