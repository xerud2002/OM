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
/*  Company pin on the map                                            */
/* ------------------------------------------------------------------ */
function CompanyMarker({ address }: { address: string }) {
  const map = useMap();
  const geocodingLib = useMapsLibrary("geocoding");
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!map || !geocodingLib || !address) return;

    const geocoder = new geocodingLib.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
        const pos = results[0].geometry.location;

        // Clean up previous
        if (markerRef.current) markerRef.current.setMap(null);

        markerRef.current = new google.maps.Marker({
          position: pos,
          map,
          title: "Sediu firmă",
          label: {
            text: "\u2302",  // house symbol
            color: "#fff",
            fontWeight: "700",
            fontSize: "15px",
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 16,
            fillColor: "#ea580c",   // orange-600
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 3,
          },
          zIndex: 5,
        });
      }
    });

    return () => {
      if (markerRef.current) markerRef.current.setMap(null);
    };
  }, [map, geocodingLib, address]);

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
    <div className="flex flex-wrap gap-2 px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
      {toPickup && (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
          <MapPinIcon className="h-3.5 w-3.5 text-blue-500" />
          Deplasare la client: <strong>{toPickup.text}</strong>
        </span>
      )}
      {roundTrip !== null && (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
          <ArrowPathIcon className="h-3.5 w-3.5 text-emerald-500" />
          Dus-întors total: <strong>{roundTrip} km</strong>
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
      {/* Hide Google logo & Terms links */}
      <style>{`.route-map-wrap .gm-style a[href*="google"], .route-map-wrap .gm-style a[href*="terms"], .route-map-wrap .gm-style .gmnoscreen, .route-map-wrap .gm-style-cc { display:none!important; } .route-map-wrap .gm-style img[alt="Google"] { display:none!important; }`}</style>
      <div className="route-map-wrap h-56 sm:h-72">
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
            {companyLoc && <CompanyMarker address={companyLoc} />}
          </Map>
      </div>

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
