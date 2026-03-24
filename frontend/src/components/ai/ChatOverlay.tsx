"use client";

import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export function ChatOverlay() {
  const { messages } = useAppStore();
  const lastMessages = messages.slice(-4);

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4">
      <AnimatePresence>
        {lastMessages.map((msg, i) => (
          <motion.div
            key={messages.length - lastMessages.length + i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`mb-3 ${msg.role === "user" ? "flex justify-end" : "flex justify-start"}`}
          >
            <div
              className={`max-w-md px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "dark:bg-white/5 bg-gray-100 dark:text-gray-300 text-gray-700 border dark:border-white/5 border-gray-200 backdrop-blur-xl"
                  : "dark:bg-gradient-to-r dark:from-cyan-500/10 dark:to-teal-500/10 bg-gradient-to-r from-cyan-50 to-teal-50 dark:text-gray-200 text-gray-800 border dark:border-cyan-500/20 border-cyan-200 backdrop-blur-xl"
              }`}
            >
              {msg.role === "user" ? (
                <div>
                  <p className="dark:text-gray-500 text-gray-400 text-[10px] font-medium tracking-widest uppercase mb-1">Driver Command</p>
                  <p>{msg.text}</p>
                </div>
              ) : (
                <div>
                  <p className="text-cyan-500 text-[10px] font-medium tracking-widest uppercase mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Agentic AI
                  </p>
                  <p>{msg.text}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
