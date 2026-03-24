"use client";

import { useEffect, useState, useRef } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Play, Pause, Music } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export function MediaWidget() {
  const { isPlaying, currentSong, currentArtist, setMedia } = useAppStore();
  const [trackData, setTrackData] = useState<{ previewUrl: string, artworkUrl: string, trackName: string, artistName: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      // Default placeholder song check, to allow fallback UI
      if (!currentSong || currentSong === "Neon Nights") {
         setTrackData(null);
         return;
      }
      
      try {
        const query = encodeURIComponent(`${currentSong} ${currentArtist || ''}`);
        const res = await fetch(`https://itunes.apple.com/search?term=${query}&entity=song&limit=1`);
        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
           const track = data.results[0];
           setTrackData({
               previewUrl: track.previewUrl,
               artworkUrl: track.artworkUrl100.replace('100x100bb', '600x600bb'),
               trackName: track.trackName,
               artistName: track.artistName
           });
        } else {
           setTrackData(null);
        }
      } catch (e) {
        console.error("iTunes fetch failed", e);
        setTrackData(null);
      }
    };
    
    fetchTrack();
  }, [currentSong, currentArtist]);

  useEffect(() => {
    if (audioRef.current && trackData?.previewUrl) {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Audio playback prevented:", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying, trackData]);

  return (
    <GlassPanel className="p-8 flex flex-col justify-between h-full dark:bg-gradient-to-b dark:from-[#0f111a] dark:to-[#050510] bg-gradient-to-b from-white/60 to-gray-50/60 border dark:border-white/5 border-white/50 transition-colors duration-500">
      {/* Hidden Audio Element guaranteed to be in DOM */}
      <audio ref={audioRef} src={trackData?.previewUrl || undefined} loop autoPlay={isPlaying} />
      
      <div className="flex justify-between items-center mb-6 z-10">
        <h3 className="dark:text-gray-400 text-gray-600 font-medium tracking-widest uppercase text-xs">Now Playing</h3>
        {isPlaying ? (
          <div className="flex space-x-1.5 align-middle h-4 items-end">
            <span className="block w-1.5 h-full bg-cyan-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]"></span>
            <span className="block w-1.5 h-3/4 bg-cyan-500 rounded-full animate-[pulse_1.2s_ease-in-out_infinite_0.2s]"></span>
            <span className="block w-1.5 h-1/2 bg-cyan-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.4s]"></span>
          </div>
         ) : (
          <Music className="w-5 h-5 dark:text-gray-500 text-gray-400" />
         )}
      </div>

      <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl mb-10 flex-shrink-0 group">
        {trackData?.artworkUrl ? (
           <>
              <div className={`absolute inset-0 transition-opacity duration-1000 ${isPlaying ? 'opacity-0' : 'opacity-40 bg-black'} z-10`}></div>
              <img src={trackData.artworkUrl} className="absolute inset-0 w-full h-full object-cover z-0" alt="Album Art" />
           </>
        ) : (
           <>
              <div className={`absolute inset-0 transition-all duration-1000 ${isPlaying ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 mix-blend-overlay opacity-90' : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900'} z-10`}></div>
              <div className="absolute inset-0 dark:bg-[#080808] bg-gray-100 flex flex-col items-center justify-center">
                 <h2 className="dark:text-white text-gray-900 text-3xl font-black tracking-tighter uppercase z-20 text-center px-4 leading-tight shadow-black drop-shadow-sm">
                    {currentSong.split(' ').map((word, i) => (
                      <span key={i} className="block">{word}</span>
                    ))}
                 </h2>
              </div>
           </>
        )}
      </div>

      <div className="text-center mb-10 z-10">
        <h4 className="text-3xl font-bold dark:text-white text-gray-900 truncate drop-shadow-sm">
           {trackData ? trackData.trackName : currentSong}
        </h4>
        <p className="dark:text-gray-400 text-gray-600 text-lg mt-2 font-light">
           {trackData ? trackData.artistName : currentArtist}
        </p>
      </div>

      <div className="flex items-center justify-center mt-auto pb-4 z-10">
          <button 
            onClick={() => setMedia(!isPlaying)}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-105 duration-300 ${
              isPlaying 
                ? "bg-cyan-500/20 border-2 border-cyan-500/50 text-cyan-500 dark:text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)]" 
                : "dark:bg-white/5 bg-gray-200 border dark:border-white/10 border-gray-300 dark:text-white text-gray-800 dark:hover:bg-white/10 hover:bg-gray-300"
            }`}
          >
            {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 ml-2 fill-current" />}
          </button>
      </div>
    </GlassPanel>
  );
}
