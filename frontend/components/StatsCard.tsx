"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  color: string;
}

export default function StatsCard({
  title,
  value,
  unit = "",
  icon: Icon,
  color,
}: StatsCardProps) {
  return (
    <div className="group card-tech hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-2 animate-slideInUp relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1 transition-all duration-300 group-hover:translate-x-1">
          <p className="text-slate-400 text-sm font-medium transition-colors duration-300 group-hover:text-cyan-400">{title}</p>
          <p className="text-3xl font-bold mt-2 text-slate-200 transition-all duration-300 group-hover:text-cyan-300">
            {value}
            {unit && <span className="text-lg ml-1 transition-colors duration-300 group-hover:text-cyan-400">{unit}</span>}
          </p>
        </div>
        <div className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
          <Icon size={32} className={`${color} opacity-80 group-hover:opacity-100 transition-all duration-300`} />
        </div>
      </div>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-600/0 to-purple-600/0 group-hover:from-cyan-600/5 group-hover:to-purple-600/5 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
}
