import { useState, useEffect } from "react";
import mainsectionbg from "../../assets/mainsectionbg.jpg";
import COLOR_PALETTES from "../../../theme";

const HeroCarousel = () => {
  const palette = COLOR_PALETTES.luxuryCouture || {
    primaryHeader: "#151515",
    background: "#FFFFFF",
    accentButton: "#D4AF37", // Gold
    text: "#FFFFFF",
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 1); // Only 1 slide for now
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + 1) % 1);
    setAutoPlay(false);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % 1);
    setAutoPlay(false);
  };

  const slides = [
    {
      image: mainsectionbg,
      title: "Naqsh Couture",
      subtitle: "Bespoke Artisanal Creations",
      cta: "Shop NOW",
    },
  ];

  const currentSlideData = slides[currentSlide];

  // (removed unused fashion icons for this layout)

  return (
    <section className="w-full relative overflow-hidden">
      {/* Carousel Container */}
      <div
        className="relative w-full h-48 lg:h-56 flex items-center"
        style={{ height: "1000px" }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={currentSlideData.image}
            alt={currentSlideData.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-[#151515]/40"></div>
        </div>

        {/* Centered search input and tags */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-full max-w-2xl px-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full flex items-center bg-white/10 rounded-full px-4 py-3 backdrop-blur-sm" style={{border: `1px solid ${palette.accentButton}`}}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/90 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
                </svg>
                <input
                  type="search"
                  placeholder="Search Naqsh Couture..."
                  className="w-full bg-transparent text-white placeholder-white/70 outline-none text-sm lg:text-base"
                />
              </div>

              <div className="flex flex-wrap justify-center gap-3 mt-2">
                <a className="text-sm text-white/90 hover:text-white" href="#">#handmade</a>
                <a className="text-sm text-white/80 hover:text-white" href="#">#embroidery</a>
                <a className="text-sm text-white/80 hover:text-white" href="#">#couture</a>
                <a className="text-sm text-white/80 hover:text-white" href="#">#naqsh</a>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons (Optional - Hidden for single slide) */}
        {slides.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: palette.accentButton }}
              aria-label="Previous slide"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke={palette.primaryHeader}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: palette.accentButton }}
              aria-label="Next slide"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke={palette.primaryHeader}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    setAutoPlay(false);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "w-6" : "w-2"
                  }`}
                  style={{
                    backgroundColor:
                      index === currentSlide
                        ? palette.accentButton
                        : "rgba(255, 255, 255, 0.5)",
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroCarousel;
