"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create a modern glowing cyan marker icon to match the UI scheme
const glowingIcon = new L.DivIcon({
  html: `<div style="width: 24px; height: 24px; background: white; border: 4px solid #06b6d4; border-radius: 50%; box-shadow: 0 0 20px #06b6d4, inset 0 0 10px #06b6d4; display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background: #06b6d4; border-radius: 50%;"></div></div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Component to handle map view updates dynamically
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    // Force Leaflet to recalculate its container size to fix cut-off tiles
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(map.getContainer());

    map.flyTo(center, 13, { duration: 2 });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [center, map]);
  return null;
}

export default function Map({ destination }: { destination: string | null }) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!destination) return;
    
    // Reverse Geocode using Nominatim API (OpenStreetMap)
    const fetchCoords = async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`);
        const data = await res.json();
        if (data && data.length > 0) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      } catch (e) {
        console.error("Geocoding failed", e);
      }
    };
    fetchCoords();
  }, [destination]);

  if (!destination || !position) return null;

  return (
    <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen drop-shadow-2xl">
      <div className="absolute inset-0 z-10 pointer-events-none" style={{
         background: "radial-gradient(ellipse at center, transparent 30%, rgba(8, 9, 15, 1) 100%)"
      }} />
      <MapContainer 
        center={position} 
        zoom={13} 
        zoomControl={false}
        attributionControl={false}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} icon={glowingIcon} />
        <MapUpdater center={position} />
      </MapContainer>
    </div>
  );
}
