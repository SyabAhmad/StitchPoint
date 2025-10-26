import React from "react";
import heroImage from "../../assets/hero.jpg";

export default function Hero() {
  return (
    <section className="w-full">
      <div
        className="w-full h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
    </section>
  );
}
