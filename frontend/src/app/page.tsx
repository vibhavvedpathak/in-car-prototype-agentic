"use client";

import { CarStatusWidget } from "@/components/widgets/CarStatusWidget";
import { ClimateWidget } from "@/components/widgets/ClimateWidget";
import { NavigationWidget } from "@/components/widgets/NavigationWidget";
import { MediaWidget } from "@/components/widgets/MediaWidget";
import { MicButton } from "@/components/ai/MicButton";
import { ChatOverlay } from "@/components/ai/ChatOverlay";
import { useAppStore } from "@/store/useAppStore";
import { Sun, Moon } from "lucide-react";

export default function Dashboard() {
  const { isDark, toggleTheme } = useAppStore();

  return (
    <div className="h-screen w-screen dark:bg-[#08090f] bg-gray-50 p-6 flex flex-col gap-6 overflow-hidden transition-colors duration-500">
      {/* Header */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="dark:text-white text-gray-900 text-xl font-semibold tracking-tight">
            In-Car <span className="text-cyan-500">AI</span> Assistant
          </h1>
          <p className="dark:text-gray-500 text-gray-500 text-xs mt-0.5 tracking-wide">Multimodal Agentic System</p>
        </div>
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl dark:bg-white/5 bg-gray-200 flex items-center justify-center dark:text-gray-400 text-gray-600 dark:hover:bg-white/10 hover:bg-gray-300 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-4 gap-6 min-h-0">
        {/* Left Column: Car Status + Climate */}
        <div className="flex flex-col gap-6">
          <div className="flex-1">
            <CarStatusWidget />
          </div>
          <div className="flex-1">
            <ClimateWidget />
          </div>
        </div>

        {/* Center: Navigation (spans 2 columns) */}
        <div className="col-span-2">
          <NavigationWidget />
        </div>

        {/* Right Column: Media */}
        <div>
          <MediaWidget />
        </div>
      </div>

      {/* AI Overlay */}
      <ChatOverlay />
      <MicButton />
    </div>
  );
}
