"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Building2, Truck, Users, AlertTriangle, Video, FileText, ShoppingCart } from "lucide-react";

interface DashboardHeaderProps {
  user: {
    id: number;
    email: string;
    username: string;
    full_name: string;
    role: string;
    company_id: number;
  };
  activeTab: "live" | "sites" | "vehicles" | "employees" | "traffic" | "quotation" | "order" | "settings" | "contact" | "users";
  onTabChange: (tab: "live" | "sites" | "vehicles" | "employees" | "traffic" | "quotation" | "order" | "settings" | "contact" | "users") => void;
}

export default function DashboardHeader({ 
  user, 
  activeTab, 
  onTabChange
}: DashboardHeaderProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const handleLogout = async () => {
    console.log("Logout button clicked - executing logout");
    try {
      // Call logout API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Logout successful on server');
      } else {
        console.log('Logout API call failed, but proceeding with frontend cleanup');
      }
    } catch (error) {
      console.log('Logout API call failed:', error);
    } finally {
      // Always clear frontend data and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setDropdownOpen(false);
      router.push("/login");
    }
  };

  const handleBackHome = () => {
    console.log("Back to Home button clicked - navigating home");
    setDropdownOpen(false);
    router.push("/");
  };

  const handleProfile = () => {
    // Navigate to settings page
    setDropdownOpen(false);
    onTabChange("settings");
  };

  return (
    <>
      <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 sticky top-0 z-[99998] gap-2 md:gap-4 bg-gradient-to-r from-slate-800/95 to-slate-900/95 border-b border-cyan-500/20 overflow-hidden">
        {/* Left Side - Brand Name */}
        <div className="relative z-10 min-w-fit">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Image 
              src="/logos/logoLogo.png" 
              alt="Dark Innovative Logo" 
              width={28} 
              height={28}
              className="md:w-8 md:h-8 rounded-lg shadow-lg shadow-cyan-500/50"
            />
            <h1 className="text-sm md:text-lg font-bold bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent hidden sm:block">
              Dark innovative
            </h1>
          </div>
        </div>

        {/* Connecting Line - Left Part - Hidden on mobile */}
        <div className="hidden md:flex flex-1 h-px bg-gradient-to-r from-red-500 via-red-500/50 to-transparent"></div>

        {/* Center - Navigation Buttons (Hidden on mobile, shown on tablets+) */}
        <div className="hidden md:flex relative z-10 gap-1">
          <button
            onClick={() => onTabChange("live")}
            className={`px-3 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 whitespace-nowrap border flex items-center gap-1.5 ${
              activeTab === "live"
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/50 border-red-500/50"
                : "bg-slate-600/40 border-cyan-500/30 text-slate-300 hover:text-red-400 hover:shadow-lg hover:shadow-red-500/20"
            }`}
          >
            <Video size={14} />
            <span className="hidden lg:inline">Live Feed</span>
          </button>
          <button
            onClick={() => onTabChange("sites")}
            className={`px-3 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 whitespace-nowrap border flex items-center gap-1.5 ${
              activeTab === "sites"
                ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/50 border-cyan-500/50"
                : "bg-slate-600/40 border-cyan-500/30 text-slate-300 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
            }`}
          >
            <Building2 size={14} />
            <span className="hidden lg:inline">Sites</span>
          </button>
          <button
            onClick={() => onTabChange("vehicles")}
            className={`px-3 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 whitespace-nowrap border flex items-center gap-1.5 ${
              activeTab === "vehicles"
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/50 border-purple-500/50"
                : "bg-slate-600/40 border-cyan-500/30 text-slate-300 hover:text-purple-400 hover:shadow-lg hover:shadow-purple-500/20"
            }`}
          >
            <Truck size={14} />
            <span className="hidden lg:inline">Vehicles</span>
          </button>
          <button
            onClick={() => onTabChange("employees")}
            className={`px-3 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 whitespace-nowrap border flex items-center gap-1.5 ${
              activeTab === "employees"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/50 border-green-500/50"
                : "bg-slate-600/40 border-cyan-500/30 text-slate-300 hover:text-green-400 hover:shadow-lg hover:shadow-green-500/20"
            }`}
          >
            <Users size={14} />
            <span className="hidden lg:inline">Employees</span>
          </button>
          <button
            onClick={() => onTabChange("traffic")}
            className={`px-3 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 whitespace-nowrap border flex items-center gap-1.5 ${
              activeTab === "traffic"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 border-blue-500/50"
                : "bg-slate-600/40 border-cyan-500/30 text-slate-300 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
            }`}
          >
            <AlertTriangle size={14} />
            <span className="hidden lg:inline">Traffic</span>
          </button>
          <button
            onClick={() => onTabChange("quotation")}
            className={`px-3 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 whitespace-nowrap border flex items-center gap-1.5 ${
              activeTab === "quotation"
                ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/50 border-pink-500/50"
                : "bg-slate-600/40 border-cyan-500/30 text-slate-300 hover:text-pink-400 hover:shadow-lg hover:shadow-pink-500/20"
            }`}
          >
            <FileText size={14} />
            <span className="hidden lg:inline">Quotation</span>
          </button>
          <button
            onClick={() => onTabChange("order")}
            className={`px-3 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 whitespace-nowrap border flex items-center gap-1.5 ${
              activeTab === "order"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/50 border-amber-500/50"
                : "bg-slate-600/40 border-cyan-500/30 text-slate-300 hover:text-amber-400 hover:shadow-lg hover:shadow-amber-500/20"
            }`}
          >
            <ShoppingCart size={14} />
            <span className="hidden lg:inline">Order</span>
          </button>
        </div>

        {/* Mobile Navigation Menu - Shown on tablets and below */}
        <div className="md:hidden flex gap-1">
          <button
            onClick={() => onTabChange("live")}
            className={`p-2 rounded-lg transition-all duration-300 border ${
              activeTab === "live"
                ? "bg-red-500/30 border-red-500/60 text-red-200"
                : "bg-slate-600/40 border-cyan-500/30 text-slate-400 hover:bg-slate-600/60"
            }`}
            title="Live Feed"
          >
            <Video size={16} />
          </button>
          <button
            onClick={() => onTabChange("sites")}
            className={`p-2 rounded-lg transition-all duration-300 border ${
              activeTab === "sites"
                ? "bg-cyan-500/30 border-cyan-500/60 text-cyan-200"
                : "bg-slate-600/40 border-cyan-500/30 text-slate-400 hover:bg-slate-600/60"
            }`}
            title="Sites"
          >
            <Building2 size={16} />
          </button>
          <button
            onClick={() => onTabChange("vehicles")}
            className={`p-2 rounded-lg transition-all duration-300 border ${
              activeTab === "vehicles"
                ? "bg-purple-500/30 border-purple-500/60 text-purple-200"
                : "bg-slate-600/40 border-cyan-500/30 text-slate-400 hover:bg-slate-600/60"
            }`}
            title="Vehicles"
          >
            <Truck size={16} />
          </button>
          <button
            onClick={() => onTabChange("employees")}
            className={`p-2 rounded-lg transition-all duration-300 border ${
              activeTab === "employees"
                ? "bg-green-500/30 border-green-500/60 text-green-200"
                : "bg-slate-600/40 border-cyan-500/30 text-slate-400 hover:bg-slate-600/60"
            }`}
            title="Employees"
          >
            <Users size={16} />
          </button>
          <button
            onClick={() => onTabChange("traffic")}
            className={`p-2 rounded-lg transition-all duration-300 border ${
              activeTab === "traffic"
                ? "bg-blue-500/30 border-blue-500/60 text-blue-200"
                : "bg-slate-600/40 border-cyan-500/30 text-slate-400 hover:bg-slate-600/60"
            }`}
            title="Traffic"
          >
            <AlertTriangle size={16} />
          </button>
          <button
            onClick={() => onTabChange("quotation")}
            className={`p-2 rounded-lg transition-all duration-300 border ${
              activeTab === "quotation"
                ? "bg-pink-500/30 border-pink-500/60 text-pink-200"
                : "bg-slate-600/40 border-cyan-500/30 text-slate-400 hover:bg-slate-600/60"
            }`}
            title="Quotation"
          >
            <FileText size={16} />
          </button>
          <button
            onClick={() => onTabChange("order")}
            className={`p-2 rounded-lg transition-all duration-300 border ${
              activeTab === "order"
                ? "bg-amber-500/30 border-amber-500/60 text-amber-200"
                : "bg-slate-600/40 border-cyan-500/30 text-slate-400 hover:bg-slate-600/60"
            }`}
            title="Order"
          >
            <ShoppingCart size={16} />
          </button>
        </div>

        {/* Connecting Line - Right Part - Hidden on mobile */}
        <div className="hidden md:flex flex-1 h-px bg-gradient-to-r from-transparent via-red-500/50 to-red-500"></div>

        {/* Right Side - Profile Dropdown */}
        <div className="relative z-[99999] min-w-fit">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 rounded-full bg-slate-700/40 hover:bg-slate-700/60 border border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 group"
          >
            <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-cyan-500/30 group-hover:shadow-purple-500/30 transition-all">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs md:text-xs font-medium text-slate-300 group-hover:text-cyan-400 transition-colors max-w-xs truncate hidden sm:inline">
              {user.username}
            </span>
            <svg
              className={`w-3 h-3 md:w-4 md:h-4 text-slate-400 transition-transform duration-300 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
        </button>
      </div>
    </div>

    {/* Popup Menu */}
    {dropdownOpen && (
      <>
        {/* Backdrop Overlay */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999998] animate-fadeIn"
          onClick={(e) => {
            // Only close if clicking the backdrop directly, not the popup content
            if (e.target === e.currentTarget) {
              setDropdownOpen(false);
            }
          }}
        />
        
        {/* Popup Content */}
        <div 
          className="fixed top-20 right-4 w-80 md:w-96 bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/40 overflow-hidden animate-slideInUp z-[9999999] backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {/* User Info */}
          <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-slate-900/80">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg md:text-xl font-bold shadow-lg shadow-cyan-500/30">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm md:text-base font-bold text-slate-300">{user.full_name}</p>
                <p className="text-xs md:text-sm text-slate-500">{user.email}</p>
                <p className="text-xs text-cyan-400 font-semibold mt-1">Role: {user.role}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2 md:py-3">
            {/* Profile */}
            <button
              onClick={handleProfile}
              className="w-full px-4 md:px-6 py-3 md:py-3.5 text-left text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 flex items-center gap-3 md:gap-4 transition-all duration-200 group"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm md:text-base font-medium">Profile</span>
            </button>

            {/* Back to Home */}
            <button
              onClick={handleBackHome}
              className="w-full px-4 md:px-6 py-3 md:py-3.5 text-left text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 flex items-center gap-3 md:gap-4 transition-all duration-200 group"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 5v14a1 1 0 001 1h12a1 1 0 001-1V5M9 9h6m-6 4h6" />
              </svg>
              <span className="text-sm md:text-base font-medium">Back to Home</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full px-4 md:px-6 py-3 md:py-3.5 text-left text-slate-300 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-3 md:gap-4 transition-all duration-200 group border-t border-slate-700/50 mt-2 pt-2 md:pt-3"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm md:text-base font-medium">Logout</span>
            </button>
          </div>
        </div>
      </>
    )}
  </>
  );
}
