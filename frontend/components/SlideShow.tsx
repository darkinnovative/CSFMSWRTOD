"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface SlideShowProps {
  images?: string[];
  autoPlay?: boolean;
  interval?: number;
  fullWidth?: boolean;
}

export default function SlideShow({
  images = [
    "https://images.unsplash.com/photo-150432881951-18bcd4718f72?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?w=1920&h=1080&fit=crop",
  ],
  autoPlay = true,
  interval = 4000,
  fullWidth = false,
}: SlideShowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlay, images.length, interval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  if (fullWidth) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black">
        {/* Image Carousel */}
        <div className="relative w-full h-full">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}
        </div>

        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="text-center space-y-4 animate-fadeInUp">
            <h1 className="text-6xl md:text-7xl font-bold text-white drop-shadow-lg leading-tight">
              Advanced Detection
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 drop-shadow-md">
              Real-time monitoring for construction sites
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft size={28} />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
        >
          <ChevronRight size={28} />
        </button>

        {/* Bottom Controls - Modernized */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/80 to-transparent">
          {/* Slide Indicators */}
          <div className="flex justify-center items-center gap-3 py-8">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-12 h-3 bg-gradient-to-r from-cyan-400 to-purple-400"
                    : "w-3 h-3 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          {/* Control Bar */}
          <div className="flex items-center justify-between px-8 py-6 backdrop-blur-md border-t border-white/10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 hover:border-cyan-400 text-white transition-all duration-300 hover:scale-105"
              >
                {isAutoPlay ? (
                  <>
                    <Pause size={18} />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    <span>Play</span>
                  </>
                )}
              </button>
              <span className="text-gray-400 text-sm">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Modern Image Display */}
      <div className="relative w-full bg-gradient-to-br from-slate-900 to-black overflow-hidden rounded-2xl shadow-2xl border border-cyan-500/20">
        {/* Image Carousel */}
        <div className="relative w-full aspect-video">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Counter */}
        <div className="absolute top-4 right-4 z-20 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Modern Indicators and Controls */}
      <div className="mt-6 space-y-4">
        {/* Slide Indicators */}
        <div className="flex justify-center items-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-10 h-2.5 bg-gradient-to-r from-cyan-400 to-purple-400"
                  : "w-2.5 h-2.5 bg-slate-600 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>

        {/* Control Bar */}
        <div className="flex items-center justify-center gap-4 bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm p-4 rounded-xl border border-cyan-500/20">
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 border flex items-center gap-2 ${
              isAutoPlay
                ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30 border-cyan-400/50"
                : "bg-slate-700/50 text-slate-300 border-cyan-500/30 hover:border-cyan-500/60 hover:text-cyan-400"
            }`}
          >
            {isAutoPlay ? (
              <>
                <Pause size={16} />
                Pause
              </>
            ) : (
              <>
                <Play size={16} />
                Play
              </>
            )}
          </button>
          <div className="text-sm text-slate-400 px-4 py-2 bg-slate-800/40 rounded-lg border border-slate-700/50">
            Frame: {currentIndex + 1}
          </div>
        </div>
      </div>
    </div>
  );
}
