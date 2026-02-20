import { useEffect, useRef } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

/* Major Romanian cities with approximate coords */
const CITIES: { name: string; lat: number; lng: number }[] = [
  { name: "București", lat: 44.4268, lng: 26.1025 },
  { name: "Cluj-Napoca", lat: 46.7712, lng: 23.6236 },
  { name: "Timișoara", lat: 45.7489, lng: 21.2087 },
  { name: "Iași", lat: 47.1585, lng: 27.6014 },
  { name: "Constanța", lat: 44.1598, lng: 28.6348 },
  { name: "Brașov", lat: 45.6427, lng: 25.5887 },
  { name: "Sibiu", lat: 45.7983, lng: 24.1256 },
  { name: "Oradea", lat: 47.0465, lng: 21.9189 },
  { name: "Craiova", lat: 44.3302, lng: 23.7949 },
  { name: "Galați", lat: 45.4353, lng: 28.0080 },
  { name: "Ploiești", lat: 44.9414, lng: 26.0279 },
  { name: "Pitești", lat: 44.8565, lng: 24.8692 },
  { name: "Arad", lat: 46.1754, lng: 21.3192 },
  { name: "Suceava", lat: 47.6514, lng: 26.2556 },
  { name: "Târgu Mureș", lat: 46.5453, lng: 24.5578 },
  { name: "Baia Mare", lat: 47.6567, lng: 23.5850 },
  { name: "Alba Iulia", lat: 46.0688, lng: 23.5803 },
  { name: "Deva", lat: 45.8838, lng: 22.9014 },
  { name: "Râmnicu Vâlcea", lat: 45.0997, lng: 24.3693 },
  { name: "Bacău", lat: 46.5670, lng: 26.9146 },
];

function CityMarkers() {
  const map = useMap();
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!map) return;

    // Clean previous
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    CITIES.forEach((city) => {
      const marker = new google.maps.Marker({
        position: { lat: city.lat, lng: city.lng },
        map,
        title: city.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#059669",
          fillOpacity: 0.85,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
        zIndex: 5,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="font-family:system-ui;font-size:13px;font-weight:600;color:#1e293b;padding:2px 4px">${city.name}</div>`,
      });

      marker.addListener("mouseover", () => infoWindow.open(map, marker));
      marker.addListener("mouseout", () => infoWindow.close());

      markersRef.current.push(marker);
    });

    // Add pulse animation styles
    const style = document.createElement("style");
    style.textContent = `
      .partner-map .gm-style a[href*="google"],
      .partner-map .gm-style a[href*="terms"],
      .partner-map .gm-style .gmnoscreen,
      .partner-map .gm-style-cc { display:none!important; }
      .partner-map .gm-style img[alt="Google"] { display:none!important; }
    `;
    document.head.appendChild(style);

    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      style.remove();
    };
  }, [map]);

  return null;
}

export default function PartnerMap() {
  if (!API_KEY) return null;

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="partner-map h-72 sm:h-96">
        <Map
          defaultCenter={{ lat: 45.9432, lng: 25.0 }}
          defaultZoom={7}
          gestureHandling="cooperative"
          disableDefaultUI
          mapId="partner-map"
          style={{ width: "100%", height: "100%" }}
        >
          <CityMarkers />
        </Map>
      </div>
    </APIProvider>
  );
}
