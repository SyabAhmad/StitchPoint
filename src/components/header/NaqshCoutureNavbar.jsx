import React from "react";
import { Link } from "react-router-dom";

const NaqshCoutureNavbar = () => {
  return (
    <nav className="navbar !bg-(--black-naqsh)">
      <div className="container mx-auto container-inline">
        <div className="nc-logo">
          <h1
            className="text-2xl font-serif"
            style={{ color: "var(--gold-500)" }}
          >
            Naqsh Couture
          </h1>
        </div>
        <ul className="nav-items font-sans">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">
              About
            </Link>
          </li>
          <li>
            <Link to="/collections" className="nav-link">
              Collections
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </li>
        </ul>
        <div className="flex" style={{ gap: "0.75rem" }}>
          <button className="btn-gold">Login</button>
          <button className="btn-gray">Signup</button>
        </div>
      </div>
    </nav>
  );
};

export default NaqshCoutureNavbar;
