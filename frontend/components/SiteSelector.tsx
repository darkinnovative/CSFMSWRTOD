"use client";

import React, { useState, useEffect } from "react";
import { Building2, ChevronDown, AlertCircle } from "lucide-react";
import { sitesAPI } from "@/lib/api";
import { ConstructionSiteResponse } from "@/lib/types";

interface SiteSelectorProps {
  selectedSiteId: number | null;
  onSiteChange: (siteId: number) => void;
  className?: string;
}

export default function SiteSelector({
  selectedSiteId,
  onSiteChange,
  className = "",
}: SiteSelectorProps) {
  const [sites, setSites] = useState<ConstructionSiteResponse[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await sitesAPI.getSites(0, 100);
        setSites(response.data);
      } catch (err: any) {
        console.error("Failed to fetch sites:", err);
        setError("Failed to load sites");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSites();
  }, []);

  const selectedSite = sites.find((s) => s.id === selectedSiteId);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-2 px-3 py-2 bg-slate-700/60 border border-cyan-500/40 rounded-lg text-sm hover:border-cyan-500/70 hover:bg-slate-700/80 transition-all duration-200 disabled:opacity-50"
      >
        <Building2 size={16} className="text-cyan-400" />
        <span className="text-slate-200 font-medium truncate max-w-[150px]">
          {isLoading ? "Loading..." : selectedSite?.site_name || "Select Site"}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-slate-800 border border-cyan-500/40 rounded-lg shadow-xl z-50 min-w-[200px]">
          {error && (
            <div className="px-3 py-2 flex items-center gap-2 text-red-400 text-xs border-b border-slate-700">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {sites.length === 0 && !error && (
            <div className="px-3 py-4 text-center text-slate-400 text-sm">
              No sites available
            </div>
          )}

          <div className="max-h-[300px] overflow-y-auto">
            {sites.map((site) => (
              <button
                key={site.id}
                onClick={() => {
                  onSiteChange(site.id);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm transition-colors duration-150 border-b border-slate-700/50 last:border-b-0 ${
                  selectedSiteId === site.id
                    ? "bg-cyan-500/20 text-cyan-300 font-medium"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-cyan-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium truncate">{site.site_name}</div>
                  <div className="text-xs text-slate-500">Order: {(site as any).site_order || 0}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
