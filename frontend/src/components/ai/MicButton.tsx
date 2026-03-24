"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, Send, AudioLines } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";

// Extend Window for browser Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export function MicButton() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const { addMessage, setDestination, setClimate, setMedia } = useAppStore();

  // ─── Process command via backend ───
  const processTextCommand = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    addMessage("user", text);
    setIsProcessing(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      const intent = data.intent;
      const action = data.action;

      if (intent === "navigation" && action?.destination) {
        setDestination(action.destination);
      } else if (intent === "climate" && action?.temperature) {
        setClimate(action.temperature);
      } else if (intent === "media") {
        if (action?.command === "play") {
          setMedia(true, action.song, action.artist);
        } else if (action?.command === "pause") {
          setMedia(false);
        }
      } else if (intent === "emotion" && action?.actions) {
        // A2A: Emotion agent delegates to media + climate sub-agents
        for (const sub of action.actions) {
          if (sub.type === "media" && sub.command === "play") {
            setMedia(true, sub.song, sub.artist);
          }
          if (sub.type === "climate" && sub.temperature) {
            setClimate(sub.temperature);
          }
        }
      } else if (intent === "multi" && action?.actions) {
        for (const sub of action.actions) {
          if (sub.type === "navigation" && sub.destination) setDestination(sub.destination);
          if (sub.type === "climate" && sub.temperature) setClimate(sub.temperature);
          if (sub.type === "media") {
            if (sub.command === "play") setMedia(true, sub.song, sub.artist);
            else if (sub.command === "pause") setMedia(false);
          }
        }
      }

      addMessage("ai", data.message);

      // Play TTS audio
      if (data.audio_base64) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio_base64}`);
        audio.play().catch((e) => console.error("TTS playback error:", e));
      }
    } catch (err) {
      console.error("Agent request failed:", err);
      addMessage("ai", "Sorry, I couldn't connect to the AI backend.");
    } finally {
      setIsProcessing(false);
    }
  }, [addMessage, setDestination, setClimate, setMedia]);

  // ─── Web Speech API: start / stop listening ───
  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support Speech Recognition. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Show interim text live in the input field
      if (interimTranscript) {
        setTranscript(interimTranscript);
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
        // Auto-send the final recognized voice command
        processTextCommand(finalTranscript);
        setTranscript("");
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setShowInput(true);
  }, [processTextCommand]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // ─── Text submit handler ───
  const handleSubmit = () => {
    if (transcript.trim()) {
      processTextCommand(transcript);
      setTranscript("");
    }
  };

  // ─── Toggle mic ───
  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 dark:bg-white/5 bg-white/80 backdrop-blur-xl rounded-2xl border dark:border-white/10 border-gray-200 px-4 py-3">
              {isListening && (
                <div className="flex items-center gap-1.5 mr-1">
                  <AudioLines className="w-4 h-4 text-red-500 animate-pulse" />
                  <span className="text-red-400 text-[10px] font-medium tracking-wider uppercase">Listening</span>
                </div>
              )}
              <input
                ref={inputRef}
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder={isListening ? "Speak now..." : "Type a command..."}
                className="flex-1 bg-transparent outline-none dark:text-white text-gray-900 placeholder:dark:text-gray-500 placeholder:text-gray-400 text-sm"
                disabled={isProcessing}
              />
              <button
                onClick={handleSubmit}
                disabled={isProcessing || !transcript.trim()}
                className="w-8 h-8 rounded-lg dark:bg-cyan-500/20 bg-cyan-100 flex items-center justify-center dark:text-cyan-400 text-cyan-600 hover:scale-110 transition-transform disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mic Button */}
      <button
        onClick={toggleMic}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
          isListening
            ? "bg-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.5)] animate-pulse"
            : showInput
              ? "bg-cyan-500 text-white shadow-[0_0_40px_rgba(6,182,212,0.5)]"
              : "dark:bg-white/5 bg-white/80 backdrop-blur-xl border dark:border-white/10 border-gray-200 dark:text-white text-gray-800 dark:hover:bg-white/10 hover:bg-white"
        }`}
      >
        {isProcessing ? (
          <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isListening ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
