"use client";

import React from "react";
import { Zap, Globe, Smartphone, TrendingUp, Wind } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SlideShow from "@/components/SlideShow";

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Hero Section with Full Width SlideShow - extends behind header */}
      <section className="relative w-full h-screen">
        <SlideShow fullWidth={true} />
        {/* Header positioned on top */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <Header />
        </div>
      </section>

      {/* Features Section with Grid Background */}
      <section className="py-24 bg-gradient-to-b from-slate-900/80 to-slate-900 relative overflow-hidden">
        {/* Grid Background Layers */}
        <div className="absolute inset-0 opacity-5">
          {/* 10mm X 5mm small dots grid */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="smallDots" x="10mm" y="5mm" width="10mm" height="5mm" patternUnits="userSpaceOnUse">
                <circle cx="5mm" cy="2.5mm" r="0.5mm" fill="currentColor" className="text-cyan-400" />
              </pattern>
              <pattern id="mediumGrid" x="2cm" y="2cm" width="2cm" height="2cm" patternUnits="userSpaceOnUse">
                <path d="M 2cm 0 L 0 0 0 2cm" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-400" />
              </pattern>
              <pattern id="largeGrid" x="1.5in" y="1.5in" width="1.5in" height="1.5in" patternUnits="userSpaceOnUse">
                <rect width="1.5in" height="1.5in" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallDots)" />
            <rect width="100%" height="100%" fill="url(#mediumGrid)" />
            <rect width="100%" height="100%" fill="url(#largeGrid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-fadeInUp">Key Features</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto">Powerful tools designed for modern operations and real-time intelligence</p>
          </div>

          {/* Desktop Layout - Hidden on mobile */}
          <div className="hidden lg:flex relative w-full max-w-7xl mx-auto h-[900px] items-center justify-between gap-8">
            {/* Left Side - Big CCTV Camera */}
            <div className="relative w-1/4 h-full flex items-center justify-center z-10">
              {/* Camera Body */}
              <div className="relative">
                {/* Main Camera Lens - Animated - Much Bigger */}
                <div className="w-56 h-56 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full border-4 border-cyan-500/60 shadow-2xl shadow-cyan-500/50 flex items-center justify-center animate-pulse">
                  {/* Inner Lens */}
                  <div className="w-44 h-44 bg-gradient-to-br from-slate-800 to-black rounded-full border-3 border-cyan-400/40 flex items-center justify-center">
                    {/* Lens reflection */}
                    <div className="w-32 h-32 bg-gradient-radial from-cyan-500/40 to-transparent rounded-full"></div>
                  </div>
                </div>
                
                {/* Camera Mount */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-20 h-10 bg-gradient-to-b from-slate-600 to-slate-800 rounded-b-lg border border-slate-500/50"></div>

                {/* Scanning Lines Animation */}
                <svg className="absolute inset-0 w-56 h-56" style={{pointerEvents: 'none'}}>
                  <line x1="15%" y1="50%" x2="85%" y2="50%" stroke="#06b6d4" strokeWidth="2" opacity="0.6" className="animate-pulse" />
                  <line x1="50%" y1="15%" x2="50%" y2="85%" stroke="#06b6d4" strokeWidth="2" opacity="0.6" className="animate-pulse" style={{animationDelay: '0.2s'}} />
                  <circle cx="50%" cy="50%" r="25%" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.4" className="animate-pulse" style={{animationDelay: '0.4s'}} />
                  <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.2" strokeDasharray="5,5" className="animate-pulse" style={{animationDelay: '0.6s'}} />
                </svg>
              </div>
            </div>

            {/* Center - Features in Circular Arc */}
            <div className="relative w-3/4 h-full">
              {/* Guidance Dotted Lines SVG */}
              <svg className="absolute inset-0 w-full h-full" style={{pointerEvents: 'none', zIndex: '5'}}>
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Dotted line from first item (top) to camera */}
                <line x1="50%" y1="0%" x2="-20%" y2="50%" stroke="#06b6d4" strokeWidth="2" opacity="0.3" strokeDasharray="8,6" />
                {/* Dotted line from last item (bottom) connecting */}
                <line x1="50%" y1="100%" x2="-20%" y2="50%" stroke="#3b82f6" strokeWidth="2" opacity="0.3" strokeDasharray="8,6" />
                {/* Center circle indicator */}
                <circle cx="50%" cy="50%" r="8%" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.2" strokeDasharray="3,3" />
              </svg>

              {/* Feature 1: Real-Time Tracking - Top (LARGE CARD) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 group cursor-pointer z-20 hover:z-30">
                <div className="relative">
                  <div className="absolute -inset-12 border-2 border-green-500/0 group-hover:border-green-500/70 rounded-2xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/30"></div>
                  
                  <div className="w-40 h-52 bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-2xl border-2 border-cyan-500/40 group-hover:border-cyan-500/80 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-8 transform flex flex-col items-center justify-center relative overflow-hidden p-4">
                    {/* Corner decorations */}
                    <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-400/40 group-hover:border-cyan-400/80 rounded-tl transition-all duration-300\"></div>
                    <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-400/40 group-hover:border-cyan-400/80 rounded-tr transition-all duration-300\"></div>
                    <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyan-400/40 group-hover:border-cyan-400/80 rounded-bl transition-all duration-300\"></div>
                    <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-400/40 group-hover:border-cyan-400/80 rounded-br transition-all duration-300\"></div>
                    
                    {/* Animated scanlines */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/30 via-transparent to-cyan-500/30 rounded-2xl\"></div>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl\"></div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center text-center gap-3">
                      <Smartphone className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300\" size={32} />
                      <div>
                        <h3 className="text-lg font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300\">Real-Time Tracking</h3>
                        <p className="text-xs text-slate-400 mt-1\">AI-Powered detection</p>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1 mt-2\">
                        <div>• 99.7% accuracy</div>
                        <div>• &lt;100ms latency</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2: Fast Performance - Top Right (LARGE CARD) */}
              <div className="absolute top-8 right-6 group cursor-pointer z-20 hover:z-30">
                <div className="relative">
                  <div className="absolute -inset-12 border-2 border-green-500/0 group-hover:border-green-500/70 rounded-2xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/30"></div>
                  
                  <div className="w-40 h-52 bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-2xl border-2 border-green-500/40 group-hover:border-green-500/80 shadow-xl hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-500 group-hover:scale-110 group-hover:translate-x-8 group-hover:-translate-y-6 transform flex flex-col items-center justify-center relative overflow-hidden p-4">
                    {/* Corner decorations */}
                    <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-green-400/40 group-hover:border-green-400/80 rounded-tl transition-all duration-300"></div>
                    <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-green-400/40 group-hover:border-green-400/80 rounded-tr transition-all duration-300"></div>
                    <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-green-400/40 group-hover:border-green-400/80 rounded-bl transition-all duration-300"></div>
                    <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-green-400/40 group-hover:border-green-400/80 rounded-br transition-all duration-300"></div>
                    
                    {/* Animated pulse ring */}
                    <div className="absolute inset-1 border border-green-500/20 group-hover:border-green-500/50 rounded-xl transition-all duration-300 animate-pulse"></div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center text-center gap-3">
                      <Zap className="text-green-400 group-hover:text-green-300 transition-colors duration-300" size={32} />
                      <div>
                        <h3 className="text-lg font-bold text-green-300 group-hover:text-green-200 transition-colors duration-300">Fast Performance</h3>
                        <p className="text-xs text-slate-400 mt-1">Ultra-optimized</p>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1 mt-2">
                        <div>• 99.9% uptime</div>
                        <div>• Auto-scaling</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3: Multi-Camera Support - Right (LARGE CARD) */}
              <div className="absolute top-1/2 -translate-y-1/2 right-8 group cursor-pointer z-20 hover:z-30">
                <div className="relative">
                  <div className="absolute -inset-12 border-2 border-green-500/0 group-hover:border-green-500/70 rounded-2xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/30"></div>
                  
                  <div className="w-40 h-52 bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-2xl border-2 border-purple-500/40 group-hover:border-purple-500/80 shadow-xl hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-500 group-hover:scale-110 group-hover:translate-x-8 transform flex flex-col items-center justify-center relative overflow-hidden p-4">
                    {/* Corner decorations */}
                    <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-purple-400/40 group-hover:border-purple-400/80 rounded-tl transition-all duration-300"></div>
                    <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-purple-400/40 group-hover:border-purple-400/80 rounded-tr transition-all duration-300"></div>
                    <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-purple-400/40 group-hover:border-purple-400/80 rounded-bl transition-all duration-300"></div>
                    <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-purple-400/40 group-hover:border-purple-400/80 rounded-br transition-all duration-300"></div>
                    
                    {/* Center dot indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-1 h-1 bg-purple-400/60 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center text-center gap-3">
                      <Globe className="text-purple-400 group-hover:text-purple-300 transition-colors duration-300" size={32} />
                      <div>
                        <h3 className="text-lg font-bold text-purple-300 group-hover:text-purple-200 transition-colors duration-300">Multi-Camera</h3>
                        <p className="text-xs text-slate-400 mt-1">Unified control</p>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1 mt-2">
                        <div>• 200+ brands</div>
                        <div>• RTSP/ONVIF</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 4: Analytics - Bottom Right (LARGE CARD) */}
              <div className="absolute bottom-8 right-6 group cursor-pointer z-20 hover:z-30">
                <div className="relative">
                  <div className="absolute -inset-12 border-2 border-green-500/0 group-hover:border-green-500/70 rounded-2xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/30"></div>
                  
                  <div className="w-40 h-52 bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-2xl border-2 border-yellow-500/40 group-hover:border-yellow-500/80 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/40 transition-all duration-500 group-hover:scale-110 group-hover:translate-x-8 group-hover:translate-y-6 transform flex flex-col items-center justify-center relative overflow-hidden p-4">
                    {/* Corner decorations */}
                    <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-yellow-400/40 group-hover:border-yellow-400/80 rounded-tl transition-all duration-300"></div>
                    <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-yellow-400/40 group-hover:border-yellow-400/80 rounded-tr transition-all duration-300"></div>
                    <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-yellow-400/40 group-hover:border-yellow-400/80 rounded-bl transition-all duration-300"></div>
                    <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-yellow-400/40 group-hover:border-yellow-400/80 rounded-br transition-all duration-300"></div>
                    
                    {/* Data visualization bars */}
                    <div className="absolute bottom-4 left-3 right-3 flex gap-1 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                      <div className="flex-1 h-4 bg-gradient-to-t from-yellow-500/60 to-yellow-500/20 rounded-sm"></div>
                      <div className="flex-1 h-6 bg-gradient-to-t from-yellow-500/60 to-yellow-500/20 rounded-sm"></div>
                      <div className="flex-1 h-5 bg-gradient-to-t from-yellow-500/60 to-yellow-500/20 rounded-sm"></div>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center text-center gap-3">
                      <TrendingUp className="text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" size={32} />
                      <div>
                        <h3 className="text-lg font-bold text-yellow-300 group-hover:text-yellow-200 transition-colors duration-300">Analytics</h3>
                        <p className="text-xs text-slate-400 mt-1">Business insights</p>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1 mt-2">
                        <div>• Heatmaps & crowd</div>
                        <div>• Real-time reports</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 5: Drone Support - Bottom (LARGE CARD) */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 group cursor-pointer z-20 hover:z-30">
                <div className="relative">
                  <div className="absolute -inset-12 border-2 border-green-500/0 group-hover:border-green-500/70 rounded-2xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/30"></div>
                  
                  <div className="w-40 h-52 bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-2xl border-2 border-blue-500/40 group-hover:border-blue-500/80 shadow-xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-500 group-hover:scale-110 group-hover:translate-y-8 transform flex flex-col items-center justify-center relative overflow-hidden p-4">
                    {/* Corner decorations */}
                    <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-blue-400/40 group-hover:border-blue-400/80 rounded-tl transition-all duration-300"></div>
                    <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-blue-400/40 group-hover:border-blue-400/80 rounded-tr transition-all duration-300"></div>
                    <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-blue-400/40 group-hover:border-blue-400/80 rounded-bl transition-all duration-300"></div>
                    <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-blue-400/40 group-hover:border-blue-400/80 rounded-br transition-all duration-300"></div>
                    
                    {/* Animated orbital circle */}
                    <div className="absolute inset-4 border border-blue-500/30 rounded-full group-hover:border-blue-500/60 transition-all duration-300 animate-spin" style={{animationDuration: '8s', animationDirection: 'reverse'}}></div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center text-center gap-3">
                      <Wind className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300" size={32} />
                      <div>
                        <h3 className="text-lg font-bold text-blue-300 group-hover:text-blue-200 transition-colors duration-300">Drone Integration</h3>
                        <p className="text-xs text-slate-400 mt-1">Coming soon</p>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1 mt-2">
                        <div>• Aerial monitoring</div>
                        <div>• Q3 2026 launch</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile & Tablet Layout - Grid based (shown on screens smaller than lg) */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1: Real-Time Tracking */}
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-2xl border-2 border-cyan-500/40 group-hover:border-cyan-500/80 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-500 group-hover:scale-105 transform flex flex-col items-center justify-center relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center gap-3">
                <Smartphone className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" size={32} />
                <div>
                  <h3 className="text-lg font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300">Real-Time Tracking</h3>
                  <p className="text-xs text-slate-400 mt-1">AI-Powered detection</p>
                </div>
                <div className="text-xs text-slate-400 space-y-1 mt-2">
                  <div>• 99.7% accuracy</div>
                  <div>• &lt;100ms latency</div>
                </div>
              </div>
            </div>

            {/* Feature 2: Fast Performance */}
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-2xl border-2 border-green-500/40 group-hover:border-green-500/80 shadow-xl hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-500 group-hover:scale-105 transform flex flex-col items-center justify-center relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center gap-3">
                <Zap className="text-green-400 group-hover:text-green-300 transition-colors duration-300" size={32} />
                <div>
                  <h3 className="text-lg font-bold text-green-300 group-hover:text-green-200 transition-colors duration-300">Fast Performance</h3>
                  <p className="text-xs text-slate-400 mt-1">Ultra-optimized</p>
                </div>
                <div className="text-xs text-slate-400 space-y-1 mt-2">
                  <div>• 99.9% uptime</div>
                  <div>• Auto-scaling</div>
                </div>
              </div>
            </div>

            {/* Feature 3: Multi-Camera Support */}
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-2xl border-2 border-purple-500/40 group-hover:border-purple-500/80 shadow-xl hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-500 group-hover:scale-105 transform flex flex-col items-center justify-center relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center gap-3">
                <Globe className="text-purple-400 group-hover:text-purple-300 transition-colors duration-300" size={32} />
                <div>
                  <h3 className="text-lg font-bold text-purple-300 group-hover:text-purple-200 transition-colors duration-300">Multi-Camera</h3>
                  <p className="text-xs text-slate-400 mt-1">Unified control</p>
                </div>
                <div className="text-xs text-slate-400 space-y-1 mt-2">
                  <div>• 200+ brands</div>
                  <div>• RTSP/ONVIF</div>
                </div>
              </div>
            </div>

            {/* Feature 4: Analytics */}
            <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-2xl border-2 border-yellow-500/40 group-hover:border-yellow-500/80 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/40 transition-all duration-500 group-hover:scale-105 transform flex flex-col items-center justify-center relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center gap-3">
                <TrendingUp className="text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" size={32} />
                <div>
                  <h3 className="text-lg font-bold text-yellow-300 group-hover:text-yellow-200 transition-colors duration-300">Analytics</h3>
                  <p className="text-xs text-slate-400 mt-1">Business insights</p>
                </div>
                <div className="text-xs text-slate-400 space-y-1 mt-2">
                  <div>• Heatmaps & crowd</div>
                  <div>• Real-time reports</div>
                </div>
              </div>
            </div>

            {/* Feature 5: Drone Integration */}
            <div className="md:col-span-2 group relative bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-2xl border-2 border-blue-500/40 group-hover:border-blue-500/80 shadow-xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-500 group-hover:scale-105 transform flex flex-col items-center justify-center relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center gap-3">
                <Wind className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300" size={32} />
                <div>
                  <h3 className="text-lg font-bold text-blue-300 group-hover:text-blue-200 transition-colors duration-300">Drone Integration</h3>
                  <p className="text-xs text-slate-400 mt-1">Coming soon</p>
                </div>
                <div className="text-xs text-slate-400 space-y-1 mt-2">
                  <div>• Aerial monitoring</div>
                  <div>• Q3 2026 launch</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

