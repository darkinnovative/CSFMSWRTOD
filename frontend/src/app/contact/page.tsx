"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
      <Header />
      {/* Hero Section - Simple with gradient */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-black text-white relative overflow-hidden">
        <div className="absolute top-20 right-20 w-52 md:w-96 h-52 md:h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-52 md:w-96 h-52 md:h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: "2s"}}></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Get In Touch
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-slate-300 mb-4 md:mb-4 leading-relaxed">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            <p className="text-lg text-slate-400 leading-relaxed">
              Contact us for any inquiries about our surveillance and tracking solutions
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section with Grid Background */}
      <section className="py-24 bg-gradient-to-b from-slate-900/80 to-slate-900 relative overflow-hidden">
        {/* Grid Background Layers */}
        <div className="absolute inset-0 opacity-5">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="smallDotsContact" x="10mm" y="5mm" width="10mm" height="5mm" patternUnits="userSpaceOnUse">
                <circle cx="5mm" cy="2.5mm" r="0.5mm" fill="currentColor" className="text-cyan-400" />
              </pattern>
              <pattern id="mediumGridContact" x="2cm" y="2cm" width="2cm" height="2cm" patternUnits="userSpaceOnUse">
                <path d="M 2cm 0 L 0 0 0 2cm" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-400" />
              </pattern>
              <pattern id="largeGridContact" x="1.5in" y="1.5in" width="1.5in" height="1.5in" patternUnits="userSpaceOnUse">
                <rect width="1.5in" height="1.5in" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallDotsContact)" />
            <rect width="100%" height="100%" fill="url(#mediumGridContact)" />
            <rect width="100%" height="100%" fill="url(#largeGridContact)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-fadeInUp">Contact Information</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">Reach out to us through any of these channels</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Email */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-cyan-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-lg p-4 mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                <Mail className="text-cyan-400" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-cyan-300 group-hover:text-cyan-200 transition-colors">Email</h3>
              <p className="text-xs text-slate-400 mb-3">Send us an email anytime</p>
              <a href="mailto:support@darkinnovative.com" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                support@darkinnovative.com
              </a>
            </div>

            {/* Phone */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-green-500/20 rounded-xl p-6 hover:border-green-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-green-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg p-4 mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                <Phone className="text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-green-300 group-hover:text-green-200 transition-colors">Phone</h3>
              <p className="text-xs text-slate-400 mb-3">Call us during business hours</p>
              <a href="tel:+912914017772" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
                +912914017772
              </a>
            </div>

            {/* Location */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-purple-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg p-4 mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                <MapPin className="text-purple-400" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-purple-300 group-hover:text-purple-200 transition-colors">Location</h3>
              <p className="text-xs text-slate-400 mb-3">Visit our headquarters</p>
              <p className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Jodhpur, Rajasthan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-black relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12 animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Send us a Message</h2>
            <p className="text-slate-400">We'll get back to you within 24 hours</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-slideInUp">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Your message here..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition resize-none"
              ></textarea>
            </div>

            <button className="w-full px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
              <Send size={20} />
              Send Message
            </button>
            {submitted && (
              <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-lg text-green-300 text-center font-semibold animate-fadeInUp">
                ✓ Message sent successfully! We'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
