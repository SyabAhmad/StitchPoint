import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import About from "./pages/About.jsx";
import Collections from "./pages/Collections.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import StoreDetails from "./pages/StoreDetails.jsx";
import Contact from "./pages/Contact.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import CustomerDashboard from "./pages/customer/Dashboard.jsx";
import ManagerDashboard from "./pages/manager/Dashboard.jsx";
import ManagerProfile from "./pages/manager/Profile.jsx";
import ManagerProducts from "./pages/manager/Products.jsx";
import ManagerOrders from "./pages/manager/Orders.jsx";
import ManagerCategories from "./pages/manager/Categories.jsx";
import ManagerAnalytics from "./pages/manager/Analytics.jsx";
import SuperAdminDashboard from "./pages/super_admin/Dashboard.jsx";
import Analytics from "./pages/super_admin/Analytics.jsx";
import UserManagement from "./pages/super_admin/UserManagement.jsx";
import Products from "./pages/super_admin/Products.jsx";
import Orders from "./pages/super_admin/Orders.jsx";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<About />} />
          <Route path="collections" element={<Collections />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="store/:store_id" element={<StoreDetails />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="manager-dashboard" element={<ManagerDashboard />}>
            <Route index element={<div />} />
            <Route path="products" element={<ManagerProducts />} />
            <Route path="orders" element={<ManagerOrders />} />
            <Route path="categories" element={<ManagerCategories />} />
            <Route path="analytics" element={<ManagerAnalytics />} />
            <Route path="profile" element={<ManagerProfile />} />
          </Route>
          <Route path="super-admin-dashboard" element={<SuperAdminDashboard />}>
            <Route index element={<Analytics />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
