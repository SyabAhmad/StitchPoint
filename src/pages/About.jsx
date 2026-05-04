import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import heroImage from "../assets/hero.jpg";
import team1 from "../assets/1.jpg";
import workshop from "../assets/contactus.jpg";
import founder from "../assets/dream.jpg";
import fabric from "../assets/embroidery.jpg";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const StarIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const CrownIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ShipIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

export default function About() {
  const [scrollY, setScrollY] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = [
    {
      title: "Bespoke Tailoring",
      description: "Custom-fitted garments crafted with precision and care",
      features: ["Personal consultations", "Premium fabric selection", "Multiple fittings"],
      image: fabric,
    },
    {
      title: "Hand Embroidery",
      description: "Intricate threadwork bringing traditional patterns to life",
      features: ["Aari work", "Mirror work", "Custom designs"],
      image: workshop,
    },
    {
      title: "Bridal Collections",
      description: "Complete bridal ensembles for your special day",
      features: ["Wedding gowns", "Bridal accessories", "Family coordination"],
      image: heroImage,
    },
  ];

  const team = [
    {
      name: "Sara Ali",
      role: "UI/UX Designer & Developer",
      image: team1,
      description: "Sara is a passionate UI/UX designer and developer crafting beautiful digital experiences that blend aesthetics with functionality.",
      specialties: ["UI/UX Design", "React Development", "Figma"],
      portfolio: "https://saraali.vercel.app/",
    },
    {
      name: "Mahroosh",
      role: "Fullstack Developer",
      image: workshop,
      description: "Mahroosh builds robust backend systems and seamless frontend experiences, ensuring our platform runs flawlessly.",
      specialties: ["Backend Development", "Fullstack Solutions"],
    },
  ];

  const values = [
    { icon: <StarIcon />, title: "Artisanal Excellence", description: "Every piece is handcrafted with meticulous attention to detail and quality." },
    { icon: <HeartIcon />, title: "Personalized Service", description: "Your unique vision guides our creative process, ensuring truly bespoke results." },
    { icon: <SparklesIcon />, title: "Sustainable Fashion", description: "We prioritize ethical materials and timeless designs that stand the test of time." },
    { icon: <CrownIcon />, title: "Passion for Perfection", description: "Our love for fashion drives us to create pieces that inspire and empower." },
  ];

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/80 z-10"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}></div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-block px-6 py-2 border border-white/20 text-white text-sm font-bold tracking-[0.3em] uppercase mb-8">
              Welcome to Naqsh Studio
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>
              CRAFTING{" "}
              <span className="relative inline-block">
                <span className="text-white">TIMELESS</span>
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-white"></span>
              </span>{" "}
              ELEGANCE
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Where tradition meets innovation in the art of bespoke fashion
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#services" className="bg-white text-black px-8 py-4 font-bold tracking-widest uppercase hover:bg-gray-200 transition-all duration-300">
                Explore Services
              </a>
              <a href="#story" className="border border-white text-white px-8 py-4 font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300">
                Our Story
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-2 border border-black/20 text-black text-sm font-bold tracking-[0.3em] uppercase mb-6">
              Our Journey
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-black font-bold mb-6 tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>
              FROM VISION TO REALITY
            </h2>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              A tale of passion, craftsmanship, and the pursuit of fashion excellence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {[
                { num: "01", title: "THE DREAM", desc: "Founded by Sarah Khan in 2008, Naqsh Studio emerged from a passion for preserving Pakistan's rich textile heritage while embracing contemporary design aesthetics." },
                { num: "02", title: "THE EVOLUTION", desc: "What began as a small workshop evolved into a premier destination for bespoke fashion that tells unique stories through every thread and pattern." },
                { num: "03", title: "TODAY & BEYOND", desc: "Our commitment to excellence is unwavering. Every stitch, every pattern, every fabric choice reflects our dedication to creating timeless pieces." },
              ].map((item, index) => (
                <div key={index} className="border-l-2 border-black pl-8">
                  <h3 className="text-2xl font-bold text-black mb-2 tracking-wide">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="relative h-[500px] bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${founder})` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: '"Playfair Display", serif' }}>Sarah Khan</h3>
                    <p className="text-gray-300 text-sm tracking-wider">FOUNDER & CREATIVE DIRECTOR</p>
                    <div className="mt-4 flex gap-2">
                      <span className="px-3 py-1 bg-white/20 rounded text-xs text-white tracking-wider">15+ YEARS</span>
                      <span className="px-3 py-1 bg-white/20 rounded text-xs text-white tracking-wider">HAUTE COUTURE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-2 border border-white/20 text-white text-sm font-bold tracking-[0.3em] uppercase mb-6">
              Our Expertise
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6 tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>
              BESPOKE SERVICES
            </h2>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Comprehensive fashion services tailored to your unique vision
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {services.map((service, index) => (
              <button
                key={index}
                onClick={() => setActiveService(index)}
                className={`px-8 py-3 font-bold tracking-widest uppercase transition-all duration-300 ${
                  activeService === index
                    ? "bg-white text-black"
                    : "bg-transparent text-white border border-white/20 hover:border-white"
                }`}
              >
                {service.title}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-black mb-6 tracking-wide" style={{ fontFamily: '"Playfair Display", serif' }}>
                  {services[activeService].title.toUpperCase()}
                </h3>
                <p className="text-gray-500 mb-8 leading-relaxed">{services[activeService].description}</p>
                <ul className="space-y-4 mb-8">
                  {services[activeService].features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-black tracking-wide">{feature.toUpperCase()}</span>
                    </li>
                  ))}
                </ul>
                <button className="bg-black text-white px-8 py-3 font-bold tracking-widest uppercase text-sm hover:bg-gray-800 transition-all duration-300">
                  Learn More
                </button>
              </div>
              <div className="relative h-80 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${services[activeService].image})` }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-2 border border-black/20 text-black text-sm font-bold tracking-[0.3em] uppercase mb-6">
              Our Artisans
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-black font-bold mb-6 tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>
              MEET THE MASTERS
            </h2>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              The talented individuals behind our exquisite creations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="border border-black/10 p-8">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-6">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale" />
                </div>
                <h3 className="text-xl font-bold text-black text-center mb-2 tracking-wide">{member.name.toUpperCase()}</h3>
                <p className="text-gray-500 text-center text-sm tracking-wider mb-4">{member.role}</p>
                <p className="text-gray-500 text-center leading-relaxed mb-6">{member.description}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {member.specialties.map((specialty, idx) => (
                    <span key={idx} className="px-3 py-1 bg-black/5 text-black text-xs tracking-wider">
                      {specialty}
                    </span>
                  ))}
                </div>
                {member.portfolio && (
                  <div className="text-center mt-4">
                    <a href={member.portfolio} target="_blank" rel="noopener noreferrer" className="text-sm text-black underline tracking-wider">
                      View Portfolio
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6 tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>
              WHAT DRIVES US
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-8 border border-white/20">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-4 tracking-wide">{value.title.toUpperCase()}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-black font-bold mb-8 tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>
            READY TO CREATE?
          </h2>
          <p className="text-gray-500 mb-12 max-w-xl mx-auto" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Let's discuss your vision and bring it to life with our expert craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="bg-black text-white px-8 py-4 font-bold tracking-widest uppercase hover:bg-gray-800 transition-all duration-300">
              Book Consultation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}