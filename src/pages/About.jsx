import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import heroImage from "../assets/hero.jpg";
import team1 from "../assets/1.jpg";
import workshop from "../assets/contactus.jpg";
import founder from "../assets/dream.jpg";
import fabric from "../assets/embroidery.jpg";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Modern SVG Icons
const StarIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const SparklesIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

const HeartIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const CrownIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const GemIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    />
  </svg>
);

const MapPinIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ShipIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
    />
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
      features: [
        "Personal consultations",
        "Premium fabric selection",
        "Multiple fittings",
      ],
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
      description:
        "Sara is a passionate UI/UX designer and developer crafting beautiful digital experiences that blend aesthetics with functionality. As a Computer Science student at University of Swat, she excels in creating visually appealing designs and user-friendly interfaces.",
      specialties: [
        "UI/UX Design",
        "React Development",
        "Figma",
        "Adobe XD",
        "Graphic Design",
      ],
      portfolio: "https://saraali.vercel.app/",
    },
    {
      name: "Mahroosh",
      role: "Fullstack Developer",
      image: workshop,
      description:
        "Mahroosh builds robust backend systems and seamless frontend experiences, ensuring our platform runs flawlessly.",
      specialties: [
        "Backend Development",
        "Fullstack Solutions",
        "System Architecture",
      ],
    },
  ];

  const values = [
    {
      icon: <StarIcon />,
      title: "Artisanal Excellence",
      description:
        "Every piece is handcrafted with meticulous attention to detail and quality.",
    },
    {
      icon: <HeartIcon />,
      title: "Personalized Service",
      description:
        "Your unique vision guides our creative process, ensuring truly bespoke results.",
    },
    {
      icon: <SparklesIcon />,
      title: "Sustainable Fashion",
      description:
        "We prioritize ethical materials and timeless designs that stand the test of time.",
    },
    {
      icon: <CrownIcon />,
      title: "Passion for Perfection",
      description:
        "Our love for fashion drives us to create pieces that inspire and empower.",
    },
  ];

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Modern Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-black/80 z-10"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        ></div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="transition-all duration-1000 opacity-100 translate-y-0">
              <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm font-medium mb-8">
                ✨ Welcome to Naqsh Couture
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold font-serif leading-tight mb-8">
                Crafting{" "}
                <span className="relative inline-block">
                  <span className="text-white">Timeless</span>
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-white rounded"></span>
                </span>{" "}
                Elegance
              </h1>

              <p className="text-2xl md:text-3xl text-white/90 leading-relaxed mb-12 max-w-3xl mx-auto">
                Where tradition meets innovation in the art of bespoke fashion
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="#services"
                  className="group bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 shadow-2xl transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center gap-2">
                    Explore Our Services
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </a>
                <a
                  href="#story"
                  className="group border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-300"
                >
                  Our Story
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Story Section */}
      <section id="story" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 bg-black/10 border border-black/20 rounded-lg text-black text-sm font-medium mb-6">
              Our Journey
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl text-black font-bold font-serif mb-6">
              From Vision to <span className="text-black">Reality</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A tale of passion, craftsmanship, and the pursuit of fashion
              excellence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="group relative">
                <div className="absolute -inset-1 bg-black/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white rounded-lg p-8 shadow-xl border border-black/10">
                  <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-6">
                    1
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-black mb-4">
                    The Dream
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Founded by Sarah Khan in 2008, Naqsh Couture emerged from a
                    passion for preserving Pakistan's rich textile heritage
                    while embracing contemporary design aesthetics.
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-1 bg-black/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white rounded-lg p-8 shadow-xl border border-black/10">
                  <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-6">
                    2
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-black mb-4">
                    The Evolution
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    What began as a small workshop evolved into a premier
                    destination for bespoke fashion that tells unique stories
                    through every thread and pattern.
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-1 bg-black/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white rounded-lg p-8 shadow-xl border border-black/10">
                  <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-6">
                    3
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-black mb-4">
                    Today & Beyond
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Our commitment to excellence is unwavering. Every stitch,
                    every pattern, every fabric choice reflects our dedication
                    to creating timeless pieces.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-black/10 rounded-lg blur"></div>
              <div
                className="relative h-[600px] bg-cover bg-center rounded-lg shadow-2xl overflow-hidden"
                style={{ backgroundImage: `url(${founder})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <h3 className="text-3xl font-serif font-bold mb-2">
                      Sarah Khan
                    </h3>
                    <p className="text-white/90 text-lg">
                      Founder & Creative Director
                    </p>
                    <div className="mt-4 flex gap-2">
                      <div className="px-3 py-1 bg-white/20 rounded-lg text-sm">
                        15+ Years Experience
                      </div>
                      <div className="px-3 py-1 bg-white/20 rounded-lg text-sm">
                        Haute Couture
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Services Section */}
      <section
        id="services"
        className="py-24 bg-gray-50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-px bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 bg-black/10 border border-black/20 rounded-lg text-black text-sm font-medium mb-6">
              Our Expertise
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl text-black font-bold font-serif mb-6">
              Bespoke <span className="text-black">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive fashion services tailored to your unique vision
            </p>
          </div>

          {/* Service Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {services.map((service, index) => (
              <button
                key={index}
                onClick={() => setActiveService(index)}
                className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                  activeService === index
                    ? "bg-black text-white shadow-xl transform scale-105"
                    : "bg-white text-gray-700 hover:bg-white hover:text-black border border-gray-200 hover:border-black/30"
                }`}
              >
                {service.title}
              </button>
            ))}
          </div>

          {/* Active Service Display */}
          <div className="bg-white rounded-lg p-8 md:p-12 shadow-2xl border border-black/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-black mb-6">
                  {services[activeService].title}
                </h3>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  {services[activeService].description}
                </p>
                <ul className="space-y-4">
                  {services[activeService].features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <span className="text-gray-700 text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-8 bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Learn More
                </button>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-black/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div
                  className="relative h-96 bg-cover bg-center rounded-lg shadow-2xl overflow-hidden"
                  style={{
                    backgroundImage: `url(${services[activeService].image})`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white">
                      <SparklesIcon />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Pakistan Map Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 bg-black/10 border border-black/20 rounded-lg text-black text-sm font-medium mb-6">
              Nationwide Coverage
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl text-black font-bold font-serif mb-6">
              Serving <span className="text-black">All Pakistan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Delivering our exquisite craftsmanship to every corner of Pakistan
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl text-black font-serif font-bold">
                Complete Nationwide Coverage
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                We deliver our bespoke fashion services to all provinces and
                major cities across Pakistan. From the northern mountains to the
                southern coasts, our commitment to excellence reaches every
                region.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-16 h-16 bg-black/10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-black/20 group-hover:scale-110">
                    <MapPinIcon />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">
                      Express Delivery
                    </h4>
                    <p className="text-gray-700">
                      Fast and reliable shipping to all major cities across
                      Pakistan
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-16 h-16 bg-black/10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-black/20 group-hover:scale-110">
                    <ShipIcon />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">
                      Secure Packaging
                    </h4>
                    <p className="text-gray-700">
                      Premium packaging to protect your garments throughout the
                      journey
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-16 h-16 bg-black/10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-black/20 group-hover:scale-110">
                    <HeartIcon />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">
                      Regional Expertise
                    </h4>
                    <p className="text-gray-700">
                      Understanding local preferences and cultural preferences
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-black/10 rounded-lg blur"></div>
              <div className="relative bg-white rounded-lg p-4 shadow-2xl border border-black/10">
                <MapContainer
                  center={[30.3753, 69.3451]}
                  zoom={5}
                  style={{ height: "500px", width: "100%" }}
                  className="rounded-lg"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Major Cities in Pakistan */}
                  <Marker position={[24.8607, 67.0011]}>
                    <Popup>
                      <div className="text-center">
                        <h3 className="font-bold text-lg">Karachi</h3>
                        <p className="text-sm">Sindh - Financial Hub</p>
                        <p className="text-xs text-gray-600">
                          Express delivery available
                        </p>
                      </div>
                    </Popup>
                  </Marker>

                  <Marker position={[31.5497, 74.3436]}>
                    <Popup>
                      <div className="text-center">
                        <h3 className="font-bold text-lg">Lahore</h3>
                        <p className="text-sm">Punjab - Cultural Center</p>
                        <p className="text-xs text-gray-600">
                          Same day delivery
                        </p>
                      </div>
                    </Popup>
                  </Marker>

                  <Marker position={[33.6844, 73.0479]}>
                    <Popup>
                      <div className="text-center">
                        <h3 className="font-bold text-lg">Islamabad</h3>
                        <p className="text-sm">Capital Territory</p>
                        <p className="text-xs text-gray-600">
                          Priority service
                        </p>
                      </div>
                    </Popup>
                  </Marker>

                  <Marker position={[34.0151, 71.5249]}>
                    <Popup>
                      <div className="text-center">
                        <h3 className="font-bold text-lg">Peshawar</h3>
                        <p className="text-sm">KPK - Gateway to the North</p>
                        <p className="text-xs text-gray-600">
                          Mountain region delivery
                        </p>
                      </div>
                    </Popup>
                  </Marker>

                  <Marker position={[30.1975, 66.9917]}>
                    <Popup>
                      <div className="text-center">
                        <h3 className="font-bold text-lg">Quetta</h3>
                        <p className="text-sm">
                          Balochistan - Mountain Gateway
                        </p>
                        <p className="text-xs text-gray-600">
                          Extended coverage area
                        </p>
                      </div>
                    </Popup>
                  </Marker>

                  <Marker position={[31.582, 74.3294]}>
                    <Popup>
                      <div className="text-center">
                        <h3 className="font-bold text-lg">Faisalabad</h3>
                        <p className="text-sm">Punjab - Industrial Hub</p>
                        <p className="text-xs text-gray-600">
                          Textile center delivery
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Team Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 bg-black/10 border border-black/20 rounded-lg text-black text-sm font-medium mb-6">
              Our Artisans
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl text-black font-bold font-serif mb-6">
              Meet the <span className="text-black">Masters</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The talented individuals behind our exquisite creations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute -inset-1 bg-black/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white rounded-lg p-8 shadow-xl border border-black/10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden bg-black/10">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {hoveredCard === index && (
                      <div className="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                          <span className="text-black text-xl">👁</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-black text-center mb-2">
                    {member.name}
                  </h3>
                  <p className="text-black font-semibold text-center mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-700 text-center mb-6 leading-relaxed">
                    {member.description}
                  </p>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-black/10 text-black rounded-lg text-sm font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  {member.portfolio && (
                    <div className="text-center mt-4">
                      <a
                        href={member.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                      >
                        View Portfolio
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 bg-black/10 border border-black/20 rounded-lg text-black text-sm font-medium mb-6">
              Our Values
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl text-black font-bold font-serif mb-6">
              What Drives <span className="text-black">Us</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The principles that guide our craft and define our brand
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-black/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white rounded-lg p-8 text-center shadow-lg border border-black/10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-black mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm font-medium mb-8">
              Let's Create Together
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl text-white font-bold font-serif mb-8">
              Ready to Create Something{" "}
              <span className="text-white">Extraordinary?</span>
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Let's discuss your vision and bring it to life with our expert
              craftsmanship.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <a
                href="#contact"
                className="group bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 shadow-2xl transform hover:-translate-y-1"
              >
                <span className="flex items-center justify-center gap-2">
                  Book Consultation
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </a>
              <a
                href="#portfolio"
                className="group border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  View Portfolio
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-black text-2xl">📞</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Call Us</h4>
                <p className="text-white/80">+92 300 1234567</p>
              </div>
              <div className="group bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-black text-2xl">✉️</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Email Us</h4>
                <p className="text-white/80">info@naqshcouture.com</p>
              </div>
              <div className="group bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-black text-2xl">📍</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Visit Us</h4>
                <p className="text-white/80">Lahore, Pakistan</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
