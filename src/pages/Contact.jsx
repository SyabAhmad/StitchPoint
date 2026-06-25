import React, { useState } from "react";
import { APP_DATA } from "../data/ConstantValues";

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function Contact() {
  const contact = APP_DATA.contact;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Thank you for your message! We'll get back to you within 24 hours.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactMethods = [
    { icon: <MailIcon />, title: "EMAIL", description: "We'll respond within 24 hours", detail: contact.email, action: `mailto:${contact.email}` },
    { icon: <PhoneIcon />, title: "CALL", description: "Speak with our team", detail: contact.phone, action: `tel:${contact.phone}` },
    { icon: <LocationIcon />, title: "VISIT", description: "Come to our atelier", detail: contact.address, action: "#" },
    { icon: <ClockIcon />, title: "HOURS", description: "We're here to help", detail: contact.hours, action: "#" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>
            LET'S CREATE TOGETHER
          </h1>
          <p className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl mx-auto" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Ready to bring your vision to life? We're here to help with every step of your bespoke fashion journey.
          </p>
          <a href="#contact-form" className="inline-block bg-white text-black px-8 py-4 font-bold tracking-widest uppercase text-sm hover:bg-gray-200 transition-all duration-300">
            Get In Touch
          </a>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-black font-bold mb-6 tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>
              HOW CAN WE HELP?
            </h2>
            <p className="text-base text-gray-500 max-w-2xl mx-auto" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Choose the way that works best for you - we're here to assist with your fashion needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <a key={index} href={method.action} className="group block bg-black/5 border border-black/10 p-8 hover:border-black transition-all duration-300">
                <div className="w-12 h-12 bg-black flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {method.icon}
                </div>
                <h3 className="text-sm font-bold text-black mb-2 tracking-widest">{method.title}</h3>
                <p className="text-gray-500 text-sm mb-2">{method.description}</p>
                <p className="text-black font-bold text-sm tracking-wide">{method.detail}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-24 px-4 bg-black">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-6 tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>
              SEND US A MESSAGE
            </h2>
            <p className="text-base text-gray-400 max-w-xl mx-auto" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Tell us about your vision and we'll get back to you with a personalized response
            </p>
          </div>

          <div className="bg-white p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-black mb-3 tracking-widest uppercase">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-black/20 bg-transparent focus:border-black transition-all duration-300 text-black"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-black mb-3 tracking-widest uppercase">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-black/20 bg-transparent focus:border-black transition-all duration-300 text-black"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-bold text-black mb-3 tracking-widest uppercase">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-black/20 bg-transparent focus:border-black transition-all duration-300 text-black"
                >
                  <option value="">Select a subject</option>
                  <option value="custom-order">Custom Order</option>
                  <option value="bridal">Bridal Collection</option>
                  <option value="alterations">Alterations</option>
                  <option value="consultation">Consultation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-black mb-3 tracking-widest uppercase">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-black/20 bg-transparent focus:border-black transition-all duration-300 text-black resize-none"
                  placeholder="Tell us about your vision..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white font-bold py-4 tracking-widest uppercase text-sm hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-black font-bold mb-6 tracking-wider" style={{ fontFamily: '"Playfair Display", serif' }}>
            READY TO START?
          </h2>
          <p className="text-base text-gray-500 mb-12 max-w-xl mx-auto" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Let's discuss your vision over a personal consultation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${contact.phone}`} className="bg-black text-white px-8 py-4 font-bold tracking-widest uppercase text-sm hover:bg-gray-800 transition-all duration-300">
              Call Now
            </a>
            <a href={`mailto:${contact.email}`} className="border border-black text-black px-8 py-4 font-bold tracking-widest uppercase text-sm hover:bg-black hover:text-white transition-all duration-300">
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}