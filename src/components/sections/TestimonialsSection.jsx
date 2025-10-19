import COLOR_PALETTES from "../../../theme";

const TestimonialsSection = () => {
  const palette = COLOR_PALETTES.luxuryCouture;

  const testimonials = [
    {
      id: 1,
      name: "Fatima Khan",
      role: "Fashion Enthusiast",
      message: "The quality of the embroidery is exceptional. Naqsh Couture truly delivers luxury!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Ahmed Hassan",
      role: "Regular Customer",
      message: "Fast shipping and authentic handmade products. Highly recommended for anyone seeking quality.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "Zainab Ali",
      role: "Design Professional",
      message: "Every piece tells a story. The artisanship here is unmatched. Love supporting local talent!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    {
      id: 4,
      name: "Usman Malik",
      role: "Business Owner",
      message: "Perfect for corporate gifting. My clients absolutely loved the personalized options.",
      rating: 4,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
  ];

  return (
    <section className="py-16 px-6 lg:px-12" style={{ backgroundColor: palette.primaryHeader }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-2 text-white">
            Customer Love Stories
          </h2>
          <p className="text-gray-300">See what our customers are saying</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20"
            >
              {/* Stars */}
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < testimonial.rating ? "text-yellow-400" : "text-gray-500"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Message */}
              <p className="text-white text-sm mb-4 italic">"{testimonial.message}"</p>

              {/* Customer Info */}
              <div className="flex items-center gap-3 border-t border-white/20 pt-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-300">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
