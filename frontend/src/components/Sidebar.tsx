"use client";

import React, { useState } from "react";
import {
  Menu,
  X,
  Video,
  MapPin,
  Truck,
  Users,
  Activity,
  Settings,
  ChevronLeft,
  FileText,
  ShoppingCart,
} from "lucide-react";
import SiteSelector from "./SiteSelector";

interface SidebarProps {
  activeTab: "live" | "sites" | "vehicles" | "employees" | "traffic" | "quotation" | "order" | "settings" | "contact" | "users";
  onTabChange: (tab: "live" | "sites" | "vehicles" | "employees" | "traffic" | "quotation" | "order" | "settings" | "contact" | "users") => void;
  onModeChange?: (mode: "full" | "shrink" | "hidden") => void;
  selectedSiteId?: number | null;
  onSiteChange?: (siteId: number) => void;
  userRole?: string; // Add user role prop
}

type SidebarMode = "full" | "shrink" | "hidden";

export default function Sidebar({ activeTab, onTabChange, onModeChange, selectedSiteId, onSiteChange, userRole }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("full");

  const handleModeChange = (newMode: SidebarMode) => {
    setSidebarMode(newMode);
    onModeChange?.(newMode);
  };

  // System stats
  const [stats] = useState({
    camerasOnline: 5,
    camerasOffline: 1,
    activeSites: 12,
    alerts: 2,
    connectedDevices: 8,
  });

  const mainMenuItems = [
    { id: "live", label: "Live Feed", icon: Video, color: "from-red-500 to-red-600", hoverBg: "hover:bg-red-500/10" },
    { id: "sites", label: "Sites", icon: MapPin, color: "from-cyan-500 to-cyan-600", hoverBg: "hover:bg-cyan-500/10" },
    { id: "vehicles", label: "Vehicles", icon: Truck, color: "from-purple-500 to-purple-600", hoverBg: "hover:bg-purple-500/10" },
    { id: "employees", label: "Employees", icon: Users, color: "from-green-500 to-green-600", hoverBg: "hover:bg-green-500/10" },
    { id: "traffic", label: "Traffic", icon: Activity, color: "from-blue-500 to-blue-600", hoverBg: "hover:bg-blue-500/10" },
    { id: "users", label: "Users", icon: Users, color: "from-indigo-500 to-indigo-600", hoverBg: "hover:bg-indigo-500/10" },
    { id: "quotation", label: "Quotations", icon: FileText, color: "from-pink-500 to-pink-600", hoverBg: "hover:bg-pink-500/10" },
    { id: "order", label: "Orders", icon: ShoppingCart, color: "from-amber-500 to-amber-600", hoverBg: "hover:bg-amber-500/10" },
    { id: "settings", label: "Settings", icon: Settings, color: "from-slate-500 to-slate-600", hoverBg: "hover:bg-slate-500/10" },
    { id: "contact", label: "Contact", icon: Users, color: "from-green-500 to-green-600", hoverBg: "hover:bg-green-500/10" },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = userRole === "administrator" 
    ? mainMenuItems 
    : mainMenuItems.filter(item => !["users", "contact"].includes(item.id));

  const handleMenuClick = (tab: any) => {
    onTabChange(tab);
    setIsMobileOpen(false);
  };

  // Hide mode - show only button to restore
  if (sidebarMode === "hidden") {
    return (
      <button
        onClick={() => handleModeChange("full")}
        className="fixed left-4 bottom-4 z-40 p-3 bg-gradient-to-br from-cyan-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110"
        title="Show Sidebar"
      >
        <Menu size={24} />
      </button>
    );
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-20 left-4 z-40">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-gradient-to-br from-cyan-500 to-purple-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          title="Toggle Menu"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30 top-16"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="relative">
        <aside className={`hidden md:flex shrink-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-cyan-500/20 transition-all duration-300 pcb-pattern flex-col overflow-hidden sticky top-0 z-30 ${
          sidebarMode === "shrink" ? "w-16 lg:w-20" : "w-56 lg:w-64"
        }`}>
          {/* No Header - Clean sidebar */}
          
          {/* Main Navigation */}
          <nav className={`flex-1 overflow-y-auto flex flex-col ${sidebarMode === "shrink" ? "py-2 px-2" : "py-4 px-2"}`}>
          <div className={sidebarMode === "shrink" ? "space-y-2 flex flex-col items-center" : "space-y-1"}>
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as any)}
                  className={`transition-all duration-300 group relative ${
                    sidebarMode === "shrink"
                      ? `w-14 h-14 flex items-center justify-center rounded-xl ${
                          isActive
                            ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border border-cyan-500/40 shadow-lg shadow-cyan-500/20"
                            : `${item.hoverBg} border border-transparent hover:border-cyan-500/30 hover:shadow-md hover:shadow-cyan-500/10`
                        }`
                      : `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg border-transparent`
                            : `text-slate-300 ${item.hoverBg} border border-transparent hover:border-slate-500/30`
                        }`
                  }`}
                  title={sidebarMode === "shrink" ? item.label : ""}
                >
                  <Icon size={sidebarMode === "shrink" ? 24 : 20} className="flex-shrink-0" />
                  {sidebarMode !== "shrink" && (
                    <>
                      <span className="text-sm font-medium truncate">{item.label}</span>
                      {isActive && <div className="ml-auto w-2 h-2 rounded-full animate-pulse bg-white" />}
                    </>
                  )}
                  {sidebarMode === "shrink" && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-slate-300 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-cyan-500/20 z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Site Selector - Show when on Sites tab */}
        {activeTab === "sites" && sidebarMode !== "shrink" && selectedSiteId !== undefined && onSiteChange && (
          <div className="p-3 border-t border-b border-cyan-500/20 flex-shrink-0">
            <SiteSelector
              selectedSiteId={selectedSiteId}
              onSiteChange={onSiteChange}
              className="w-full"
            />
          </div>
        )}

        {/* System Stats - Positioned higher */}
        {sidebarMode !== "shrink" && (
          <div className="p-3 border-t border-cyan-500/20 space-y-2 flex-shrink-0">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">System Status</h3>
            
            <div className="space-y-1 text-xs">
              {/* Cameras Status */}
              <div className="bg-slate-800/50 rounded-lg p-2 border border-cyan-500/20">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Cameras</span>
                  <span className="text-green-400 font-bold">{stats.camerasOnline}/{stats.camerasOnline + stats.camerasOffline}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-400"
                    style={{width: `${(stats.camerasOnline / (stats.camerasOnline + stats.camerasOffline)) * 100}%`}}
                  />
                </div>
              </div>

              {/* Active Sites */}
              <div className="bg-slate-800/50 rounded-lg p-2 border border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Sites</span>
                  <span className="text-cyan-400 font-bold">{stats.activeSites}</span>
                </div>
              </div>

              {/* Devices */}
              <div className="bg-slate-800/50 rounded-lg p-2 border border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Devices</span>
                  <span className="text-blue-400 font-bold">{stats.connectedDevices}</span>
                </div>
              </div>

              {/* Alerts */}
              {stats.alerts > 0 && (
                <div className="bg-red-900/30 rounded-lg p-2 border border-red-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-red-300">Alerts</span>
                    <span className="text-red-400 font-bold animate-pulse">{stats.alerts}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Shrink/Expand Button - Thin nose outside sidebar */}
      <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-50">
        <button
          type="button"
          onClick={() =>
            handleModeChange(sidebarMode === "shrink" ? "full" : "shrink")
          }
          className="flex w-5 h-32 items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-cyan-400 rounded-r-2xl border border-l-0 border-cyan-500/30 transition-all duration-300 hover:text-cyan-300 hover:shadow-xl hover:shadow-cyan-500/50 active:scale-95 group pcb-pattern shadow-lg"
          title={sidebarMode === "shrink" ? "Expand" : "Shrink"}
        >
          <ChevronLeft
            size={16}
            className={`transition-transform duration-300 group-hover:scale-125 ${sidebarMode === "shrink" ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Hide Button - Bottom with down arrow */}
      <button
        type="button"
        onClick={() => handleModeChange("hidden")}
        className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 z-40"
        title="Hide Sidebar"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
    </div>

      {/* Mobile Sidebar - Shown on mobile */}
      {isMobileOpen && (
        <div className="md:hidden fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-cyan-500/20 z-40 overflow-y-auto">
          {/* Mobile Navigation */}
          <nav className="p-3 space-y-1">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 border ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg border-transparent`
                      : `text-slate-300 ${item.hoverBg} border-transparent hover:border-slate-500/30`
                  }`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Stats */}
          <div className="p-3 border-t border-cyan-500/20 space-y-2">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">System</h3>
            <div className="text-xs space-y-1">
              <div className="flex justify-between p-2 bg-slate-800/50 rounded border border-cyan-500/20">
                <span className="text-slate-300">Cameras</span>
                <span className="text-green-400">{stats.camerasOnline}/{stats.camerasOnline + stats.camerasOffline}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-800/50 rounded border border-cyan-500/20">
                <span className="text-slate-300">Sites</span>
                <span className="text-cyan-400">{stats.activeSites}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
