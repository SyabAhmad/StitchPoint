import React, { useState, useEffect } from "react";
import heroImage from "../assets/hero.jpg";
import team1 from "../assets/team1.jpg";
import workshop from "../assets/workshop.jpg";
import founder from "../assets/founder.jpg";
import pakistanMap from "../assets/pakistan-map.jpg"; // You'll need to add this image

// Clean SVG Icons
const BespokeIcon = () => (
  <svg
    className="w-full h-full"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const EmbroideryIcon = () => (
  <svg
    className="w-full h-full"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);

const RestylingIcon = () => (
  <svg
    className="w-full h-full"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const BridalIcon = () => (
  <svg
    className="w-full h-full"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const EventIcon = () => (
  <svg
    className="w-full h-full"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ReadyIcon = () => (
  <svg
    className="w-full h-full"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const DeliveryIcon = () => (
  <svg
    className="w-full h-full"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
    <polyline points="7.5 19.79 7.5 14.6 3 12" />
    <polyline points="21 12 16.5 14.6 16.5 19.79" />
  </svg>
);

const PackageIcon = () => (
  <svg
    className="w-full h-full"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const LocationIcon = () => (
  <svg
    className="w-full h-full"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function About() {
  const [scrollY, setScrollY] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const [activeTeamMember, setActiveTeamMember] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredProvince, setHoveredProvince] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = [
    {
      icon: <BespokeIcon />,
      title: "Bespoke Tailoring",
      description: "Custom-fitted garments crafted with precision and care",
      features: [
        "Personal consultations",
        "Premium fabric selection",
        "Multiple fittings",
      ],
    },
    {
      icon: <EmbroideryIcon />,
      title: "Hand Embroidery",
      description: "Intricate threadwork bringing traditional patterns to life",
      features: ["Aari work", "Mirror work", "Custom designs"],
    },
    {
      icon: <RestylingIcon />,
      title: "Restyling & Alterations",
      description: "Transform existing pieces into contemporary treasures",
      features: [
        "Vintage restoration",
        "Modern updates",
        "Sustainable fashion",
      ],
    },
    {
      icon: <BridalIcon />,
      title: "Bridal Collections",
      description: "Complete bridal ensembles for your special day",
      features: ["Wedding gowns", "Bridal accessories", "Family coordination"],
    },
    {
      icon: <EventIcon />,
      title: "Event Wear",
      description: "Stunning outfits for every occasion",
      features: ["Formal wear", "Cocktail dresses", "Cultural attire"],
    },
    {
      icon: <ReadyIcon />,
      title: "Ready-to-Wear",
      description: "Curated collection of contemporary designs",
      features: ["Seasonal collections", "Size inclusive", "Quality assured"],
    },
  ];

  const teamMembers = [
    {
      name: "Sarah Khan",
      role: "Founder & Creative Director",
      image: founder,
      description:
        "With 15+ years in haute couture, Sarah blends traditional techniques with contemporary vision.",
    },
    {
      name: "Ahmed Patel",
      role: "Master Tailor",
      image: team1,
      description:
        "Ahmed's precision and expertise ensure every garment fits like a second skin.",
    },
    {
      name: "Maria Rodriguez",
      role: "Embroidery Specialist",
      image: workshop,
      description:
        "Maria's intricate handwork brings fabrics to life with stunning artistry and detail.",
    },
  ];

  const provinces = [
    {
      name: "Punjab",
      cities: "Lahore, Faisalabad, Rawalpindi",
      x: "45%",
      y: "35%",
    },
    { name: "Sindh", cities: "Karachi, Hyderabad, Sukkur", x: "35%", y: "70%" },
    { name: "KPK", cities: "Peshawar, Abbottabad, Mardan", x: "55%", y: "25%" },
    {
      name: "Balochistan",
      cities: "Quetta, Gwadar, Turbat",
      x: "25%",
      y: "55%",
    },
    { name: "Islamabad", cities: "Capital Territory", x: "52%", y: "32%" },
    { name: "Gilgit-Baltistan", cities: "Gilgit, Skardu", x: "65%", y: "15%" },
    {
      name: "Azad Kashmir",
      cities: "Muzaffarabad, Mirpur",
      x: "60%",
      y: "30%",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-black-silk/2 to-white/98 overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative flex items-center overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-r from-black-silk/50 via-transparent to-transparent z-0"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className={`transition-all duration-1000 ${
                isLoaded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-gold-500/10 border border-gold-500/30 rounded-full text-gold-500 text-sm font-medium mb-4">
                  Welcome to Naqsh Couture
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl text-gold-500 font-bold font-serif leading-tight mb-6">
                Crafting{" "}
                <span className="relative">
                  Timeless
                  <span className="absolute bottom-0 left-0 w-full h-3 bg-gold-500/20 -z-10 transform -rotate-1"></span>
                </span>{" "}
                Elegance
              </h1>
              <p className="text-xl text-black/80 leading-relaxed mb-8 max-w-lg">
                Where tradition meets innovation in the art of bespoke fashion
              </p>

              {/* Animated Stats */}
              <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="text-center group">
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gold-500/10 rounded-2xl transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gold-500/20 transition-all duration-300 group-hover:shadow-xl">
                      <span className="block text-4xl font-bold text-gold-500 mb-2">
                        15+
                      </span>
                      <span className="text-sm text-black/70 font-medium">
                        Years of Excellence
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gold-500/10 rounded-2xl transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gold-500/20 transition-all duration-300 group-hover:shadow-xl">
                      <span className="block text-4xl font-bold text-gold-500 mb-2">
                        500+
                      </span>
                      <span className="text-sm text-black/70 font-medium">
                        Happy Clients
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gold-500/10 rounded-2xl transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gold-500/20 transition-all duration-300 group-hover:shadow-xl">
                      <span className="block text-4xl font-bold text-gold-500 mb-2">
                        100%
                      </span>
                      <span className="text-sm text-black/70 font-medium">
                        Custom Made
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#services"
                  className="bg-gold-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-gold-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Explore Our Services
                </a>
                <a
                  href="#contact"
                  className="border-2 border-gold-500 text-gold-500 px-8 py-4 rounded-full font-semibold hover:bg-gold-500 hover:text-white transition-all duration-300"
                >
                  Get In Touch
                </a>
              </div>
            </div>

            <div
              className={`relative transition-all duration-1000 delay-300 ${
                isLoaded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <div
                className="rounded-3xl overflow-hidden shadow-2xl relative h-[600px]"
                style={{
                  backgroundImage: `url(${heroImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transform: `translateY(${scrollY * 0.1}px)`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300">
                    <span className="text-4xl text-white">▶</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story with Timeline */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-gold-500 font-bold font-serif mb-4 relative inline-block">
              <span className="relative z-10">Our Journey</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-gold-500/20 -z-10 transform -rotate-1"></span>
            </h2>
            <p className="text-xl text-black/70 max-w-2xl mx-auto">
              From a small workshop to a premier destination for bespoke fashion
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gold-500/10 to-transparent rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gold-500/20">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center">
                      <span className="text-gold-500 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-black mb-2">
                        The Beginning
                      </h3>
                      <p className="text-black/70">
                        Founded by Sarah Khan in 2008, Naqsh Couture emerged
                        from a passion for preserving Pakistan's rich textile
                        heritage.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center">
                      <span className="text-gold-500 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-black mb-2">
                        Growth & Expansion
                      </h3>
                      <p className="text-black/70">
                        What began as a small workshop evolved into a premier
                        destination for bespoke fashion that tells unique
                        stories.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center">
                      <span className="text-gold-500 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-black mb-2">
                        Today
                      </h3>
                      <p className="text-black/70">
                        Our commitment to excellence is unwavering. Every
                        stitch, every pattern, every fabric choice reflects our
                        dedication.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/30 to-gold-500/10 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div
                className="relative h-96 bg-cover bg-center rounded-3xl shadow-2xl overflow-hidden"
                style={{ backgroundImage: `url(${founder})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/50"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-3xl font-serif font-semibold text-white mb-2">
                    Sarah Khan
                  </h3>
                  <p className="text-white/80">Founder & Creative Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Services Section */}
      <section
        id="services"
        className="py-24 bg-gradient-to-br from-gold-500/5 to-white/95 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-gold-500 font-bold font-serif mb-4 relative inline-block">
              <span className="relative z-10">Our Expertise</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-gold-500/20 -z-10 transform -rotate-1"></span>
            </h2>
            <p className="text-xl text-black/70 max-w-2xl mx-auto">
              Comprehensive fashion services tailored to your vision
            </p>
          </div>

          {/* Service Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {services.map((service, index) => (
              <button
                key={index}
                onClick={() => setActiveService(index)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeService === index
                    ? "bg-gold-500 text-white shadow-lg"
                    : "bg-white/80 text-black/70 hover:bg-white hover:text-gold-500 border border-gold-500/20"
                }`}
              >
                {service.title}
              </button>
            ))}
          </div>

          {/* Active Service Display */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gold-500/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-20 h-20 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-500 mb-6">
                  {services[activeService].icon}
                </div>
                <h3 className="text-3xl font-serif font-semibold text-black mb-4">
                  {services[activeService].title}
                </h3>
                <p className="text-xl text-black/80 mb-8 leading-relaxed">
                  {services[activeService].description}
                </p>
                <ul className="space-y-3">
                  {services[activeService].features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gold-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gold-500 text-sm">✓</span>
                      </div>
                      <span className="text-black/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-8 bg-gold-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-gold-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Learn More
                </button>
              </div>
              <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-gold-500/10 to-gold-500/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-500/30">
                    {services[activeService].icon}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Pakistan Map */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-gold-500 font-bold font-serif mb-4 relative inline-block">
              <span className="relative z-10">Nationwide Delivery</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-gold-500/20 -z-10 transform -rotate-1"></span>
            </h2>
            <p className="text-xl text-black/70 max-w-2xl mx-auto">
              Delivering craftsmanship across Pakistan
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-xl border-2 border-gold-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl"></div>

                {/* Pakistan Map Container */}
                <div className="relative w-full h-96 rounded-2xl overflow-hidden">
                  <img
                    src={pakistanMap}
                    alt="Pakistan Map with Districts"
                    className="w-full h-full object-cover"
                  />

                  {/* Interactive Province Markers */}
                  {provinces.map((province, index) => (
                    <div
                      key={index}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{ left: province.x, top: province.y }}
                      onMouseEnter={() => setHoveredProvince(province.name)}
                      onMouseLeave={() => setHoveredProvince(null)}
                    >
                      <div className="relative">
                        <div className="w-4 h-4 bg-gold-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-4 h-4 bg-gold-500 rounded-full animate-ping"></div>

                        {/* Tooltip */}
                        {hoveredProvince === province.name && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap z-10">
                            <div className="font-semibold">{province.name}</div>
                            <div className="text-xs opacity-80">
                              {province.cities}
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl text-gold-500 font-serif font-bold">
                Serving All Provinces
              </h3>
              <p className="text-lg text-black/80 leading-relaxed">
                We deliver our exquisite craftsmanship to every corner of
                Pakistan, ensuring your bespoke pieces reach you with the same
                care they were created with.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-gold-500/20 group-hover:scale-110">
                    <DeliveryIcon />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">
                      Express Delivery
                    </h4>
                    <p className="text-black/70">
                      Fast and reliable shipping to all major cities
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-gold-500/20 group-hover:scale-110">
                    <PackageIcon />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">
                      Secure Packaging
                    </h4>
                    <p className="text-black/70">
                      Premium packaging to protect your garments
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-gold-500/20 group-hover:scale-110">
                    <LocationIcon />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">
                      Nationwide Coverage
                    </h4>
                    <p className="text-black/70">
                      From Karachi to Islamabad and everywhere in between
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Team Section */}
      <section className="py-24 bg-gradient-to-br from-gold-500/5 to-white/95 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-gold-500 font-bold font-serif mb-4 relative inline-block">
              <span className="relative z-10">Meet Our Artisans</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-gold-500/20 -z-10 transform -rotate-1"></span>
            </h2>
            <p className="text-xl text-black/70 max-w-2xl mx-auto">
              The talented individuals behind our exquisite creations
            </p>
          </div>

          {/* Team Member Selector */}
          <div className="flex justify-center gap-4 mb-12">
            {teamMembers.map((member, index) => (
              <button
                key={index}
                onClick={() => setActiveTeamMember(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  activeTeamMember === index
                    ? "bg-gold-500 w-12"
                    : "bg-gold-500/30 hover:bg-gold-500/50"
                }`}
              ></button>
            ))}
          </div>

          {/* Active Team Member Display */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gold-500/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/30 to-gold-500/10 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <div
                  className="relative h-96 bg-cover bg-center rounded-3xl overflow-hidden"
                  style={{
                    backgroundImage: `url(${teamMembers[activeTeamMember].image})`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/50"></div>
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-serif font-semibold text-black mb-2">
                  {teamMembers[activeTeamMember].name}
                </h3>
                <p className="text-xl text-gold-500 font-medium mb-6">
                  {teamMembers[activeTeamMember].role}
                </p>
                <p className="text-lg text-black/80 leading-relaxed mb-8">
                  {teamMembers[activeTeamMember].description}
                </p>

                <div className="flex gap-4">
                  <button className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-gold-500/20 hover:scale-110">
                    <span className="text-gold-500">📧</span>
                  </button>
                  <button className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-gold-500/20 hover:scale-110">
                    <span className="text-gold-500">💼</span>
                  </button>
                  <button className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-gold-500/20 hover:scale-110">
                    <span className="text-gold-500">📱</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section with Animated Cards */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-gold-500 font-bold font-serif mb-4 relative inline-block">
              <span className="relative z-10">Our Principles</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-gold-500/20 -z-10 transform -rotate-1"></span>
            </h2>
            <p className="text-xl text-black/70 max-w-2xl mx-auto">
              The values that guide our craft and define our brand
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-gold-500/5 to-gold-500/10 rounded-2xl p-8 text-center shadow-lg border border-gold-500/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="text-6xl mb-6 transition-all duration-500 group-hover:scale-110">
                  🎨
                </div>
                <h3 className="text-2xl font-serif font-semibold text-black mb-4">
                  Artisanal Craftsmanship
                </h3>
                <p className="text-black/80 leading-relaxed">
                  Every piece is handcrafted with meticulous attention to detail
                  and quality.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-gold-500/5 to-gold-500/10 rounded-2xl p-8 text-center shadow-lg border border-gold-500/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="text-6xl mb-6 transition-all duration-500 group-hover:scale-110">
                  🤝
                </div>
                <h3 className="text-2xl font-serif font-semibold text-black mb-4">
                  Personalized Service
                </h3>
                <p className="text-black/80 leading-relaxed">
                  Your unique vision guides our creative process, ensuring truly
                  bespoke results.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-gold-500/5 to-gold-500/10 rounded-2xl p-8 text-center shadow-lg border border-gold-500/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="text-6xl mb-6 transition-all duration-500 group-hover:scale-110">
                  🌱
                </div>
                <h3 className="text-2xl font-serif font-semibold text-black mb-4">
                  Sustainable Fashion
                </h3>
                <p className="text-black/80 leading-relaxed">
                  We prioritize ethical materials and timeless designs that
                  stand the test of time.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-gold-500/5 to-gold-500/10 rounded-2xl p-8 text-center shadow-lg border border-gold-500/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="text-6xl mb-6 transition-all duration-500 group-hover:scale-110">
                  ❤️
                </div>
                <h3 className="text-2xl font-serif font-semibold text-black mb-4">
                  Passion for Excellence
                </h3>
                <p className="text-black/80 leading-relaxed">
                  Our love for fashion drives us to create pieces that inspire
                  and empower.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gold-500/10 to-gold-500/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-gold-500 font-bold font-serif mb-6 relative inline-block">
              <span className="relative z-10">
                Ready to Create Something Extraordinary?
              </span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-gold-500/20 -z-10 transform -rotate-1"></span>
            </h2>
            <p className="text-xl text-black/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Let's discuss your vision and bring it to life with our expert
              craftsmanship.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <a
                href="#contact"
                className="group bg-gold-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-gold-600 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Book Consultation
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-600 to-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </a>
              <a
                href="#portfolio"
                className="group border-2 border-gold-500 text-gold-500 px-8 py-4 rounded-full font-semibold hover:bg-gold-500 hover:text-white transition-all duration-300 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  View Portfolio
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
                <div className="absolute inset-0 bg-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </a>
            </div>

            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📞</span>
                </div>
                <p className="text-black/70">Call Us</p>
                <p className="font-semibold text-black">+92 300 1234567</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✉️</span>
                </div>
                <p className="text-black/70">Email Us</p>
                <p className="font-semibold text-black">
                  info@naqshcouture.com
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📍</span>
                </div>
                <p className="text-black/70">Visit Us</p>
                <p className="font-semibold text-black">Lahore, Pakistan</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
