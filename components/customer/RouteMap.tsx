import { useState, useEffect, useCallback, useRef } from "react";
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import {
  TruckIcon,
  MapPinIcon,
  ArrowPathIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";

type RouteMapProps = {
  fromCity: string;
  fromCounty?: string;
  toCity: string;
  toCounty?: string;
  companyCity?: string;
  companyCounty?: string;
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
  onResult: (d: { distance: string; duration: string; km: number } | null) => void;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableOnResult = useCallback((d: { distance: string; duration: string; km: number } | null) => onResult(d), []);

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
                  fontSize: "11px",
                },
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 11,
                  fillColor: color,
                  fillOpacity: 1,
                  strokeColor: "#fff",
                  strokeWeight: 2,
                },
                zIndex: 10,
              });

            makeMarker(leg.start_location, "A", "#2563eb"); // blue
            makeMarker(leg.end_location, "B", "#059669"); // green

            stableOnResult({
              distance: leg.distance?.text || "",
              duration: leg.duration?.text || "",
              km: (leg.distance?.value || 0) / 1000,
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
/*  Company pin on the map + dashed line to pickup (A)                */
/* ------------------------------------------------------------------ */
function CompanyMarker({ address, originAddress }: { address: string; originAddress: string }) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const geocodingLib = useMapsLibrary("geocoding");
  const markerRef = useRef<google.maps.Marker | null>(null);
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!map || !geocodingLib || !routesLib || !address) return;

    const geocoder = new geocodingLib.Geocoder();

    // Geocode company location for the marker
    geocoder.geocode({ address }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK || !results?.[0]) return;
      const companyPos = results[0].geometry.location;

      // Clean up previous
      if (markerRef.current) markerRef.current.setMap(null);
      if (rendererRef.current) rendererRef.current.setMap(null);

      // Extend bounds to include company
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(companyPos);
      const existing = map.getBounds();
      if (existing) bounds.union(existing);
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });

      // Van SVG path for the marker icon
      const vanPath = "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z";

      // Company marker with van icon
      markerRef.current = new google.maps.Marker({
        position: companyPos,
        map,
        title: "Sediu firmă",
        icon: {
          path: vanPath,
          fillColor: "#7c3aed",   // violet-600
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 1.5,
          scale: 1.1,
          anchor: new google.maps.Point(12, 12),
        },
        zIndex: 5,
      });

      // Driving route from company to pickup (A) — dashed orange
      const svc = new routesLib.DirectionsService();
      const renderer = new routesLib.DirectionsRenderer({
        map,
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: "#7c3aed",   // violet-600
          strokeOpacity: 0.6,
          strokeWeight: 4,
        },
      });
      rendererRef.current = renderer;

      svc.route(
        {
          origin: address,
          destination: originAddress,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, s) => {
          if (s === google.maps.DirectionsStatus.OK && result) {
            renderer.setDirections(result);
          }
        },
      );
    });

    return () => {
      if (markerRef.current) markerRef.current.setMap(null);
      if (rendererRef.current) rendererRef.current.setMap(null);
    };
  }, [map, geocodingLib, routesLib, address, originAddress]);

  return null;
}

/* ------------------------------------------------------------------ */
/*  Helper: one-shot distance calculation (no rendering on map)       */
/* ------------------------------------------------------------------ */
function useDistanceCalc(
  origin: string | null,
  destination: string | null,
) {
  const routesLib = useMapsLibrary("routes");
  const [result, setResult] = useState<{ km: number; text: string } | null>(null);

  useEffect(() => {
    if (!routesLib || !origin || !destination) return;
    const svc = new routesLib.DirectionsService();
    svc.route(
      { origin, destination, travelMode: google.maps.TravelMode.DRIVING },
      (res, status) => {
        if (status === google.maps.DirectionsStatus.OK && res) {
          const leg = res.routes[0]?.legs[0];
          if (leg?.distance) {
            setResult({ km: (leg.distance.value || 0) / 1000, text: leg.distance.text || "" });
          }
        }
      },
    );
  }, [routesLib, origin, destination]);

  return result;
}

