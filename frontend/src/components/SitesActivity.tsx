"use client";

import React, { useState, useEffect } from "react";
import { Activity, TrendingUp, Users, Zap, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SiteActivity {
  id: string;
  site: string;
  activity: string;
  type: "detection" | "alert" | "equipment" | "personnel" | "progress";
  timestamp: string;
  details: string;
  severity?: "low" | "medium" | "high";
}

interface SitesActivityProps {
  compact?: boolean;
}

const INITIAL_ACTIVITIES: SiteActivity[] = [
  {
    id: "act-1",
    site: "Downtown Office Complex",
    activity: "Safety Helmet Detection",
    type: "detection",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    details: "Employee detected without safety gear at main entrance",
    severity: "high",
  },
  {
    id: "act-2",
    site: "Harbor Bridge Renovation",
    activity: "Equipment Movement",
    type: "equipment",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    details: "Crane #3 moved to Construction Zone B",
    severity: "low",
  },
  {
    id: "act-3",
    site: "Downtown Office Complex",
    activity: "Personnel Count",
    type: "personnel",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    details: "28 workers checked in at site",
    severity: "low",
  },
  {
    id: "act-4",
    site: "Airport Terminal Expansion",
    activity: "Safety Alert",
    type: "alert",
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    details: "Unauthorized access attempt detected",
    severity: "high",
  },
  {
    id: "act-5",
    site: "Harbor Bridge Renovation",
    activity: "Progress Update",
    type: "progress",
    timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    details: "Foundation work completed - 85% done",
    severity: "low",
  },
];

export default function SitesActivity({ compact = false }: SitesActivityProps) {
  const [activities, setActivities] = useState<SiteActivity[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    // Initialize activities only on client side after hydration
    setActivities(INITIAL_ACTIVITIES);
  }, []);

  const getActivityIcon = (type: SiteActivity["type"]) => {
    switch (type) {
      case "detection":
        return <Zap size={18} className="text-cyan-400" />;
      case "alert":
        return <AlertCircle size={18} className="text-red-400" />;
      case "equipment":
        return <TrendingUp size={18} className="text-purple-400" />;
      case "personnel":
        return <Users size={18} className="text-green-400" />;
      case "progress":
        return <Activity size={18} className="text-blue-400" />;
      default:
        return <Activity size={18} className="text-slate-400" />;
    }
  };

  const getActivityColor = (type: SiteActivity["type"], severity?: string) => {
    if (severity === "high")
      return "bg-red-900/20 border-red-500/30 text-red-300";
    if (severity === "medium")
      return "bg-yellow-900/20 border-yellow-500/30 text-yellow-300";

    switch (type) {
      case "detection":
        return "bg-cyan-900/20 border-cyan-500/30 text-cyan-300";
      case "alert":
        return "bg-red-900/20 border-red-500/30 text-red-300";
      case "equipment":
        return "bg-purple-900/20 border-purple-500/30 text-purple-300";
      case "personnel":
        return "bg-green-900/20 border-green-500/30 text-green-300";
      case "progress":
        return "bg-blue-900/20 border-blue-500/30 text-blue-300";
      default:
        return "bg-slate-900/20 border-slate-500/30 text-slate-300";
    }
  };

  const filteredActivities =
    filter === "all"
      ? activities
      : activities.filter((a) => a.type === filter);

  const alertCount = activities.filter((a) => a.severity === "high").length;
  const detectionCount = activities.filter((a) => a.type === "detection").length;

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20 rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 animate-slideInUp">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <Activity size={20} />
              Site Activity
            </h3>
            <span className="px-3 py-1 bg-red-900/30 text-red-300 text-xs rounded-full border border-red-500/30 font-bold">
              {alertCount} Alert{alertCount !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Recent Activities */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredActivities.slice(0, 5).map((activity, index) => (
              <div
                key={activity.id}
                className={`p-3 rounded-lg border ${getActivityColor(
                  activity.type,
                  activity.severity
                )} transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-slideInUp`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{activity.activity}</p>
                    <p className="text-xs opacity-80 truncate">{activity.site}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20 rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 animate-slideInUp">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <Activity size={24} />
            Sites Activity Log
          </h2>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-red-900/30 text-red-300 text-xs rounded-full border border-red-500/30 font-bold">
              {alertCount} Alerts
            </div>
            <div className="px-3 py-1.5 bg-cyan-900/30 text-cyan-300 text-xs rounded-full border border-cyan-500/30 font-bold">
              {detectionCount} Detections
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "detection", "alert", "equipment", "personnel", "progress"].map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  filter === f
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/50"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-cyan-300 border border-cyan-500/20"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Activity List */}
        <div className="space-y-3">
          {filteredActivities.map((activity, index) => (
            <div
              key={activity.id}
              className={`p-4 rounded-lg border ${getActivityColor(
                activity.type,
                activity.severity
              )} transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-slideInUp`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm">{activity.activity}</p>
                      <p className="text-xs opacity-75">{activity.site}</p>
                    </div>
                    {activity.severity === "high" && (
                      <span className="px-2 py-1 bg-red-600/50 text-red-100 text-xs rounded font-bold flex-shrink-0">
                        HIGH
                      </span>
                    )}
                  </div>
                  <p className="text-sm mt-2 opacity-90">{activity.details}</p>
                  <p className="text-xs opacity-60 mt-2">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Footer */}
        <div className="mt-6 pt-6 border-t border-cyan-500/20 grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-cyan-400">
              {activities.length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Total Activities</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-400">{alertCount}</div>
            <p className="text-xs text-slate-400 mt-1">High Priority</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">
              {activities.filter((a) => a.type === "personnel").length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Personnel</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-400">
              {activities.filter((a) => a.type === "equipment").length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Equipment</p>
          </div>
        </div>
      </div>
    </div>
  );
}
