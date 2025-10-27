import React, { useState } from "react";
import { APP_DATA } from "../data/ConstantValues";

export default function Contact() {
  const contact = APP_DATA.contact;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send to API)
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-black-silk py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gold-500 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Have questions about our collections, custom orders, or need
            assistance? We're here to help bring your fashion vision to life.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-black-silk mb-8">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold-500 text-black font-semibold py-3 px-6 rounded-lg hover:bg-gold-600 transition-colors duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-black-silk mb-8">
                Get in Touch
              </h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-envelope text-black"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black-silk">Email</h3>
                    <p className="text-gray-600">{contact.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-phone text-black"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black-silk">Phone</h3>
                    <p className="text-gray-600">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-map-marker-alt text-black"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black-silk">Address</h3>
                    <p className="text-gray-600">{contact.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-clock text-black"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black-silk">
                      Business Hours
                    </h3>
                    <p className="text-gray-600">{contact.hours}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-12">
                <h3 className="text-xl font-serif font-bold text-black-silk mb-6">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  {contact.social.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gold-500 hover:text-white transition-colors duration-300"
                    >
                      <i className={`${social.icon}`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-silk py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-black-silk mb-4">
            Need Immediate Assistance?
          </h2>
          <p className="text-gray-600 mb-8">
            Our customer service team is ready to help. Call us directly for
            quick support.
          </p>
          <a
            href={`tel:${contact.phone}`}
            className="inline-flex items-center space-x-2 bg-gold-500 text-black font-semibold py-3 px-8 rounded-lg hover:bg-gold-600 transition-colors duration-300"
          >
            <i className="fas fa-phone"></i>
            <span>Call Now: {contact.phone}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
