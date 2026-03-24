import { create } from "zustand";

interface AppState {
  // Media
  isPlaying: boolean;
  currentSong: string;
  currentArtist: string;
  setMedia: (playing?: boolean, song?: string, artist?: string) => void;

  // Climate
  temperature: number;
  setClimate: (temp: number) => void;

  // Navigation
  destination: string | null;
  setDestination: (dest: string | null) => void;

  // AI Chat
  messages: { role: "user" | "ai"; text: string }[];
  addMessage: (role: "user" | "ai", text: string) => void;

  // Theme
  isDark: boolean;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Media
  isPlaying: false,
  currentSong: "Neon Nights",
  currentArtist: "Synthwave FM",
  setMedia: (playing, song, artist) =>
    set((s) => ({
      isPlaying: playing ?? s.isPlaying,
      currentSong: song ?? s.currentSong,
      currentArtist: artist ?? s.currentArtist,
    })),

  // Climate
  temperature: 22,
  setClimate: (temp) => set({ temperature: temp }),

  // Navigation
  destination: null,
  setDestination: (dest) => set({ destination: dest }),

  // AI Chat
  messages: [],
  addMessage: (role, text) =>
    set((s) => ({ messages: [...s.messages, { role, text }] })),

  // Theme
  isDark: true,
  toggleTheme: () =>
    set((s) => {
      const newDark = !s.isDark;
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", newDark);
      }
      return { isDark: newDark };
    }),
}));
