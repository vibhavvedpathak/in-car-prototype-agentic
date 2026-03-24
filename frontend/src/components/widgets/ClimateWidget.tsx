"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { Thermometer } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export function ClimateWidget() {
  const { temperature } = useAppStore();

  return (
    <GlassPanel className="p-8 flex flex-col justify-between h-full dark:bg-gradient-to-b dark:from-[#0f111a] dark:to-[#050510] bg-gradient-to-b from-white/60 to-gray-50/60 border dark:border-white/5 border-white/50 transition-colors duration-500">
      <div className="flex justify-between items-center mb-6">
        <h3 className="dark:text-gray-400 text-gray-600 font-medium tracking-widest uppercase text-xs">Climate</h3>
        <Thermometer className="w-5 h-5 dark:text-gray-500 text-gray-400" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative">
          <span className="text-8xl font-extralight dark:text-white text-gray-900 tracking-tighter">
            {temperature}
          </span>
          <span className="text-3xl font-light dark:text-gray-400 text-gray-500 absolute -top-2 -right-10">°C</span>
        </div>
        <p className="dark:text-gray-500 text-gray-500 text-sm mt-4 tracking-wide">Voice Controlled</p>
      </div>

      <div className="flex items-center justify-between mt-6 px-2">
        <div className="text-center">
          <p className="dark:text-white text-gray-900 font-medium">Auto</p>
          <p className="dark:text-gray-500 text-gray-500 text-xs">Mode</p>
        </div>
        <div className="text-center">
          <p className="dark:text-white text-gray-900 font-medium">Low</p>
          <p className="dark:text-gray-500 text-gray-500 text-xs">Fan</p>
        </div>
        <div className="text-center">
          <p className="dark:text-white text-gray-900 font-medium">On</p>
          <p className="dark:text-gray-500 text-gray-500 text-xs">A/C</p>
        </div>
      </div>
    </GlassPanel>
  );
}
