"use client";

import React, { useEffect } from "react";
import { useSites } from "@/hooks/useAPI";
import { ConstructionSiteResponse } from "@/lib/types";

export default function SitesListContainer() {
  const { data: sites, loading, error, refetch } = useSites(undefined, 0, 50);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(refetch, 10000);
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Construction Sites</h2>
        <button
          onClick={() => refetch()}
          disabled={loading}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-200 p-3 rounded mb-4">
          Error loading sites: {error}
        </div>
      )}

      {loading && !sites ? (
        <div className="text-center py-8 text-slate-400">Loading sites...</div>
      ) : !sites || sites.length === 0 ? (
        <div className="text-center py-8 text-slate-400">No sites configured</div>
      ) : (
        <div className="grid gap-4">
          {sites.map((site: ConstructionSiteResponse) => (
            <div key={site.id} className="border border-slate-700 rounded p-4 hover:border-slate-600">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-blue-400">{site.site_name}</h3>
                  <p className="text-sm text-slate-400">Order: {(site as any).site_order || 0}</p>
                </div>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded">
                  Manager: {site.manager_name}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <p>📍 Lat: {site.latitude.toFixed(4)}</p>
                <p>📞 {site.manager_phone}</p>
                <p>🗓️ Start: {new Date(site.start_date).toLocaleDateString()}</p>
                <p>🗓️ End: {new Date(site.end_date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
