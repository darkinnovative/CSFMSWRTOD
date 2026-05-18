"use client";

import React, { useEffect } from "react";
import { useActiveVehicles } from "@/hooks/useAPI";
import { ActiveVehiclesResponse } from "@/lib/types";

interface VehicleTrackerProps {
  companyId?: number;
}

export default function VehicleTrackerContainer({ companyId = 1 }: VehicleTrackerProps) {
  const { data: vehicles, loading, error, refetch } = useActiveVehicles(companyId);

  // Auto-refresh every 5 seconds for real-time tracking
  useEffect(() => {
    const interval = setInterval(refetch, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🚗 Active Vehicles</h2>
        <button
          onClick={() => refetch()}
          disabled={loading}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm disabled:opacity-50"
        >
          {loading ? "Tracking..." : "Update"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-200 p-3 rounded mb-4">
          Error loading vehicles: {error}
        </div>
      )}

      {loading && !vehicles ? (
        <div className="text-center py-8 text-slate-400">Loading active vehicles...</div>
      ) : !vehicles || vehicles.length === 0 ? (
        <div className="text-center py-8 text-slate-400">No active vehicles</div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((vehicle: ActiveVehiclesResponse) => (
            <div
              key={vehicle.id}
              className="border border-slate-700 rounded p-3 bg-slate-700/30 hover:border-blue-500"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-green-400">{vehicle.registration_number}</h3>
                  <p className="text-sm text-slate-400">{vehicle.driver_name}</p>
                </div>
                <span className="text-xs bg-slate-600 px-2 py-1 rounded">
                  {vehicle.vehicle_type}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <p>
                  📍 {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
                </p>
                <p className="text-yellow-400 font-semibold">⚡ {vehicle.speed.toFixed(1)} km/h</p>
                <p className="col-span-2 text-slate-400">
                  ⏰ {new Date(vehicle.last_update).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
