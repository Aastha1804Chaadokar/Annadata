'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface FarmMapProps {
  latitude: number;
  longitude: number;
  onLocationSelect: (lat: number, lng: number) => void;
  className?: string;
}

export const FarmMap: React.FC<FarmMapProps> = ({
  latitude,
  longitude,
  onLocationSelect,
  className = 'h-[450px] w-full',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerInstanceRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix standard Leaflet default icon paths in Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // Initialize Leaflet Map if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 12,
        zoomControl: true,
      });

      // Light OpenStreetMap Agricultural Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Annadata Map',
      }).addTo(map);

      // Custom Green Agricultural Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-farm-marker',
        html: `<div style="background-color: #3F7D3A; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">🌾</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      // Create Draggable Marker on Selected Location
      const marker = L.marker([latitude, longitude], {
        draggable: true,
        icon: customIcon,
      }).addTo(map);

      marker.bindPopup('<strong style="color: #285C32;">Farm Location Selected</strong>').openPopup();

      // Listen for map click to reposition marker
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onLocationSelect(lat, lng);
      });

      // Listen for marker drag end
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        onLocationSelect(position.lat, position.lng);
      });

      mapInstanceRef.current = map;
      markerInstanceRef.current = marker;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerInstanceRef.current = null;
      }
    };
  }, []);

  // Update map view & marker position when lat/lng props change
  useEffect(() => {
    if (mapInstanceRef.current && markerInstanceRef.current) {
      const currentPos = markerInstanceRef.current.getLatLng();
      if (currentPos.lat !== latitude || currentPos.lng !== longitude) {
        markerInstanceRef.current.setLatLng([latitude, longitude]);
        mapInstanceRef.current.setView([latitude, longitude], 13, {
          animate: true,
        });
      }
    }
  }, [latitude, longitude]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-2 border-[#3F7D3A]/20 shadow-sm bg-[#EEF5E8]">
      <div ref={mapContainerRef} className={className} />
    </div>
  );
};
