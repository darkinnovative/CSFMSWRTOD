"use client";

import React, { useState } from "react";
import { useSites } from "@/hooks/useAPI";
import { ConstructionSiteResponse } from "@/lib/types";
import { ArrowUp, ArrowDown, GripVertical } from "lucide-react";

export default function SiteReorder() {
  const { data: sites, loading, error, refetch } = useSites(undefined, 0, 100);
  const [isReordering, setIsReordering] = useState(false);

  const moveSite = async (siteId: number, newOrder: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/sites/${siteId}/reorder`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_order: newOrder }),
      });

      await refetch();
    } catch (error) {
      console.error('Failed to reorder site:', error);
    }
  };

  const moveUp = async (index: number) => {
    if (index > 0 && sites) {
      const site = sites[index];
      const siteAbove = sites[index - 1];
      await moveSite(site.id, siteAbove.site_order || index - 1);
      await moveSite(siteAbove.id, site.site_order || index);
    }
  };

  const moveDown = async (index: number) => {
    if (sites && index < sites.length - 1) {
      const site = sites[index];
      const siteBelow = sites[index + 1];
      await moveSite(site.id, siteBelow.site_order || index + 1);
      await moveSite(siteBelow.id, site.site_order || index);
    }
  };

  if (loading) return <div className="text-center py-8 text-slate-400">Loading sites...</div>;
  if (error) return <div className="text-center py-8 text-red-400">Error: {error}</div>;
  if (!sites || sites.length === 0) return <div className="text-center py-8 text-slate-400">No sites to reorder</div>;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Reorder Sites</h2>
        <button
          onClick={() => setIsReordering(!isReordering)}
          className={`px-3 py-1 rounded text-sm ${
            isReordering 
              ? "bg-green-600 hover:bg-green-700" 
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isReordering ? "Save Order" : "Start Reordering"}
        </button>
      </div>

      <div className="space-y-2">
        {sites.map((site: ConstructionSiteResponse, index: number) => (
          <div
            key={site.id}
            className={`flex items-center gap-3 p-3 rounded border ${
              isReordering ? "border-cyan-500 bg-cyan-500/10" : "border-slate-700"
            }`}
          >
            {isReordering && (
              <>
                <GripVertical size={16} className="text-slate-400" />
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 hover:bg-slate-700 rounded disabled:opacity-50"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === sites.length - 1}
                    className="p-1 hover:bg-slate-700 rounded disabled:opacity-50"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </>
            )}
            <div className="flex-1">
              <div className="font-medium">{site.site_name}</div>
              <div className="text-sm text-slate-400">
                Order: {(site as any).site_order || 0} | Manager: {site.manager_name}
              </div>
            </div>
            <div className="text-xs bg-slate-700 px-2 py-1 rounded">
              Status: {site.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
