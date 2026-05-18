"use client";

import React, { useState } from "react";
import { Camera, AlertCircle, RefreshCw, Grid3x3, Maximize2 } from "lucide-react";

interface CameraFeed {
  id: string;
  name: string;
  deviceId: string;
  location: string;
  status: "online" | "offline" | "streaming";
  lastFrame?: string;
}

interface LiveCameraFeedProps {
  deviceId?: string;
  compact?: boolean;
}

type ViewMode = "single" | "grid2" | "grid4" | "grid6";

export default function LiveCameraFeed({
  compact = false,
}: LiveCameraFeedProps) {
  const [cameras] = useState<CameraFeed[]>([
    {
      id: "cam-1",
      name: "Main Gate",
      deviceId: "pi-device-01",
      location: "North Entrance",
      status: "streaming",
    },
    {
      id: "cam-2",
      name: "Work Area",
      deviceId: "pi-device-02",
      location: "Construction Zone A",
      status: "online",
    },
    {
      id: "cam-3",
      name: "Parking Lot",
      deviceId: "pi-device-03",
      location: "Parking Area",
      status: "offline",
    },
    {
      id: "cam-4",
      name: "Equipment Storage",
      deviceId: "pi-device-04",
      location: "Storage Area",
      status: "streaming",
    },
    {
      id: "cam-5",
      name: "Main Office",
      deviceId: "pi-device-05",
      location: "Office Building",
      status: "online",
    },
    {
      id: "cam-6",
      name: "Emergency Exit",
      deviceId: "pi-device-06",
      location: "South Exit",
      status: "streaming",
    },
  ]);

  const [selectedCamera, _setSelectedCamera] = useState<string | null>(
    cameras[0]?.id || null
  );
  const [selectedCameras, setSelectedCameras] = useState<Set<string>>(
    new Set([cameras[0]?.id || ""])
  );
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call to refresh camera feed
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const toggleCameraSelection = (cameraId: string) => {
    const newSelected = new Set(selectedCameras);
    if (newSelected.has(cameraId)) {
      newSelected.delete(cameraId);
    } else {
      newSelected.add(cameraId);
    }
    setSelectedCameras(newSelected);
  };

  const selectAllCameras = () => {
    const allCameraIds = new Set(cameras.map((c) => c.id));
    setSelectedCameras(allCameraIds);
  };

  const deselectAllCameras = () => {
    setSelectedCameras(new Set());
  };

  const switchViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    // Auto-select appropriate number of cameras for the mode
    if (mode === "single" && selectedCameras.size === 0) {
      setSelectedCameras(new Set([cameras[0]?.id || ""]));
    } else if (mode === "grid2" && selectedCameras.size < 2) {
      const ids = cameras.slice(0, 2).map((c) => c.id);
      setSelectedCameras(new Set(ids));
    } else if (mode === "grid4" && selectedCameras.size < 4) {
      const ids = cameras.slice(0, 4).map((c) => c.id);
      setSelectedCameras(new Set(ids));
    } else if (mode === "grid6") {
      const ids = cameras.slice(0, 6).map((c) => c.id);
      setSelectedCameras(new Set(ids));
    }
  };

  const getGridClass = () => {
    switch (viewMode) {
      case "grid2":
        return "grid-cols-2";
      case "grid4":
        return "grid-cols-2 md:grid-cols-2 lg:grid-cols-4";
      case "grid6":
        return "grid-cols-2 md:grid-cols-3 lg:grid-cols-3";
      default:
        return "";
    }
  };

  if (compact) {
    const activeCameras = cameras.filter(
      (c) => c.status === "streaming" || c.status === "online"
    );
    const offlineCameras = cameras.filter((c) => c.status === "offline");

    return (
      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20 rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 animate-slideInUp">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <Camera size={20} />
              Live Camera Feed
            </h3>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-cyan-500/10 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
          </div>

          {/* Camera Grid - Multi-select version */}
          <div className="grid grid-cols-2 gap-3">
            {activeCameras.slice(0, 4).map((camera) => (
              <button
                key={camera.id}
                onClick={() => toggleCameraSelection(camera.id)}
                className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                  selectedCameras.has(camera.id)
                    ? "border-cyan-500 shadow-lg shadow-cyan-500/50"
                    : "border-cyan-500/20 hover:border-cyan-500/50"
                }`}
              >
                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-500/10" />
                  {/* Selection Indicator */}
                  {selectedCameras.has(camera.id) && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-cyan-500 rounded-full border-2 border-white flex items-center justify-center z-20">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                  <div className="text-center relative z-10">
                    <Camera size={24} className="text-cyan-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-300 font-medium">
                      {camera.name}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-900/50 text-green-300 text-xs rounded-full border border-green-500/30">
                      {camera.status}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Info Alert */}
          <div className="mt-3 text-xs text-slate-400">
            <span className="font-semibold text-cyan-400">{selectedCameras.size}</span> camera{selectedCameras.size !== 1 ? "s" : ""} selected
          </div>

          {offlineCameras.length > 0 && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-red-300">
                {offlineCameras.length} camera{offlineCameras.length !== 1 ? "s" : ""} offline
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20 rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 animate-slideInUp">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <Camera size={24} />
            Live Camera Feeds
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            View Mode:
          </span>
          <button
            onClick={() => switchViewMode("single")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              viewMode === "single"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/50"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-cyan-300 border border-cyan-500/20"
            }`}
          >
            <Maximize2 size={14} className="inline mr-1" />
            Single
          </button>
          <button
            onClick={() => switchViewMode("grid2")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              viewMode === "grid2"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/50"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-cyan-300 border border-cyan-500/20"
            }`}
          >
            <Grid3x3 size={14} className="inline mr-1" />
            2 Cams
          </button>
          <button
            onClick={() => switchViewMode("grid4")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              viewMode === "grid4"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/50"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-cyan-300 border border-cyan-500/20"
            }`}
          >
            <Grid3x3 size={14} className="inline mr-1" />
            4 Cams
          </button>
          <button
            onClick={() => switchViewMode("grid6")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              viewMode === "grid6"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/50"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-cyan-300 border border-cyan-500/20"
            }`}
          >
            <Grid3x3 size={14} className="inline mr-1" />
            6 Cams
          </button>
        </div>

        {/* Single View Mode */}
        {viewMode === "single" && selectedCamera && (
          <div className="mb-6">
            {cameras.find((c) => c.id === selectedCamera) && (
              <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/30 relative">
                {/* Camera Feed Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera size={48} className="text-cyan-400/30 mx-auto mb-2" />
                    <p className="text-slate-400">
                      {cameras.find((c) => c.id === selectedCamera)?.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {cameras.find((c) => c.id === selectedCamera)?.location}
                    </p>
                  </div>
                </div>

                {/* Live Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-full animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="text-xs font-bold text-white">LIVE</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Multi-Camera Grid View */}
        {viewMode !== "single" && selectedCameras.size > 0 && (
          <div className={`mb-6 grid ${getGridClass()} gap-4`}>
            {cameras
              .filter((c) => selectedCameras.has(c.id))
              .map((camera, index) => (
                <div
                  key={camera.id}
                  className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/30 relative group animate-slideInUp"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Camera Feed Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Camera size={32} className="text-cyan-400/30 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">{camera.name}</p>
                      <p className="text-xs text-slate-500">{camera.location}</p>
                    </div>
                  </div>

                  {/* Live Indicator */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-600 px-2 py-1 rounded-full animate-pulse">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span className="text-xs font-bold text-white">LIVE</span>
                  </div>

                  {/* Camera Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs font-semibold text-slate-200">
                      {camera.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-400">
                        {camera.location}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          camera.status === "streaming"
                            ? "bg-green-900/50 text-green-300"
                            : camera.status === "online"
                            ? "bg-yellow-900/50 text-yellow-300"
                            : "bg-red-900/50 text-red-300"
                        }`}
                      >
                        {camera.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Camera Selection Panel */}
        <div className="space-y-4 border-t border-cyan-500/20 pt-6">
          {/* Selection Controls */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
              Select Cameras ({selectedCameras.size}/{cameras.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={selectAllCameras}
                className="px-2 py-1 text-xs font-semibold bg-green-900/30 hover:bg-green-900/50 text-green-300 rounded border border-green-500/30 transition-all duration-300"
              >
                Select All
              </button>
              <button
                onClick={deselectAllCameras}
                className="px-2 py-1 text-xs font-semibold bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded border border-red-500/30 transition-all duration-300"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Camera Grid Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {cameras.map((camera) => (
              <button
                key={camera.id}
                onClick={() => toggleCameraSelection(camera.id)}
                className={`p-3 rounded-lg transition-all duration-300 border-2 ${
                  selectedCameras.has(camera.id)
                    ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/30"
                    : "border-cyan-500/20 bg-slate-800/50 hover:border-cyan-500/50 hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <Camera size={18} className="text-cyan-400" />
                  <span
                    className={`w-2 h-2 rounded-full ${
                      camera.status === "streaming"
                        ? "bg-green-500 animate-pulse"
                        : camera.status === "online"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  {camera.name}
                </p>
                <p className="text-xs text-slate-400">{camera.location}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-cyan-500/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {cameras.filter((c) => c.status === "streaming").length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Streaming</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {cameras.filter((c) => c.status === "online").length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Online</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {cameras.filter((c) => c.status === "offline").length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Offline</p>
          </div>
        </div>
      </div>
    </div>
  );
}
