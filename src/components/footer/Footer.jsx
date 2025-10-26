import React from "react";

export default function Footer() {
  return (
    <footer className="footer" style={{ marginTop: "2rem" }}>
      <div className="footer-links">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Contact</a>
      </div>
      <div className="footer-note">
        <small>
          © {new Date().getFullYear()} Naqsh Couture. All rights reserved.
        </small>
      </div>
    </footer>
  );
}