/* ------------------------------------------------------------------ */
/*  Company distance badges (rendered inside APIProvider)             */
/* ------------------------------------------------------------------ */
function CompanyDistances({
  companyLoc,
  originLoc,
  destLoc,
  routeKm,
}: {
  companyLoc: string;
  originLoc: string;
  destLoc: string;
  routeKm: number;
}) {
  const toPickup = useDistanceCalc(companyLoc, originLoc);
  const backHome = useDistanceCalc(destLoc, companyLoc);

  if (!toPickup && !backHome) return null;

  const roundTrip = toPickup && backHome
    ? Math.round(toPickup.km + routeKm + backHome.km)
    : null;

  return (
    <div className="flex items-center justify-center gap-4 border-t border-gray-100 bg-gray-50/60 px-3 py-2.5 text-xs text-gray-600">
      {toPickup && (
        <span className="inline-flex items-center gap-1 whitespace-nowrap">
          <MapPinIcon className="h-3.5 w-3.5 text-orange-500 shrink-0" />
          Deplasare la client: <strong className="text-gray-800">{toPickup.text}</strong>
        </span>
      )}
      {toPickup && roundTrip !== null && (
        <span className="text-gray-300">•</span>
      )}
      {roundTrip !== null && (
        <span className="inline-flex items-center gap-1 whitespace-nowrap">
          <ArrowPathIcon className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          Dus-întors total: <strong className="text-gray-800">{roundTrip} km</strong>
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main exported component                                           */
/* ------------------------------------------------------------------ */
export default function RouteMap({
  fromCity,
  fromCounty,
  toCity,
  toCounty,
  companyCity,
  companyCounty,
}: RouteMapProps) {
  const [info, setInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);
  const [routeKm, setRouteKm] = useState(0);
  const [error, setError] = useState(false);

  if (!API_KEY) return null;

  const origin = [fromCity, fromCounty, "Romania"].filter(Boolean).join(", ");
  const destination = [toCity, toCounty, "Romania"].filter(Boolean).join(", ");
  const companyLoc = companyCity
    ? [companyCity, companyCounty, "Romania"].filter(Boolean).join(", ")
    : "Brașov, Brașov, Romania"; // TODO: remove fallback after testing

  return (
    <APIProvider apiKey={API_KEY}>
    <div className="rounded-xl sm:rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Map */}
      {/* Hide Google logo & Terms links */}
      <style>{`.route-map-wrap .gm-style a[href*="google"], .route-map-wrap .gm-style a[href*="terms"], .route-map-wrap .gm-style .gmnoscreen, .route-map-wrap .gm-style-cc { display:none!important; } .route-map-wrap .gm-style img[alt="Google"] { display:none!important; }`}</style>
      <div className="route-map-wrap h-64 sm:h-96">
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
                  setRouteKm(d.km);
                  setError(false);
                } else {
                  setError(true);
                }
              }}
            />
            {companyLoc && <CompanyMarker address={companyLoc} originAddress={origin} />}
          </Map>
      </div>

      {/* Info banner */}
      {info && (
        <div className="flex items-center gap-3 bg-linear-to-r from-blue-50 to-emerald-50 px-4 py-3 border-t border-gray-100">
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
          <a
            href={
              companyLoc
                ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(companyLoc)}&waypoints=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`
                : `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
            </svg>
            Navighez
          </a>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 text-xs text-gray-400 text-center">
          Traseul nu a putut fi afișat.
        </div>
      )}

      {/* Company distance badges */}
      {companyLoc && info && (
        <CompanyDistances
          companyLoc={companyLoc}
          originLoc={origin}
          destLoc={destination}
          routeKm={routeKm}
        />
      )}
    </div>
    </APIProvider>
  );
}
