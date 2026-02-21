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
  companyLatLng?: { lat: number; lng: number };
  onPlaceOffer?: () => void;
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
  onResult: (
    d: { distance: string; duration: string; km: number } | null,
  ) => void;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableOnResult = useCallback(
    (d: { distance: string; duration: string; km: number } | null) =>
      onResult(d),
    [],
  );

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
        strokeColor: "#eab308",
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
            // Place custom markers — drop-pin style
            const pinSvg = (color: string, label: string) => {
              const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="44" viewBox="0 0 32 44">
                  <defs>
                    <filter id="s" x="-20%" y="-10%" width="140%" height="130%">
                      <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.25"/>
                    </filter>
                  </defs>
                  <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 28 16 28s16-16 16-28C32 7.16 24.84 0 16 0z"
                        fill="${color}" fill-opacity="0.85" stroke="#fff" stroke-width="1.5" filter="url(#s)"/>
                  <circle cx="16" cy="15" r="7" fill="#fff" fill-opacity="0.9"/>
                  <text x="16" y="19" text-anchor="middle" font-size="11" font-weight="700"
                        fill="${color}" font-family="system-ui,sans-serif">${label}</text>
                </svg>`;
              return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
            };

            const makeMarker = (
              pos: google.maps.LatLng,
              label: string,
              color: string,
            ) =>
              new google.maps.Marker({
                position: pos,
                map,
                icon: {
                  url: pinSvg(color, label),
                  scaledSize: new google.maps.Size(32, 44),
                  anchor: new google.maps.Point(16, 44),
                },
                zIndex: 10,
              });

            makeMarker(leg.start_location, "A", "#f59e0b"); // amber
            makeMarker(leg.end_location, "B", "#3b82f6"); // blue

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
function CompanyMarker({
  address,
  latLng,
  originAddress,
  destAddress,
}: {
  address?: string;
  latLng?: { lat: number; lng: number };
  originAddress: string;
  destAddress: string;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const geocodingLib = useMapsLibrary("geocoding");
  const markerRef = useRef<google.maps.Marker | null>(null);
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const returnRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!map || !geocodingLib || !routesLib || (!address && !latLng)) return;

    const geocoder = new geocodingLib.Geocoder();

    const setupMarker = (companyPos: google.maps.LatLng) => {
      // Clean up previous
      if (markerRef.current) markerRef.current.setMap(null);
      if (rendererRef.current) rendererRef.current.setMap(null);

      // Helper to fit all points
      const fitAll = () => {
        const b = new google.maps.LatLngBounds();
        b.extend(companyPos);
        const cur = map.getBounds();
        if (cur) b.union(cur);
        map.fitBounds(b, { top: 50, right: 50, bottom: 50, left: 50 });
      };
      fitAll();

      // Van SVG path for the marker icon
      const vanPath =
        "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z";

      // Company marker with van icon
      markerRef.current = new google.maps.Marker({
        position: companyPos,
        map,
        title: "Sediu firmă",
        icon: {
          path: vanPath,
          fillColor: "#dc2626", // red-600
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
          strokeColor: "#dc2626", // red-600
          strokeOpacity: 0.6,
          strokeWeight: 4,
        },
      });
      rendererRef.current = renderer;

      const companyOrigin: string | google.maps.LatLng = address || companyPos;

      svc.route(
        {
          origin: companyOrigin,
          destination: originAddress,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, s) => {
          if (s === google.maps.DirectionsStatus.OK && result) {
            renderer.setDirections(result);
            // Re-fit after route renders to include all 3 points
            setTimeout(fitAll, 300);
          }
        },
      );

      // Return route: B (destination) back to company — blue
      const returnRenderer = new routesLib.DirectionsRenderer({
        map,
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: "#2563eb", // blue-600
          strokeOpacity: 0.7,
          strokeWeight: 4,
        },
      });
      returnRendererRef.current = returnRenderer;

      svc.route(
        {
          origin: destAddress,
          destination: companyOrigin,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, s) => {
          if (s === google.maps.DirectionsStatus.OK && result) {
            returnRenderer.setDirections(result);
          }
        },
      );
    };

    // Resolve company position: geocode address or use latLng
    if (address) {
      geocoder.geocode({ address }, (results, status) => {
        if (status !== google.maps.GeocoderStatus.OK || !results?.[0]) return;
        setupMarker(results[0].geometry.location);
      });
    } else if (latLng) {
      setupMarker(new google.maps.LatLng(latLng.lat, latLng.lng));
    }

    return () => {
      if (markerRef.current) markerRef.current.setMap(null);
      if (rendererRef.current) rendererRef.current.setMap(null);
      if (returnRendererRef.current) returnRendererRef.current.setMap(null);
    };
  }, [
    map,
    geocodingLib,
    routesLib,
    address,
    latLng,
    originAddress,
    destAddress,
  ]);

  return null;
}

/* ------------------------------------------------------------------ */
/*  Helper: one-shot distance calculation (no rendering on map)       */
/* ------------------------------------------------------------------ */
function useDistanceCalc(origin: string | null, destination: string | null) {
  const routesLib = useMapsLibrary("routes");
  const [result, setResult] = useState<{ km: number; text: string } | null>(
    null,
  );

  useEffect(() => {
    if (!routesLib || !origin || !destination) return;
    const svc = new routesLib.DirectionsService();
    svc.route(
      { origin, destination, travelMode: google.maps.TravelMode.DRIVING },
      (res, status) => {
        if (status === google.maps.DirectionsStatus.OK && res) {
          const leg = res.routes[0]?.legs[0];
          if (leg?.distance) {
            setResult({
              km: (leg.distance.value || 0) / 1000,
              text: leg.distance.text || "",
            });
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
  onPlaceOffer,
}: {
  companyLoc: string;
  originLoc: string;
  destLoc: string;
  routeKm: number;
  onPlaceOffer?: () => void;
}) {
  const toPickup = useDistanceCalc(companyLoc, originLoc);
  const backHome = useDistanceCalc(destLoc, companyLoc);

  if (!toPickup && !backHome) return null;

  const roundTrip =
    toPickup && backHome
      ? Math.round(toPickup.km + routeKm + backHome.km)
      : null;

  return (
    <div className="flex items-center gap-2 sm:gap-3 border-t border-gray-100 bg-gray-50/60 px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs text-gray-600">
      {toPickup && (
        <span className="inline-flex items-center gap-1 whitespace-nowrap">
          <MapPinIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-orange-500 shrink-0" />
          Deplasare: <strong className="text-gray-800">{toPickup.text}</strong>
        </span>
      )}
      {toPickup && roundTrip !== null && (
        <span className="text-gray-300">•</span>
      )}
      {roundTrip !== null && (
        <span className="inline-flex items-center gap-1 whitespace-nowrap">
          <ArrowPathIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500 shrink-0" />
          Dus-întors: <strong className="text-gray-800">{roundTrip} km</strong>
        </span>
      )}
      {onPlaceOffer && (
        <button
          onClick={onPlaceOffer}
          className="ml-auto inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-green-600 hover:bg-green-700 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold shadow-sm transition-colors"
        >
          Plasează ofertă
        </button>
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
  companyLatLng,
  onPlaceOffer,
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
    : null;
  const showCompany = !!(companyLoc || companyLatLng);

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="rounded-xl sm:rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {/* Map */}
        {/* Hide Google logo & Terms links */}
        <style>{`.route-map-wrap .gm-style a[href*="google"], .route-map-wrap .gm-style a[href*="terms"], .route-map-wrap .gm-style .gmnoscreen, .route-map-wrap .gm-style-cc { display:none!important; } .route-map-wrap .gm-style img[alt="Google"] { display:none!important; }`}</style>
        <div className="route-map-wrap h-56 sm:h-96">
          <Map
            defaultCenter={{ lat: 45.9432, lng: 24.9668 }} // Romania center
            defaultZoom={7}
            gestureHandling="cooperative"
            disableDefaultUI
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
            {showCompany && (
              <CompanyMarker
                address={companyLoc || undefined}
                latLng={companyLatLng}
                originAddress={origin}
                destAddress={destination}
              />
            )}
          </Map>
        </div>

        {/* Info banner */}
        {info && (
          <div className="flex items-center gap-2 sm:gap-3 bg-linear-to-r from-blue-50 to-emerald-50 px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-100">
            <TruckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 shrink-0" />
            <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-0.5 text-xs sm:text-sm">
              <span className="font-semibold text-gray-900">
                {info.distance}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">~{info.duration}</span>
            </div>
            <a
              href={
                companyLoc
                  ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(companyLoc)}&waypoints=${encodeURIComponent(origin)}|${encodeURIComponent(destination)}&destination=${encodeURIComponent(companyLoc)}&travelmode=driving`
                  : `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="group relative ml-auto inline-flex items-center gap-1 sm:gap-1.5 overflow-hidden rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent group-hover:animate-[gleam_1s_ease-in-out] transition-transform" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3.5 w-3.5 relative"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
              </svg>
              <span className="relative">Navighează</span>
            </a>
          </div>
        )}

        {error && (
          <div className="px-4 py-3 text-xs text-gray-400 text-center">
            Traseul nu a putut fi afișat.
          </div>
        )}

        {/* Company distance badges */}
        {showCompany && info && (
          <CompanyDistances
            companyLoc={
              companyLoc || `${companyLatLng!.lat},${companyLatLng!.lng}`
            }
            originLoc={origin}
            destLoc={destination}
            routeKm={routeKm}
            onPlaceOffer={onPlaceOffer}
          />
        )}
      </div>
    </APIProvider>
  );
}
