"use client";

import React, { useEffect } from "react";
import { useAttendanceStats } from "@/hooks/useAPI";

interface AttendanceTrackerProps {
  companyId?: number;
}

export default function AttendanceTrackerContainer({ companyId = 1 }: AttendanceTrackerProps) {
  const { data: stats, loading, error, refetch } = useAttendanceStats(companyId);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(refetch, 10000);
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">👥 Attendance</h2>
        <button
          onClick={() => refetch()}
          disabled={loading}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-200 p-3 rounded mb-4">
          Error loading attendance: {error}
        </div>
      )}

      {loading && !stats ? (
        <div className="text-center py-8 text-slate-400">Loading attendance data...</div>
      ) : !stats ? (
        <div className="text-center py-8 text-slate-400">No attendance data available</div>
      ) : (
        <div>
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-blue-900/20 border border-blue-700 rounded p-3">
              <p className="text-xs text-slate-400">Total Employees</p>
              <p className="text-2xl font-bold text-blue-400">
                {(stats as any).total_employees || 0}
              </p>
            </div>
            <div className="bg-green-900/20 border border-green-700 rounded p-3">
              <p className="text-xs text-slate-400">Present Today</p>
              <p className="text-2xl font-bold text-green-400">
                {(stats as any).present_today || 0}
              </p>
            </div>
            <div className="bg-red-900/20 border border-red-700 rounded p-3">
              <p className="text-xs text-slate-400">Absent Today</p>
              <p className="text-2xl font-bold text-red-400">
                {(stats as any).absent_today || 0}
              </p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-700 rounded p-3">
              <p className="text-xs text-slate-400">Attendance Rate</p>
              <p className="text-2xl font-bold text-yellow-400">
                {((stats as any).attendance_rate * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Attendees List */}
          <div className="mt-4">
            <h3 className="font-bold mb-3 text-sm">Employee Details</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {(stats as any).by_employee?.map((emp: any) => (
                <div key={emp.employee_id} className="border border-slate-700 rounded p-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold text-blue-300">{emp.full_name}</span>
                    <span className={emp.check_in_time ? "text-green-400" : "text-slate-500"}>
                      {emp.check_in_time ? "✓ Present" : "✗ Absent"}
                    </span>
                  </div>
                  {emp.check_in_time && (
                    <p className="text-xs text-slate-400">
                      In: {new Date(emp.check_in_time).toLocaleTimeString()} | Out:{" "}
                      {emp.check_out_time
                        ? new Date(emp.check_out_time).toLocaleTimeString()
                        : "Not yet"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
