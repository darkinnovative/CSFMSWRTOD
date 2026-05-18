"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";

interface Detection {
  id: number;
  object_type: string;
  confidence: number;
  timestamp: string;
  image_path: string;
  device_id: string;
}

interface DetectionLogProps {
  detections: Detection[];
  loading: boolean;
}

export default function DetectionLog({
  detections,
  loading,
}: DetectionLogProps) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Latest Detections</h2>
      {loading ? (
        <div className="text-center py-8 text-slate-400">
          Loading detections...
        </div>
      ) : detections.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          No detections yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700">
              <tr>
                <th className="text-left py-2 px-2">Object Type</th>
                <th className="text-left py-2 px-2">Confidence</th>
                <th className="text-left py-2 px-2">Device ID</th>
                <th className="text-left py-2 px-2">Time</th>
                <th className="text-left py-2 px-2">Image</th>
              </tr>
            </thead>
            <tbody>
              {detections.map((detection) => {
                const timeAgo = formatDistanceToNow(
                  new Date(detection.timestamp),
                  { addSuffix: true }
                );
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
                    <td className="py-3 px-2">
                      {detection.image_path ? (
                        <a
                          href={detection.image_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline text-xs"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
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
