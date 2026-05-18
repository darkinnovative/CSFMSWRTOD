"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Home, Info, Mail, Briefcase, LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";

export default function BottomNavBar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [footerInView, setFooterInView] = useState(false);
  const footerObserverRef = useRef<IntersectionObserver | null>(null);

  // Hide nav on dashboard and login pages
  const isProtectedPage = pathname?.startsWith("/dashboard") || pathname?.startsWith("/login");

  // Detect when footer enters viewport
  useEffect(() => {
    footerObserverRef.current = new IntersectionObserver(
      ([entry]) => {
        setFooterInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    // Find footer element and observe it
    const footer = document.querySelector("footer");
    if (footer) {
      footerObserverRef.current.observe(footer);
    }

    return () => {
      if (footerObserverRef.current) {
        footerObserverRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show nav if scrolling up, hide if scrolling down
      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY + 50) {
        // Scrolling down
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Don't render on protected pages
  if (isProtectedPage) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible && !footerInView ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Backdrop gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/80 to-transparent pointer-events-none"></div>

      {/* Centered Navigation Container */}
      <div className="flex items-end justify-center py-4 px-4 relative z-10">
        {/* Mac Taskbar Style Container */}
        <div className="bg-gradient-to-r from-slate-800/60 to-slate-800/60 backdrop-blur-xl rounded-2xl px-6 py-3 flex items-center gap-4 border border-slate-700/50 shadow-2xl shadow-black/50">
          {/* Home */}
          <Link
            href="/"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center text-white hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-110 transition-all duration-300 shadow-lg border border-cyan-400/50 group"
            title="Home"
          >
            <Home size={20} className="group-hover:scale-125 transition-transform" />
          </Link>

          {/* About */}
          <Link
            href="/about"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white hover:shadow-lg hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 shadow-lg border border-blue-400/50 group"
            title="About"
          >
            <Info size={20} className="group-hover:scale-125 transition-transform" />
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white hover:shadow-lg hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 shadow-lg border border-purple-400/50 group"
            title="Contact"
          >
            <Mail size={20} className="group-hover:scale-125 transition-transform" />
          </Link>

          {/* Company */}
          <Link
            href="/company"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white hover:shadow-lg hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 shadow-lg border border-green-400/50 group"
            title="Company"
          >
            <Briefcase size={20} className="group-hover:scale-125 transition-transform" />
          </Link>

          {/* Divider */}
          <div className="w-px h-8 bg-slate-600/50 mx-2"></div>

          {/* Dashboard */}
          <Link
            href="/dashboard"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white hover:shadow-lg hover:shadow-orange-500/50 hover:scale-110 transition-all duration-300 shadow-lg border border-orange-400/50 group"
            title="Dashboard"
          >
            <LayoutDashboard size={20} className="group-hover:scale-125 transition-transform" />
          </Link>

          {/* Login */}
          <Link
            href="/login"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white hover:shadow-lg hover:shadow-red-500/50 hover:scale-110 transition-all duration-300 shadow-lg border border-red-400/50 group"
            title="Login"
          >
            <LogIn size={20} className="group-hover:scale-125 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Safe area bottom space */}
      <div className="h-4"></div>
    </div>
  );
}
