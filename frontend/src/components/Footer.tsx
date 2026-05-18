import React from "react";
import Link from "next/link";
import { Mail, Phone, Github, Linkedin, Twitter, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-800 to-black border-t border-slate-700/50 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-float" style={{animationDelay: "2s"}}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="group">
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">Dark Innovative</h3>
                <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
              </div>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Advanced real-time object detection and surveillance platform. Powered by cutting-edge AI and machine learning technology.
              </p>
              <div className="flex gap-4 pt-4">
                <a href="#" className="p-2 rounded-lg bg-slate-800/50 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-all duration-300">
                  <Twitter size={18} />
                </a>
                <a href="#" className="p-2 rounded-lg bg-slate-800/50 hover:bg-purple-500/20 text-slate-400 hover:text-purple-400 transition-all duration-300">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="p-2 rounded-lg bg-slate-800/50 hover:bg-green-500/20 text-slate-400 hover:text-green-400 transition-all duration-300">
                  <Github size={18} />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-200 text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full"></span>
                Product
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-1.5 h-1 bg-cyan-400 rounded-full transition-all duration-300"></span>
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-1.5 h-1 bg-cyan-400 rounded-full transition-all duration-300"></span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/company" className="text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-1.5 h-1 bg-cyan-400 rounded-full transition-all duration-300"></span>
                    Company
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-1.5 h-1 bg-cyan-400 rounded-full transition-all duration-300"></span>
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support & Contact */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-200 text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></span>
                Support
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-slate-400 hover:text-purple-400 transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-1.5 h-1 bg-purple-400 rounded-full transition-all duration-300"></span>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@darkinnovative.com" className="text-slate-400 hover:text-purple-400 transition-all duration-300 flex items-center gap-2 group">
                    <Mail size={16} className="opacity-60 group-hover:opacity-100" />
                    support@darkinnovative.com
                  </a>
                </li>
                <li>
                  <a href="tel:+15551234567" className="text-slate-400 hover:text-purple-400 transition-all duration-300 flex items-center gap-2 group">
                    <Phone size={16} className="opacity-60 group-hover:opacity-100" />
                    +1 (555) 123-4567
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal & Info */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-200 text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></span>
                Legal
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-slate-400 hover:text-green-400 transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-1.5 h-1 bg-green-400 rounded-full transition-all duration-300"></span>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-green-400 transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-1.5 h-1 bg-green-400 rounded-full transition-all duration-300"></span>
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-green-400 transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-1.5 h-1 bg-green-400 rounded-full transition-all duration-300"></span>
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700/50 py-6 md:py-8"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center md:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs md:text-sm text-slate-400">
              <span>© {currentYear} Dark Innovative. All rights reserved.</span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span>Made with</span>
              <Heart size={14} className="text-red-500 fill-red-500 inline" />
              <span>by DarkInnTech</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
