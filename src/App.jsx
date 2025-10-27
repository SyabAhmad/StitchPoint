import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NaqshCoutureNavbar from "./components/header/NaqshCoutureNavbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import About from "./pages/About.jsx";
import Collections from "./pages/Collections.jsx";
import Contact from "./pages/Contact.jsx";
import Footer from "./components/footer/Footer.jsx";
import "./styles/home.css";

function App() {
  return (
    <Router>
      <div className="app-root">
        {/* Top header (main) */}
        <NaqshCoutureNavbar />

        {/* Flexible main area - grows to fill available space and push footer down */}
        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
