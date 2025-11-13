import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            fixed 
            bottom-8 
            right-8 
            z-50 
            bg-gradient-to-r 
            from-purple-500 
            via-pink-500 
            to-red-500
            text-white 
            p-4 
            rounded-full 
            shadow-2xl 
            transition-all 
            duration-300 
            hover:scale-125 
            focus:outline-none 
            focus:ring-4 
            focus:ring-purple-300 
            animate-bounce
            transform 
            hover:rotate-12 
            hover:shadow-purple-500/50
            ${isHovered ? "ring-4 ring-purple-400 ring-opacity-70" : ""}
          `}
          aria-label="Scroll to top"
        >
          <FaArrowUp
            className={`
              text-xl 
              transition-all 
              duration-300 
              ${isHovered ? "rotate-180 scale-125" : ""}
            `}
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 hover:opacity-30 transition-opacity duration-300"></div>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
