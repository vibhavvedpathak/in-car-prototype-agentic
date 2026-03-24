"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { Battery, Gauge } from "lucide-react";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const CarModel = dynamic(() => import("@/components/3d/CarModel"), { ssr: false });

export function CarStatusWidget() {
  return (
    <GlassPanel className="p-8 flex flex-col justify-between h-full dark:bg-gradient-to-b dark:from-[#0f111a] dark:to-[#050510] bg-gradient-to-b from-white/60 to-gray-50/60 border dark:border-white/5 border-white/50 transition-colors duration-500">
      <h3 className="dark:text-gray-400 text-gray-600 font-medium tracking-widest uppercase text-xs mb-4">Vehicle Status</h3>
      
      <div className="flex-1 relative min-h-[200px]">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center dark:text-gray-600 text-gray-400">Loading 3D Model...</div>}>
          <CarModel />
        </Suspense>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl dark:bg-emerald-500/10 bg-emerald-100 flex items-center justify-center">
            <Battery className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="dark:text-white text-gray-900 font-semibold text-lg">78%</p>
            <p className="dark:text-gray-500 text-gray-500 text-xs">Battery</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl dark:bg-blue-500/10 bg-blue-100 flex items-center justify-center">
            <Gauge className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="dark:text-white text-gray-900 font-semibold text-lg">245 km</p>
            <p className="dark:text-gray-500 text-gray-500 text-xs">Range</p>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
