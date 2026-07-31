import React, { useState } from "react";
import { APP_DATA } from "../data/ConstantValues";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
} from "react-icons/fa";
import contactHero from "../assets/contactus.jpg";

const socialIcons = {
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
  Twitter: FaTwitter,
};

export default function Contact() {
  const contact = APP_DATA.contact;
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
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
    { icon: FaEnvelope, title: "Email Us", detail: contact.email, action: `mailto:${contact.email}` },
    { icon: FaPhoneAlt, title: "Call Us", detail: contact.phone, action: `tel:${contact.phone}` },
    { icon: FaMapMarkerAlt, title: "Visit Us", detail: contact.address, action: "#" },
    { icon: FaClock, title: "Business Hours", detail: contact.hours, action: "#" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[calc(100vh-3.5rem)] min-h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${contactHero})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <span className="text-gold-500 text-xs font-semibold tracking-[0.25em] uppercase mb-3 block">
            Get in Touch
          </span>
          <h1 className="text-3xl md:text-5xl font-serif text-white leading-tight mb-3">
            Let's Create Together
          </h1>
          <p className="text-white/70 text-sm max-w-md leading-relaxed">
            Ready to bring your vision to life? We're here to help with every step of your bespoke fashion journey.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactMethods.map((method, i) => {
              const Icon = method.icon;
              return (
                <a key={i} href={method.action} className="group p-5 rounded-xl border border-black/5 hover:border-gold-500/30 hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center mb-3 group-hover:bg-gold-500/20 transition-colors">
                    <Icon className="text-gold-500 text-sm" />
                  </div>
                  <h3 className="font-semibold text-black text-sm mb-1">{method.title}</h3>
                  <p className="text-black/40 text-xs leading-relaxed">{method.detail}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section id="contact-form" className="py-12 md:py-16 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
            {/* Left Info */}
            <div className="lg:col-span-2">
              <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">Contact Info</span>
              <h2 className="text-2xl md:text-3xl font-serif text-white mt-2 mb-4">Send Us a Message</h2>
              <p className="text-white/40 text-xs leading-relaxed mb-8">
                Tell us about your vision and we'll get back to you within 24 hours.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: FaEnvelope, label: contact.email, href: `mailto:${contact.email}` },
                  { icon: FaPhoneAlt, label: contact.phone, href: `tel:${contact.phone}` },
                  { icon: FaMapMarkerAlt, label: contact.address, href: "#" },
                  { icon: FaClock, label: contact.hours, href: "#" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <a key={i} href={item.href} className="flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/10 transition-colors">
                        <Icon className="text-gold-500 text-xs" />
                      </div>
                      <span className="text-white/50 text-xs leading-relaxed pt-1.5 group-hover:text-white/70 transition-colors">
                        {item.label}
                      </span>
                    </a>
                  );
                })}
              </div>

              {/* Social */}
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Follow Us</p>
                <div className="flex gap-2">
                  {contact.social.map((s, i) => {
                    const Icon = socialIcons[s.platform] || FaInstagram;
                    return (
                      <a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:bg-gold-500/10 hover:text-gold-500 transition-all duration-200"
                      >
                        <Icon className="text-xs" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] text-white/35 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold-500/40 transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/35 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold-500/40 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-white/35 uppercase tracking-wider mb-1.5">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-500/40 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-black text-white/40">Select a subject</option>
                    <option value="custom-order" className="bg-black text-white">Custom Order Inquiry</option>
                    <option value="bridal" className="bg-black text-white">Bridal Collection</option>
                    <option value="alterations" className="bg-black text-white">Alterations & Restyling</option>
                    <option value="consultation" className="bg-black text-white">Design Consultation</option>
                    <option value="other" className="bg-black text-white">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-white/35 uppercase tracking-wider mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold-500/40 transition-all resize-none"
                    placeholder="Tell us about your vision, requirements, and timeline..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold-500 text-black font-semibold py-3 px-6 rounded-lg text-sm hover:bg-gold-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="text-xs" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-black mb-3">Ready to Start Your Journey?</h2>
          <p className="text-black/45 text-sm max-w-md mx-auto leading-relaxed mb-8">
            From concept to creation, we're here to make your fashion dreams a reality.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-black/50 hover:text-gold-500 transition-colors">
              <FaPhoneAlt className="text-gold-500" />
              {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-black/50 hover:text-gold-500 transition-colors">
              <FaEnvelope className="text-gold-500" />
              {contact.email}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
