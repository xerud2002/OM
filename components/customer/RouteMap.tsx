import { useState, useEffect, useCallback, useRef } from "react";
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { TruckIcon } from "@heroicons/react/24/outline";

type RouteMapProps = {
  fromCity: string;
  fromCounty?: string;
  toCity: string;
  toCounty?: string;
};

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

/* ------------------------------------------------------------------ */
/*  Inner component – has access to the map instance via hooks        */
/* ------------------------------------------------------------------ */
function DirectionsRenderer({
  from,
  to,
  onResult,
}: {
  from: string;
  to: string;
  onResult: (d: { distance: string; duration: string } | null) => void;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableOnResult = useCallback((d: { distance: string; duration: string } | null) => onResult(d), []);

  useEffect(() => {
    if (!map || !routesLib) return;

    // Clean up previous renderer
    if (rendererRef.current) {
      rendererRef.current.setMap(null);
    }

    const service = new routesLib.DirectionsService();
    const renderer = new routesLib.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#2563eb",
        strokeOpacity: 0.85,
        strokeWeight: 5,
      },
    });
    rendererRef.current = renderer;

    service.route(
      {
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          renderer.setDirections(result);

          const leg = result.routes[0]?.legs[0];
          if (leg) {
            // Place custom markers
            const makeMarker = (
              pos: google.maps.LatLng,
              label: string,
              color: string,
            ) =>
              new google.maps.Marker({
                position: pos,
                map,
                label: {
                  text: label,
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "13px",
                },
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 16,
                  fillColor: color,
                  fillOpacity: 1,
                  strokeColor: "#fff",
                  strokeWeight: 3,
                },
                zIndex: 10,
              });

            makeMarker(leg.start_location, "A", "#2563eb"); // blue
            makeMarker(leg.end_location, "B", "#059669"); // green

            stableOnResult({
              distance: leg.distance?.text || "",
              duration: leg.duration?.text || "",
            });
          }
        } else {
          stableOnResult(null);
        }
      },
    );

    return () => {
      renderer.setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, routesLib, from, to]);

  return null;
}

/* ------------------------------------------------------------------ */
/*  Main exported component                                           */
/* ------------------------------------------------------------------ */
export default function RouteMap({
  fromCity,
  fromCounty,
  toCity,
  toCounty,
}: RouteMapProps) {
  const [info, setInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);
  const [error, setError] = useState(false);

  if (!API_KEY) return null;

  const origin = [fromCity, fromCounty, "Romania"].filter(Boolean).join(", ");
  const destination = [toCity, toCounty, "Romania"].filter(Boolean).join(", ");

  return (
    <div className="rounded-xl sm:rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Info banner */}
      {info && (
        <div className="flex items-center gap-3 bg-linear-to-r from-blue-50 to-emerald-50 px-4 py-3 border-b border-gray-100">
          <TruckIcon className="h-5 w-5 text-blue-600 shrink-0" />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="font-semibold text-gray-900">
              {info.distance}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">
              ~{info.duration} cu mașina
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 text-xs text-gray-400 text-center">
          Traseul nu a putut fi afișat.
        </div>
      )}

      {/* Map */}
      <div className="h-56 sm:h-72">
        <APIProvider apiKey={API_KEY}>
          <Map
            defaultCenter={{ lat: 45.9432, lng: 24.9668 }} // Romania center
            defaultZoom={7}
            gestureHandling="cooperative"
            disableDefaultUI
            mapId="route-map"
            style={{ width: "100%", height: "100%" }}
          >
            <DirectionsRenderer
              from={origin}
              to={destination}
              onResult={(d) => {
                if (d) {
                  setInfo(d);
                  setError(false);
                } else {
                  setError(true);
                }
              }}
            />
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
