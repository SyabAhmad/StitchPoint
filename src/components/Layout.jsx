import { Outlet } from "react-router-dom";
import NaqshCoutureNavbar from "./header/NaqshCoutureNavbar.jsx";
import Footer from "./footer/Footer.jsx";
import ScrollToTop from "./ScrollToTop.jsx";

const Layout = () => {
  return (
    <div className="app-root">
      {/* Top header (main) */}
      <NaqshCoutureNavbar />

      {/* Flexible main area - grows to fill available space and push footer down */}
      <main className="app-content">
        <Outlet />
      </main>

      <Footer />

      {/* Scroll to top button - appears on all pages */}
      <ScrollToTop />
    </div>
  );
};

export default Layout;
