"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { Navigation } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import DynamicMap from "./DynamicMap";

export function NavigationWidget() {
  const { destination } = useAppStore();

  return (
    <GlassPanel className="relative p-8 flex flex-col h-full overflow-hidden dark:bg-gradient-to-b dark:from-[#0f111a] dark:to-[#050510] bg-gradient-to-b from-white/60 to-gray-50/60 border dark:border-white/5 border-white/50 transition-colors duration-500">
      {/* Dynamic Map Background */}
      <DynamicMap destination={destination} />

      {/* Header Overlay */}
      <div className="relative z-20 flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl dark:bg-cyan-500/10 bg-cyan-100 flex items-center justify-center flex-shrink-0">
          <Navigation className="w-7 h-7 text-cyan-500" />
        </div>
        <div>
          <p className="dark:text-gray-400 text-gray-600 text-xs font-medium tracking-widest uppercase">Current Destination</p>
          <h3 className="dark:text-white text-gray-900 text-2xl font-bold mt-1">
            {destination || "No route set"}
          </h3>
        </div>
      </div>

      {/* Empty state grid lines when no route */}
      {!destination && (
        <div className="flex-1 relative">
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)",
              backgroundSize: "40px 40px"
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="dark:text-gray-600 text-gray-400 text-sm">Say &quot;Navigate to...&quot; to set a route</p>
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
