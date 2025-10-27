import { Outlet } from "react-router-dom";
import NaqshCoutureNavbar from "./header/NaqshCoutureNavbar.jsx";
import Footer from "./footer/Footer.jsx";

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
    </div>
  );
};

export default Layout;
