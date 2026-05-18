"use client";

import { Award, Target, Zap, CheckCircle2, Users, Shield, Smartphone, Globe, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
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
              About Dark Innovative
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-slate-300 mb-3 md:mb-4 leading-relaxed">
              Revolutionizing construction and fleet management
            </p>
            <p className="text-base md:text-lg text-slate-400 leading-relaxed">
              Through intelligent real-time tracking technology and innovative solutions
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section with Grid Background */}
      <section className="py-24 bg-gradient-to-b from-slate-900/80 to-slate-900 relative overflow-hidden">
        {/* Grid Background Layers */}
        <div className="absolute inset-0 opacity-5">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="smallDots2" x="10mm" y="5mm" width="10mm" height="5mm" patternUnits="userSpaceOnUse">
                <circle cx="5mm" cy="2.5mm" r="0.5mm" fill="currentColor" className="text-cyan-400" />
              </pattern>
              <pattern id="mediumGrid2" x="2cm" y="2cm" width="2cm" height="2cm" patternUnits="userSpaceOnUse">
                <path d="M 2cm 0 L 0 0 0 2cm" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-400" />
              </pattern>
              <pattern id="largeGrid2" x="1.5in" y="1.5in" width="1.5in" height="1.5in" patternUnits="userSpaceOnUse">
                <rect width="1.5in" height="1.5in" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallDots2)" />
            <rect width="100%" height="100%" fill="url(#mediumGrid2)" />
            <rect width="100%" height="100%" fill="url(#largeGrid2)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-fadeInUp">Our Mission & Vision</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">Leading the revolution in real-time tracking and intelligence</p>
          </div>

          <div className="relative w-full max-w-4xl mx-auto h-[600px] mb-16">
            {/* SVG Tree Structure */}
            <svg className="absolute inset-0 w-full h-full" style={{pointerEvents: 'none'}}>
              {/* Main trunk */}
              <line x1="50%" y1="10%" x2="50%" y2="50%" stroke="#06b6d4" strokeWidth="3" opacity="0.3" />
              
              {/* Branch to Mission */}
              <line x1="50%" y1="15%" x2="50%" y2="15%" stroke="#06b6d4" strokeWidth="2" opacity="0.2" />
              
              {/* Branches to Vision below */}
              <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="#a78bfa" strokeWidth="2" opacity="0.3" />
              <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="#a78bfa" strokeWidth="2" opacity="0.3" />
            </svg>

            {/* Mission - Root/Top of Tree */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 group cursor-pointer z-10">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-8 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/30 group-hover:scale-105 transform">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 rounded-xl p-4 mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                    <Target className="text-cyan-400 group-hover:text-cyan-300" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-cyan-400 group-hover:text-cyan-300 transition-colors">Our Mission</h3>
                  <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                    Dark Innovative is dedicated to revolutionizing construction site and fleet management through cutting-edge real-time tracking technology.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision - Left Branch */}
            <div className="absolute bottom-0 left-0 w-80 group cursor-pointer z-10">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 group-hover:scale-105 transform">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-xl p-4 mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                    <Award className="text-purple-400 group-hover:text-purple-300" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-purple-400 group-hover:text-purple-300 transition-colors">Our Vision</h3>
                  <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                    To become the leading provider of intelligent fleet and construction management solutions globally.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Values - Right Branch */}
            <div className="absolute bottom-0 right-0 w-80 group cursor-pointer z-10">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-8 rounded-2xl border border-pink-500/20 hover:border-pink-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/30 group-hover:scale-105 transform">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-pink-500/20 to-pink-500/5 rounded-xl p-4 mb-4 inline-block group-hover:scale-110 transition-transform duration-300">
                    <Zap className="text-pink-400 group-hover:text-pink-300" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-pink-400 group-hover:text-pink-300 transition-colors">Our Values</h3>
                  <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                    Innovation, integrity, and excellence in everything we create for our clients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section with Grid Background */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-900/50 relative overflow-hidden">
        {/* Grid Background Layers */}
        <div className="absolute inset-0 opacity-5">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="smallDots3" x="10mm" y="5mm" width="10mm" height="5mm" patternUnits="userSpaceOnUse">
                <circle cx="5mm" cy="2.5mm" r="0.5mm" fill="currentColor" className="text-green-400" />
              </pattern>
              <pattern id="mediumGrid3" x="2cm" y="2cm" width="2cm" height="2cm" patternUnits="userSpaceOnUse">
                <path d="M 2cm 0 L 0 0 0 2cm" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-400" />
              </pattern>
              <pattern id="largeGrid3" x="1.5in" y="1.5in" width="1.5in" height="1.5in" patternUnits="userSpaceOnUse">
                <rect width="1.5in" height="1.5in" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallDots3)" />
            <rect width="100%" height="100%" fill="url(#mediumGrid3)" />
            <rect width="100%" height="100%" fill="url(#largeGrid3)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-fadeInUp">Why Choose Us?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">Industry-leading solutions with proven results</p>
          </div>

          <div className="relative w-full max-w-6xl mx-auto h-[800px]">
            {/* SVG Connector Lines */}
            <svg className="absolute inset-0 w-full h-full" style={{pointerEvents: 'none'}}>
              <defs>
                <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="lineGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#f87171" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="lineGrad4" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="lineGrad5" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="lineGrad6" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              {/* Lines from center to items */}
              <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="url(#lineGrad1)" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="url(#lineGrad2)" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="url(#lineGrad3)" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="url(#lineGrad4)" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="url(#lineGrad5)" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="50%" y1="50%" x2="15%" y2="50%" stroke="url(#lineGrad6)" strokeWidth="2" strokeDasharray="5,5" />
            </svg>

            {/* Center Hub Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-32 h-32 bg-gradient-to-br from-slate-700/80 to-slate-800/80 rounded-full border-2 border-cyan-500/60 shadow-2xl shadow-cyan-500/50 flex items-center justify-center animate-pulse">
                <div className="bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-full p-6">
                  <Zap className="text-cyan-300" size={64} />
                </div>
              </div>
            </div>

            {/* Item 1 - Top Left: Real-Time Tracking */}
            <div className="absolute top-0 left-0 w-1/3 p-4 group cursor-pointer">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-green-500/20 hover:border-green-500/60 transition-all duration-500 hover:shadow-xl hover:shadow-green-500/30 group-hover:scale-105 transform">
                <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-lg p-3 mb-3 inline-block group-hover:scale-110 transition-transform duration-300">
                  <Zap className="text-green-400" size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-green-400 group-hover:text-green-300">Real-Time Tracking</h3>
                <p className="text-sm text-slate-400 group-hover:text-slate-300">Monitor assets instantly</p>
              </div>
            </div>

            {/* Item 2 - Top Right: Easy Integration */}
            <div className="absolute top-0 right-0 w-1/3 p-4 group cursor-pointer">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/60 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/30 group-hover:scale-105 transform">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-lg p-3 mb-3 inline-block group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="text-blue-400" size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-blue-400 group-hover:text-blue-300">Easy Integration</h3>
                <p className="text-sm text-slate-400 group-hover:text-slate-300">Seamless workflow</p>
              </div>
            </div>

            {/* Item 3 - Middle Right: Scalable Solution */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/4 p-4 group cursor-pointer">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-yellow-500/20 hover:border-yellow-500/60 transition-all duration-500 hover:shadow-xl hover:shadow-yellow-500/30 group-hover:scale-105 transform">
                <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 rounded-lg p-3 mb-3 inline-block group-hover:scale-110 transition-transform duration-300">
                  <Award className="text-yellow-400" size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-yellow-400 group-hover:text-yellow-300">Scalable</h3>
                <p className="text-sm text-slate-400 group-hover:text-slate-300">Enterprise scale</p>
              </div>
            </div>

            {/* Item 4 - Bottom Right: Secure & Reliable */}
            <div className="absolute bottom-0 right-0 w-1/3 p-4 group cursor-pointer">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-red-500/20 hover:border-red-500/60 transition-all duration-500 hover:shadow-xl hover:shadow-red-500/30 group-hover:scale-105 transform">
                <div className="bg-gradient-to-br from-red-500/20 to-red-500/5 rounded-lg p-3 mb-3 inline-block group-hover:scale-110 transition-transform duration-300">
                  <Shield className="text-red-400" size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-red-400 group-hover:text-red-300">Secure & Reliable</h3>
                <p className="text-sm text-slate-400 group-hover:text-slate-300">Enterprise security</p>
              </div>
            </div>

            {/* Item 5 - Bottom Left: Expert Team */}
            <div className="absolute bottom-0 left-0 w-1/3 p-4 group cursor-pointer">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-pink-500/20 hover:border-pink-500/60 transition-all duration-500 hover:shadow-xl hover:shadow-pink-500/30 group-hover:scale-105 transform">
                <div className="bg-gradient-to-br from-pink-500/20 to-pink-500/5 rounded-lg p-3 mb-3 inline-block group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-pink-400" size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-pink-400 group-hover:text-pink-300">Expert Team</h3>
                <p className="text-sm text-slate-400 group-hover:text-slate-300">24/7 Support</p>
              </div>
            </div>

            {/* Item 6 - Middle Left: Continuous Innovation */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1/4 p-4 group cursor-pointer">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-violet-500/20 hover:border-violet-500/60 transition-all duration-500 hover:shadow-xl hover:shadow-violet-500/30 group-hover:scale-105 transform">
                <div className="bg-gradient-to-br from-violet-500/20 to-violet-500/5 rounded-lg p-3 mb-3 inline-block group-hover:scale-110 transition-transform duration-300">
                  <Zap className="text-violet-400" size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-violet-400 group-hover:text-violet-300">Innovation</h3>
                <p className="text-sm text-slate-400 group-hover:text-slate-300">Ahead of curve</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Breakdown Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-black border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">Comprehensive Surveillance Suite</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Everything you need for enterprise-grade monitoring and detection</p>
          </div>

          {/* Features Grid - 2x3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Real-Time Detection */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-cyan-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/40 flex items-center justify-center">
                  <Smartphone className="text-cyan-400" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cyan-300 mb-1">Real-Time Detection</h3>
                  <p className="text-xs text-slate-400">AI-Powered instant recognition</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">Advanced ML algorithms detect and track people, vehicles, and custom objects with sub-second latency. Supports person re-identification, face detection, and behavioral anomalies across multiple continuous feeds.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-cyan-500/60 rounded-full"></div>
                  <span>99.7% accuracy rate</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-cyan-500/60 rounded-full"></div>
                  <span>&lt;100ms processing time per frame</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-cyan-500/60 rounded-full"></div>
                  <span>Detects 50+ object classes</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-cyan-500/60 rounded-full"></div>
                  <span>Cross-camera tracking enabled</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-cyan-500/60 rounded-full"></div>
                  <span>Customizable event triggers</span>
                </div>
              </div>
            </div>

            {/* Feature 2: Performance */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-green-500/20 rounded-xl p-6 hover:border-green-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-green-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/40 flex items-center justify-center">
                  <Zap className="text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-300 mb-1">Lightning Performance</h3>
                  <p className="text-xs text-slate-400">Ultra-fast, redundant infrastructure</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">Built on distributed cloud infrastructure with edge processing. Handle 1000+ concurrent 4K streams with intelligent load balancing and failover protection.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-green-500/60 rounded-full"></div>
                  <span>99.99% uptime SLA with redundancy</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-green-500/60 rounded-full"></div>
                  <span>Auto-scaling based on demand</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-green-500/60 rounded-full"></div>
                  <span>&lt;50ms latency edge processing</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-green-500/60 rounded-full"></div>
                  <span>Multi-region deployment</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-green-500/60 rounded-full"></div>
                  <span>GPU-accelerated processing</span>
                </div>
              </div>
            </div>

            {/* Feature 3: Multi-Camera */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-purple-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/40 flex items-center justify-center">
                  <Globe className="text-purple-400" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-300 mb-1">Multi-Camera Support</h3>
                  <p className="text-xs text-slate-400">Enterprise-scale unified control</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">Manage unlimited camera feeds from a single intuitive dashboard. Supports legacy and modern systems with automatic discovery, group management, and synchronized PTZ controls.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-purple-500/60 rounded-full"></div>
                  <span>200+ compatible camera brands</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-purple-500/60 rounded-full"></div>
                  <span>RTSP, ONVIF, HTTP protocols</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-purple-500/60 rounded-full"></div>
                  <span>PTZ (Pan/Tilt/Zoom) automation</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-purple-500/60 rounded-full"></div>
                  <span>Automatic device discovery</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-purple-500/60 rounded-full"></div>
                  <span>Advanced grouping & presets</span>
                </div>
              </div>
            </div>

            {/* Feature 4: Analytics */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-yellow-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/40 flex items-center justify-center">
                  <TrendingUp className="text-yellow-400" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-yellow-300 mb-1">Advanced Analytics</h3>
                  <p className="text-xs text-slate-400">AI-powered business intelligence</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">Transform surveillance data into actionable insights with intelligent heatmaps, crowd metrics, and behavioral pattern analysis. Real-time dashboards with predictive analytics.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-yellow-500/60 rounded-full"></div>
                  <span>Real-time heatmaps & footfall</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-yellow-500/60 rounded-full"></div>
                  <span>Crowd density analysis</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-yellow-500/60 rounded-full"></div>
                  <span>Customizable dashboard widgets</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-yellow-500/60 rounded-full"></div>
                  <span>Scheduled & on-demand reports</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-yellow-500/60 rounded-full"></div>
                  <span>Anomaly detection & alerts</span>
                </div>
              </div>
            </div>

            {/* Feature 5: Security */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-pink-500/20 rounded-xl p-6 hover:border-pink-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-pink-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/40 flex items-center justify-center">
                  <span className="text-pink-400 text-xl">🔒</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-pink-300 mb-1">Enterprise Security</h3>
                  <p className="text-xs text-slate-400">Zero-trust architecture</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">Military-grade encryption with zero-trust architecture. Fully compliant with GDPR, HIPAA, SOC 2, and ISO 27001. Audit trails and comprehensive access logs.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-pink-500/60 rounded-full"></div>
                  <span>AES-256 end-to-end encryption</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-pink-500/60 rounded-full"></div>
                  <span>Multi-factor authentication</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-pink-500/60 rounded-full"></div>
                  <span>RBAC with granular permissions</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-pink-500/60 rounded-full"></div>
                  <span>Complete audit & activity logs</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-pink-500/60 rounded-full"></div>
                  <span>DLP & data retention controls</span>
                </div>
              </div>
            </div>

            {/* Feature 6: Integration */}
            <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/80 border border-indigo-500/20 rounded-xl p-6 hover:border-indigo-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
              <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-indigo-500 to-transparent rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/40 flex items-center justify-center">
                  <span className="text-indigo-400 text-xl">⚙️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-indigo-300 mb-1">Seamless Integration</h3>
                  <p className="text-xs text-slate-400">Connect entire ecosystem</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">Comprehensive API-first architecture with webhooks, SDKs, and plugin framework. Connect to SIEM, alerting, ticketing, and business intelligence systems effortlessly.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-indigo-500/60 rounded-full"></div>
                  <span>RESTful & WebSocket APIs</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-indigo-500/60 rounded-full"></div>
                  <span>100+ pre-built integrations</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-indigo-500/60 rounded-full"></div>
                  <span>Custom plugin framework</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-indigo-500/60 rounded-full"></div>
                  <span>Webhook events & automation</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1 h-1 bg-indigo-500/60 rounded-full"></div>
                  <span>SDK support (Python, JS, Go)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-slate-400 mb-6">Ready to upgrade your security infrastructure?</p>
            <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105">
              Get Started Today
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
