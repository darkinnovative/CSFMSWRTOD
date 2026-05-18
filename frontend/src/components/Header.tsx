"use client";

import React from "react";
import { Eye } from "lucide-react";

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-20 backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 md:gap-3 group cursor-pointer hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-1.5 md:p-2 rounded-lg animate-circuit-glow group-hover:animate-spin-slow shadow-lg shadow-cyan-500/50">
              <Eye size={24} className="md:w-8 md:h-8 text-white" />
            </div>
            <div className="transition-all duration-300 group-hover:translate-x-1">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-fadeInUp">Dark Innovative</h1>
              <p className="text-xs md:text-xs text-slate-400 transition-colors duration-300 group-hover:text-cyan-400">Object Detection & Tracking</p>
            </div>
          </div>

          {/* Horizontal Line - Hidden on very small screens */}
          <div className="hidden sm:flex flex-grow h-px bg-gradient-to-r from-cyan-500/30 via-purple-500/50 to-cyan-500/30 mx-4 md:mx-6"></div>

          <div className="flex items-center gap-3 md:gap-4 relative">
            {/* Live Status */}
            <div className="text-right">
              <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-green-500/10 px-2 md:px-3 py-1 md:py-1.5 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 border border-cyan-500/30 hover:border-cyan-500/60 hover:shadow-cyan-500/30">
                <div className="inline-block w-2 md:w-3 h-2 md:h-3 bg-green-400 rounded-full animate-cyan-pulse shadow-green-400/70"></div>
                <p className="text-xs md:text-sm font-semibold text-cyan-300 animate-fadeIn">Live</p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
