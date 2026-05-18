"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Wifi, WifiOff, Activity } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Device {
  id: number;
  device_id: string;
  last_heartbeat: string;
  fps: number;
  cpu_usage: number;
  memory_usage: number;
  model_type: string;
  is_online: boolean;
}

export default function DeviceStatus() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/device/status`);
        // Ensure response.data is an array before setting
        if (Array.isArray(response.data)) {
          setDevices(response.data);
        } else {
          console.warn("API returned non-array device data:", response.data);
          setDevices([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch device status", error);
        setDevices([]);
        setLoading(false);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-tech mb-8 animate-slideInUp">
      <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-fadeInUp">Connected Devices</h2>
      {loading ? (
        <div className="text-center py-8">
          <div className="flex justify-center items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
          <p className="text-slate-400 text-sm">Loading devices...</p>
        </div>
      ) : devices.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">🔌</div>
          <p className="text-slate-400 text-lg">No devices connected</p>
          <p className="text-slate-500 text-sm mt-2">Devices will appear here when they come online</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device, index) => (
            <div 
              key={device.id} 
              className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg p-5 border border-cyan-500/20 hover:border-cyan-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1 group animate-slideInUp hover:scale-105 pcb-pattern relative overflow-hidden"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold flex items-center gap-2 text-slate-100 transition-all duration-300 group-hover:translate-x-1">
                  {device.is_online ? (
                    <Wifi size={16} className="text-green-400 animate-cyan-pulse" />
                  ) : (
                    <WifiOff size={16} className="text-slate-500" />
                  )}
                  <span className="font-mono text-sm">{device.device_id}</span>
                </span>
                <span
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 inline-flex items-center gap-1 border ${
                    device.is_online
                      ? "bg-green-900/30 text-green-300 animate-cyan-pulse border-green-500/30"
                      : "bg-slate-700/50 text-slate-400 border-slate-600/30"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {device.is_online ? "Online" : "Offline"}
                </span>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Model:</span>
                  <span className="text-slate-200 font-semibold group-hover:text-cyan-300 transition-colors duration-300">{device.model_type}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Activity size={14} className="text-cyan-400" /> FPS:
                  </span>
                  <span className="text-slate-200 font-semibold">
                    <span className="text-cyan-400">{device.fps.toFixed(1)}</span>
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">CPU:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                        style={{width: `${device.cpu_usage}%`}}
                      ></div>
                    </div>
                    <span className="text-slate-200 font-semibold text-xs">{device.cpu_usage.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Memory:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-300"
                        style={{width: `${device.memory_usage}%`}}
                      ></div>
                    </div>
                    <span className="text-slate-200 font-semibold text-xs">{device.memory_usage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              </div>

              {/* Animated bottom border */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
