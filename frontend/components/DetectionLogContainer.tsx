"use client";

import React, { useEffect } from "react";
import { useLatestDetections } from "@/hooks/useAPI";
import { DetectionEventResponse } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

export default function DetectionLogContainer() {
  const { data: detections, loading, error, refetch } = useLatestDetections(20);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(refetch, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Latest Detections</h2>
        <button
          onClick={() => refetch()}
          disabled={loading}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-200 p-3 rounded mb-4">
          Error loading detections: {error}
        </div>
      )}

      {loading && !detections ? (
        <div className="text-center py-8 text-slate-400">Loading detections...</div>
      ) : !detections || detections.length === 0 ? (
        <div className="text-center py-8 text-slate-400">No detections yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700">
              <tr>
                <th className="text-left py-2 px-2">Object Type</th>
                <th className="text-left py-2 px-2">Confidence</th>
                <th className="text-left py-2 px-2">Device</th>
                <th className="text-left py-2 px-2">Time</th>
                <th className="text-left py-2 px-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {detections.map((detection: DetectionEventResponse) => {
                const timeAgo = formatDistanceToNow(new Date(detection.timestamp), {
                  addSuffix: true,
                });
                const confidencePercent = (detection.confidence * 100).toFixed(1);

                return (
                  <tr key={detection.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="py-3 px-2 font-semibold text-blue-400">
                      {detection.object_type}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          detection.confidence > 0.8
                            ? "bg-green-900 text-green-200"
                            : detection.confidence > 0.5
                            ? "bg-yellow-900 text-yellow-200"
                            : "bg-red-900 text-red-200"
                        }`}
                      >
                        {confidencePercent}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-300">{detection.device_id}</td>
                    <td className="py-3 px-2 text-slate-400">{timeAgo}</td>
                    <td className="py-3 px-2 text-slate-400">{detection.location || "N/A"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
