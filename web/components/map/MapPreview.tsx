'use client';

import React from 'react';
import { MapPin as MapPinIcon } from 'lucide-react';

interface MapPreviewProps {
  latitude: number;
  longitude: number;
  accuracy?: number;
  village?: string;
  district?: string;
  state?: string;
  className?: string;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  latitude,
  longitude,
  accuracy,
  village,
  district,
  state,
  className = '',
}) => {
  // Compute bbox bounding box for OpenStreetMap embed iframe
  const delta = 0.008;
  const bbox = `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div className={`rounded-2xl overflow-hidden border border-[#DCECCF] bg-stone-50 shadow-sm ${className}`}>
      {/* Map Header */}
      <div className="p-3 bg-[#EEF5E8] border-b border-[#DCECCF] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#3F7D3A] font-bold">
          <MapPinIcon className="w-4 h-4 text-[#3F7D3A]" />
          <span>📍 Farm Location Coordinates ({latitude.toFixed(4)}°, {longitude.toFixed(4)}°)</span>
        </div>
        {accuracy !== undefined && (
          <span className="text-[11px] font-semibold text-[#667267]">
            ~{accuracy}m accuracy
          </span>
        )}
      </div>

      {/* Embed Map Frame */}
      <div className="relative h-48 sm:h-56 w-full bg-stone-100">
        <iframe
          title="Detected Farm Location Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={embedUrl}
          className="w-full h-full border-0"
        />

        {/* Floating Overlay Badge */}
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 text-[11px] text-[#285C32] font-extrabold shadow-sm flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{village || 'Detected Farm'}, {district || ''}</span>
        </div>
      </div>
    </div>
  );
};
