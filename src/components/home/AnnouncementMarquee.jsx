import React from "react";

const ANNOUNCEMENTS = [
  "Festive Sale — Up to 40% Off",
  "Free Shipping on Orders Over PKR 5,000",
  "New Arrivals Every Week",
  "Handcrafted by Local Artisans",
  "Cash on Delivery Available",
  "Premium Pakistani Couture",
];

const AnnouncementMarquee = () => {
  const track = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div className="marquee-container" aria-hidden="true">
      <div className="marquee-bar">
        <div className="marquee-track">
          {track.map((item, i) => (
            <span key={i} className="marquee-item">
              {item}
              <span className="marquee-sep">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementMarquee;
