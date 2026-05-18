"use client";

import { Building2, Zap, Users, TrendingUp, Shield, BarChart3 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Company() {
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
              Dark Innovative
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-slate-300 mb-3 md:mb-4 leading-relaxed">
              Leading the transformation in construction and fleet management
            </p>
            <p className="text-base md:text-lg text-slate-400 leading-relaxed">
              Through intelligent real-time tracking and innovative solutions
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview Stats with Grid Background */}
      <section className="py-24 bg-gradient-to-b from-slate-900/80 to-slate-900 relative overflow-hidden">
        {/* Grid Background Layers */}
        <div className="absolute inset-0 opacity-5">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="smallDotsCompany" x="10mm" y="5mm" width="10mm" height="5mm" patternUnits="userSpaceOnUse">
                <circle cx="5mm" cy="2.5mm" r="0.5mm" fill="currentColor" className="text-cyan-400" />
              </pattern>
              <pattern id="mediumGridCompany" x="2cm" y="2cm" width="2cm" height="2cm" patternUnits="userSpaceOnUse">
                <path d="M 2cm 0 L 0 0 0 2cm" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-400" />
              </pattern>
              <pattern id="largeGridCompany" x="1.5in" y="1.5in" width="1.5in" height="1.5in" patternUnits="userSpaceOnUse">
                <rect width="1.5in" height="1.5in" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallDotsCompany)" />
            <rect width="100%" height="100%" fill="url(#mediumGridCompany)" />
            <rect width="100%" height="100%" fill="url(#largeGridCompany)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-fadeInUp">Company Overview</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">Trusted by industry leaders worldwide</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Year Established */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-cyan-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-lg p-4 mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                <Building2 className="text-cyan-400" size={32} />
              </div>
              <div className="text-4xl font-bold text-cyan-300 mb-2">2024</div>
              <p className="text-slate-400">Year Established</p>
            </div>

            {/* Team Members */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-green-500/20 rounded-xl p-6 hover:border-green-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-green-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg p-4 mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                <Users className="text-green-400" size={32} />
              </div>
              <div className="text-4xl font-bold text-green-300 mb-2">50+</div>
              <p className="text-slate-400">Team Members</p>
            </div>

            {/* Active Clients */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-purple-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg p-4 mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="text-purple-400" size={32} />
              </div>
              <div className="text-4xl font-bold text-purple-300 mb-2">100+</div>
              <p className="text-slate-400">Active Clients</p>
            </div>

            {/* Headquarters */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-yellow-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-lg p-4 mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                <Building2 className="text-yellow-400" size={32} />
              </div>
              <div className="text-4xl font-bold text-yellow-300 mb-2">NYC</div>
              <p className="text-slate-400">Headquarters</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-900/50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-fadeInUp">Our Services</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">Comprehensive solutions for modern business needs</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Construction Site Tracking */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-cyan-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-lg p-4 mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                <Building2 className="text-cyan-400" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300 group-hover:text-cyan-200 transition-colors">Construction Site Tracking</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                Real-time monitoring and management of construction sites with GPS tracking and project management.
              </p>
            </div>

            {/* Fleet Management */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-green-500/20 rounded-xl p-6 hover:border-green-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-green-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg p-4 mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                <Zap className="text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-green-300 group-hover:text-green-200 transition-colors">Fleet Management</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                Comprehensive vehicle fleet tracking with gate passes, entry/exit monitoring, and driver management.
              </p>
            </div>

            {/* Employee Tracking */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-purple-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg p-4 mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                <Users className="text-purple-400" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-purple-300 group-hover:text-purple-200 transition-colors">Employee Tracking</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                Complete employee management system with check-in/out, location tracking, and attendance records.
              </p>
            </div>

            {/* Traffic Analytics */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-yellow-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-lg p-4 mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="text-yellow-400" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-yellow-300 group-hover:text-yellow-200 transition-colors">Traffic Analytics</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                Advanced traffic monitoring with vehicle counting, congestion analysis, and speed monitoring.
              </p>
            </div>

            {/* Security & Compliance */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-pink-500/20 rounded-xl p-6 hover:border-pink-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-pink-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 rounded-lg p-4 mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                <Shield className="text-pink-400" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-pink-300 group-hover:text-pink-200 transition-colors">Security & Compliance</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                Enterprise-grade security with role-based access, data encryption, and compliance management.
              </p>
            </div>

            {/* Analytics & Reporting */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-indigo-500/20 rounded-xl p-6 hover:border-indigo-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-indigo-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 rounded-lg p-4 mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="text-indigo-400" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-indigo-300 group-hover:text-indigo-200 transition-colors">Analytics & Reporting</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                Comprehensive dashboards and reports for performance analysis and decision making.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-black border-t border-slate-800/50 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: "2s"}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Strategic Partnerships</h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Dark Innovative partners with leading construction companies and fleet operators worldwide. We provide training, support, and continuous optimization to ensure maximum ROI from our platform.
            </p>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Interested in partnership opportunities? Our dedicated partnership team is ready to help.
            </p>
            <a href="mailto:partnerships@darkinnovative.com" className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 inline-flex">
              Become A Partner
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
