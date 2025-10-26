import "./App.css";

import NaqshCoutureNavbar from "./components/header/NaqshCoutureNavbar.jsx";
import HomePage from "./components/home/HomePage.jsx";
import Footer from "./components/footer/Footer.jsx";
import "./styles/home.css";

function App() {
  return (
    <div className="app-root">
      {/* Top header (main) */}
      <NaqshCoutureNavbar />

      {/* Flexible main area - grows to fill available space and push footer down */}
      <main className="app-content">
        <HomePage />
      </main>

      <Footer />
    </div>
  );
}

export default App;
