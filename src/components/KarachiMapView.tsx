import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Coordinates } from '../types';

interface MapViewProps {
  userLocation: Coordinates;
  sosLocation?: Coordinates | null;
  radiusMeters?: number;
  guards?: Array<{ id: string; name: string; location: Coordinates; gender: string }>;
  nearbyVictims?: Array<{ id: string; name: string; location: Coordinates; distance: number }>;
  height?: string;
  zoom?: number;
  interactive?: boolean;
  onMapClick?: (coords: Coordinates) => void;
}

export const KarachiMapView: React.FC<MapViewProps> = ({
  userLocation,
  sosLocation,
  radiusMeters = 100,
  guards = [],
  nearbyVictims = [],
  height = '320px',
  zoom = 15,
  interactive = true,
  onMapClick
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: zoom,
        zoomControl: interactive,
        attributionControl: false,
        dragging: interactive,
        touchZoom: interactive,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);

      if (onMapClick) {
        map.on('click', (e) => {
          onMapClick({
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            address: `Pin at ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`
          });
        });
      }
    } else {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], zoom);
    }

    return () => {
      // Map cleanup if needed on unmount
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    // Custom Icon Creators
    const createCustomIcon = (color: string, label: string, pulse: boolean = false) => {
      return L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="relative flex items-center justify-center">
            ${pulse ? `<div class="absolute -inset-2 rounded-full bg-${color}-500/40 animate-ping"></div>` : ''}
            <div class="w-8 h-8 rounded-full bg-slate-900 border-2 border-${color}-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              ${label}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
    };

    // User marker
    const userIcon = L.divIcon({
      className: 'user-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute -inset-3 rounded-full bg-cyan-500/30 animate-pulse"></div>
          <div class="w-7 h-7 rounded-full bg-cyan-600 border-2 border-white flex items-center justify-center text-white shadow-xl">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
    userMarker.bindPopup(`<b>Your Current Location</b><br>${userLocation.address || 'Karachi, Pakistan'}`);
    markersGroupRef.current.addLayer(userMarker);

    // Active SOS Location & 100m Broadcast Circle
    const targetSOS = sosLocation || (nearbyVictims.length > 0 ? nearbyVictims[0].location : null);
    if (targetSOS) {
      const sosIcon = L.divIcon({
        className: 'sos-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute -inset-6 rounded-full bg-rose-600/40 animate-ping"></div>
            <div class="w-10 h-10 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-2xl animate-bounce">
              SOS
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const sosMarker = L.marker([targetSOS.lat, targetSOS.lng], { icon: sosIcon });
      sosMarker.bindPopup(`
        <div style="font-size:12px; line-height:1.4;">
          <b style="color:#e11d48; font-size:14px;">CRITICAL DISTRESS SIGNAL</b><br>
          <b>Location:</b> ${targetSOS.address || 'Karachi'}<br>
          <b>100m Broadcast:</b> ACTIVE<br>
          <span style="color:#0284c7;">Authorities & Community Alerted</span>
        </div>
      `);
      markersGroupRef.current.addLayer(sosMarker);

      // Draw 100m radius ring
      if (circleRef.current) {
        circleRef.current.remove();
      }
      circleRef.current = L.circle([targetSOS.lat, targetSOS.lng], {
        radius: radiusMeters,
        color: '#e11d48',
        fillColor: '#f43f5e',
        fillOpacity: 0.18,
        weight: 2,
        dashArray: '4, 8'
      }).addTo(mapInstanceRef.current);
    }

    // Nearby Guards
    guards.forEach((g) => {
      const guardIcon = L.divIcon({
        className: 'guard-pin',
        html: `
          <div class="w-7 h-7 rounded-full bg-amber-500 border-2 border-slate-900 flex items-center justify-center text-slate-950 font-black text-[10px] shadow-md">
            🛡️
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const gMarker = L.marker([g.location.lat, g.location.lng], { icon: guardIcon });
      gMarker.bindPopup(`<b>${g.name}</b><br>Certified Guardian (${g.gender})<br>Status: Ready to deploy`);
      markersGroupRef.current?.addLayer(gMarker);
    });

    // Fit bounds if both user and SOS exist
    if (targetSOS && mapInstanceRef.current) {
      const bounds = L.latLngBounds([
        [userLocation.lat, userLocation.lng],
        [targetSOS.lat, targetSOS.lng]
      ]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }

  }, [userLocation, sosLocation, radiusMeters, guards, nearbyVictims]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-slate-900" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-2 left-2 z-[400] bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[10px] text-slate-300 font-medium flex items-center gap-1.5 shadow-md">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Karachi Live Geospatial Mesh
      </div>
      {targetSOSPresent(sosLocation, nearbyVictims) && (
        <div className="absolute bottom-2 right-2 z-[400] bg-rose-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-rose-600/80 text-[10px] text-rose-200 font-semibold flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          100m Threat Radius Active
        </div>
      )}
    </div>
  );
};

function targetSOSPresent(sosLocation?: Coordinates | null, nearbyVictims?: any[]) {
  return !!sosLocation || (nearbyVictims && nearbyVictims.length > 0);
}
