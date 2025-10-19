import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainHeader from "./components/header/MainHeader";
import SellerHeader from "./components/header/SellerHeader";
import CustomerHeader from "./components/header/CustomerHeader";
import HeroCarousel from "./components/sections/HeroCarousel";
import HeroCards from "./components/sections/HeroCards";
import FeaturedProductsSection from "./components/sections/FeaturedProductsSection";
import BrandsSection from "./components/sections/BrandsSection";
import TestimonialsSection from "./components/sections/TestimonialsSection";
import Footer from "./components/footer/Footer";
import ShopPage from "./pages/ShopPage";
import AuthPage from "./components/auth/AuthPage";
import SellerDashboard from "./pages/SellerDashboard";
import UserProfile from "./pages/UserProfile";
import SellerProfile from "./pages/SellerProfile";
import ProductUpload from "./pages/ProductUpload";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Determine which header to show
  let HeaderComponent = MainHeader;
  if (user) {
    if (user.role === 'seller' || user.role === 'admin') {
      HeaderComponent = SellerHeader;
    } else if (user.role === 'customer') {
      HeaderComponent = CustomerHeader;
    }
  }

  return (
    <BrowserRouter>
      <HeaderComponent user={user} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroCarousel />
              <HeroCards />
              <FeaturedProductsSection />
              <BrandsSection />
              <TestimonialsSection />
            </>
          }
        />
        <Route path="/shop" element={<ShopPage />} />
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/" /> : <AuthPage onLoginSuccess={handleLoginSuccess} />} 
        />
        <Route
          path="/seller/dashboard"
          element={user && (user.role === 'seller' || user.role === 'admin') ? <SellerDashboard /> : <Navigate to="/auth" />}
        />
        <Route
          path="/seller/products/upload"
          element={user && (user.role === 'seller' || user.role === 'admin') ? <ProductUpload /> : <Navigate to="/auth" />}
        />
        <Route
          path="/profile"
          element={user ? <UserProfile /> : <Navigate to="/auth" />}
        />
        <Route
          path="/seller/profile"
          element={user && (user.role === 'seller' || user.role === 'admin') ? <SellerProfile /> : <Navigate to="/auth" />}
        />
        <Route
          path="/seller/store"
          element={user && (user.role === 'seller' || user.role === 'admin') ? <SellerProfile /> : <Navigate to="/auth" />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
