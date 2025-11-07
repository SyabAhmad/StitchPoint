import React from "react";
import heroImage from "../../assets/hero.jpg";

export default function Hero() {
  return (
    <section className="w-full">
      <div
        className="w-full min-h-[500px] md:h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
    </section>
  );
}
