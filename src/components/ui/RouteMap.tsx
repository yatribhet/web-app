"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { Route } from "../../types/place";
import { Plus, Minus, LocateFixed } from "lucide-react";

export interface RouteMapPoint {
  lat: number;
  lng: number;
  label: string;
}

export interface HospitalityMapPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
  type: string;
}

interface RouteMapProps {
  center: [number, number]; // [lat, lng] — the place's own coordinates
  focusPoint?: RouteMapPoint | null;
  traceRoute?: Route | null;
  canvasClassName?: string;
  wrapperClassName?: string;
  hospitalityPoints?: HospitalityMapPoint[];
  activeHospitalityId?: string | null;
  onHospitalityClick?: (id: string) => void;
}

const fin = (...vals: unknown[]): boolean =>
  vals.every((v) => typeof v === "number" && Number.isFinite(v));

const PULSE_CSS = `
@keyframes mapPulse {
  0%   { transform: scale(1);   opacity: 0.45; }
  70%  { transform: scale(2.8); opacity: 0;    }
  100% { transform: scale(2.8); opacity: 0;    }
}
@keyframes pinDrop {
  0%   { transform: translateY(-12px) scale(0.5); opacity: 0; }
  60%  { transform: translateY(2px) scale(1.1); opacity: 1; }
  80%  { transform: translateY(-2px) scale(0.95); }
  100% { transform: translateY(0) scale(1); }
}
@keyframes ringExpand {
  0%   { transform: scale(0.5); opacity: 0.8; }
  100% { transform: scale(3); opacity: 0; }
}
`;

const ROUTE_SOURCE = "traced-route";
const ROUTE_LAYER = "traced-route-line";

// Fetches the actual road geometry from self-hosted OSRM.
// waypoints are [lng, lat] pairs (GeoJSON order).
// Returns [lng, lat] pairs on success, null on any failure.
async function fetchOSRMRoute(
  waypoints: [number, number][],
  signal: AbortSignal
): Promise<[number, number][] | null> {
  const base = process.env.NEXT_PUBLIC_OSRM_URL;
  if (!base || waypoints.length < 2) return null;
  const coords = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(";");
  try {
    const res = await fetch(
      `${base}/route/v1/driving/${coords}?overview=full&geometries=geojson`,
      { signal }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (json.code !== "Ok") return null;
    return (json.routes?.[0]?.geometry?.coordinates as [number, number][]) ?? null;
  } catch {
    return null;
  }
}

// Returns a MapLibre inline raster style object.
// Raster tiles have labels pre-rendered in the PNG — no glyph/font server
// needed, so labels always appear regardless of environment.
function getMapStyle(isDark: boolean): object {
  const provider = process.env.NEXT_PUBLIC_MAP_PROVIDER ?? "stadia";
  const stadiaKey = process.env.NEXT_PUBLIC_STADIA_API_KEY;

  // Stadia Alidade Smooth — best quality, labels perfect, retina @2x
  if (provider === "stadia" && stadiaKey && stadiaKey !== "CHANGE_ME") {
    const variant = isDark ? "alidade_smooth_dark" : "alidade_smooth";
    return {
      version: 8,
      sources: {
        tiles: {
          type: "raster",
          tiles: [`https://tiles.stadiamaps.com/tiles/${variant}/{z}/{x}/{y}@2x.png?api_key=${stadiaKey}`],
          tileSize: 512,
          attribution: "© Stadia Maps © OpenMapTiles © OpenStreetMap contributors",
        },
      },
      layers: [{ id: "raster-tiles", type: "raster", source: "tiles" }],
    };
  }

  // Carto raster — free, no key, clean minimal design
  if (provider === "carto") {
    const variant = isDark ? "dark_all" : "light_all";
    return {
      version: 8,
      sources: {
        tiles: {
          type: "raster",
          tiles: [`https://a.basemaps.cartocdn.com/${variant}/{z}/{x}/{y}@2x.png`],
          tileSize: 512,
          attribution: "© CARTO © OpenStreetMap contributors",
        },
      },
      layers: [{ id: "raster-tiles", type: "raster", source: "tiles" }],
    };
  }

  // OSM — free, commercial use allowed with attribution, full labels
  return {
    version: 8,
    sources: {
      tiles: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors",
      },
    },
    layers: [{ id: "raster-tiles", type: "raster", source: "tiles" }],
  };
}

// ── Marker element factories (no Leaflet — plain DOM elements) ───────────────

function makePulseEl(): HTMLElement {
  const el = document.createElement("div");
  el.style.cssText = "position:relative;width:22px;height:22px";
  el.innerHTML = `
    <div style="position:absolute;inset:0;background:#ea7022;border-radius:50%;animation:mapPulse 2.2s ease-out infinite"></div>
    <div style="position:absolute;top:4px;left:4px;width:14px;height:14px;background:#ea7022;border:3px solid white;border-radius:50%;box-shadow:0 2px 10px rgba(234,112,34,0.65)"></div>
  `;
  return el;
}

function makePillEl(color: string, text: string, animate = false): HTMLElement {
  const el = document.createElement("div");
  const label = text.length > 18 ? text.slice(0, 18) + "…" : text;
  el.style.cssText = `background:${color};color:#fff;font:700 9px/1 sans-serif;padding:3px 8px;border-radius:999px;white-space:nowrap;box-shadow:0 3px 10px rgba(0,0,0,.25);border:2px solid rgba(255,255,255,0.9);letter-spacing:0.03em;${
    animate ? "animation:pinDrop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;" : ""
  }`;
  el.textContent = label;
  return el;
}

function makeRouteEndpointEl(color: string, text: string, isStart: boolean): HTMLElement {
  const el = document.createElement("div");
  el.style.cssText = "position:relative;width:28px;height:28px";
  const label = text.length > 14 ? text.slice(0, 14) + "…" : text;
  el.innerHTML = `
    <div style="position:absolute;inset:0;background:${color};border-radius:50%;box-shadow:0 3px 12px rgba(0,0,0,0.3);border:3px solid white"></div>
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font:700 10px/1 sans-serif;color:white">${isStart ? "S" : "E"}</div>
    <div style="position:absolute;top:-22px;left:50%;transform:translateX(-50%);background:${color};color:white;font:700 9px/1 sans-serif;padding:2px 6px;border-radius:4px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.9)">${label}</div>
  `;
  return el;
}

function makeStepPinEl(color: string, text: string): HTMLElement {
  const el = document.createElement("div");
  el.style.cssText = "position:relative;width:24px;height:32px";
  const label = text.length > 12 ? text.slice(0, 12) + "…" : text;
  el.innerHTML = `
    <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:20px;height:20px;background:${color};border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:3px solid white"></div>
    <div style="position:absolute;bottom:18px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:8px solid ${color};filter:drop-shadow(0 1px 2px rgba(0,0,0,0.2))"></div>
    <div style="position:absolute;top:-20px;left:50%;transform:translateX(-50%);background:${color};color:white;font:700 9px/1 sans-serif;padding:3px 7px;border-radius:4px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.9);text-align:center">${label}</div>
  `;
  return el;
}

const FOOD_TYPES = new Set(["restaurant", "cafe"]);
const BED_SVG = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>`;
const FORK_SVG = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z"/></svg>`;

function makeHospitalityEl(type: string, active: boolean): HTMLElement {
  const isFood = FOOD_TYPES.has(type);
  const color = isFood ? "#4a7c59" : "#2d6ea8";
  const size = active ? 30 : 24;
  const ring = active
    ? `box-shadow:0 0 0 4px ${color}40,0 3px 10px rgba(0,0,0,.35);`
    : "box-shadow:0 2px 8px rgba(0,0,0,.3);";
  const el = document.createElement("div");
  el.style.cssText = `width:${size}px;height:${size}px;background:${color};border-radius:50%;border:2.5px solid white;${ring}display:flex;align-items:center;justify-content:center;transition:all .2s ease;cursor:pointer;`;
  el.innerHTML = isFood ? FORK_SVG : BED_SVG;
  return el;
}

// ── Component ────────────────────────────────────────────────────────────────

export function RouteMap({
  center,
  focusPoint,
  traceRoute,
  canvasClassName,
  wrapperClassName,
  hospitalityPoints,
  activeHospitalityId,
  onHospitalityClick,
}: RouteMapProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const mlRef = useRef<any>(null); // maplibre-gl library reference
  const overlayMarkersRef = useRef<any[]>([]);
  const hospMarkersRef = useRef<Map<string, any>>(new Map());
  const prevActiveHospId = useRef<string | null>(null);
  const scrollZoomActive = useRef(false);
  const [ready, setReady] = useState(false);
  const [warn, setWarn] = useState<string | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [isTracing, setIsTracing] = useState(false);

  const mountCenter = useRef<[number, number]>(
    fin(center[0], center[1]) ? [center[0], center[1]] : [27.7172, 85.324]
  );

  // ── Bootstrap (runs exactly once) ─────────────────────────────────────────
  useEffect(() => {
    let dead = false;

    import("maplibre-gl").then((mod) => {
      if (dead || !divRef.current || mapRef.current) return;

      const ml = (mod as any).default ?? mod;
      mlRef.current = ml;

      const isDark = document.documentElement.classList.contains("dark");
      const [lat, lng] = mountCenter.current;

      const map = new ml.Map({
        container: divRef.current,
        style: getMapStyle(isDark),
        center: [lng, lat], // MapLibre uses [lng, lat] (GeoJSON order)
        zoom: 11,
        scrollZoom: false,
        attributionControl: true,
        // Restrict viewport to Nepal — tiles outside this box are never fetched
        maxBounds: [[79.5, 25.8], [88.8, 30.8]],
      });

      mapRef.current = map;

      map.on("load", () => {
        if (dead) return;

        // Pulsing ember marker for the place itself
        const pulseEl = makePulseEl();
        new ml.Marker({ element: pulseEl, anchor: "center" })
          .setLngLat([lng, lat])
          .addTo(map);

        // Empty GeoJSON source + line layer for route tracing
        map.addSource(ROUTE_SOURCE, {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });
        map.addLayer({
          id: ROUTE_LAYER,
          type: "line",
          source: ROUTE_SOURCE,
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": "#ea7022",
            "line-width": 3.5,
            "line-opacity": 0.9,
            "line-dasharray": [2, 1.4],
          },
        });

        if (!dead) setReady(true);
      });

      map.on("click", () => {
        if (!scrollZoomActive.current) {
          map.scrollZoom.enable();
          scrollZoomActive.current = true;
          if (!dead) setScrollEnabled(true);
        }
      });
    });

    return () => {
      dead = true;
      mapRef.current?.remove();
      mapRef.current = null;
      mlRef.current = null;
      overlayMarkersRef.current = [];
      hospMarkersRef.current.clear();
      scrollZoomActive.current = false;
      setReady(false);
      setScrollEnabled(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const clearOverlays = () => {
    overlayMarkersRef.current.forEach((m) => { try { m.remove(); } catch (_) {} });
    overlayMarkersRef.current = [];
    if (mapRef.current?.getSource(ROUTE_SOURCE)) {
      mapRef.current.getSource(ROUTE_SOURCE).setData({ type: "FeatureCollection", features: [] });
    }
  };

  const safeFly = (lat: unknown, lng: unknown, zoom: number) => {
    if (!fin(lat, lng)) {
      setWarn(`Coordinates unavailable (${lat}, ${lng})`);
      setTimeout(() => setWarn(null), 3000);
      return false;
    }
    mapRef.current?.flyTo({ center: [lng as number, lat as number], zoom, duration: 1100 });
    return true;
  };

  const addHighlightRing = (lat: number, lng: number) => {
    const ml = mlRef.current;
    const map = mapRef.current;
    if (!ml || !map) return;
    const el = document.createElement("div");
    el.style.cssText =
      "width:36px;height:36px;border-radius:50%;border:3px solid #ea7022;opacity:0.8;animation:ringExpand 1.2s ease-out forwards;pointer-events:none;";
    const marker = new ml.Marker({ element: el, anchor: "center" })
      .setLngLat([lng, lat])
      .addTo(map);
    setTimeout(() => { try { marker.remove(); } catch (_) {} }, 1200);
  };

  // ── Effect: focus a single step ───────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    const ml = mlRef.current;
    if (!ready || !map || !ml) return;

    clearOverlays();
    setWarn(null);
    setIsTracing(false);

    if (!focusPoint) return;

    const { lat, lng, label } = focusPoint;
    if (!safeFly(lat, lng, 15)) return;

    overlayMarkersRef.current = [
      new ml.Marker({ element: makeStepPinEl("#ea7022", label), anchor: "bottom" })
        .setLngLat([lng, lat])
        .addTo(map),
      new ml.Marker({ element: makePillEl("#ea7022", label, true), anchor: "bottom" })
        .setLngLat([lng, lat])
        .addTo(map),
    ];

    addHighlightRing(lat, lng);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusPoint, ready]);

  // ── Effect: trace full route ──────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    const ml = mlRef.current;
    if (!ready || !map || !ml) return;

    clearOverlays();
    setWarn(null);

    if (!traceRoute) {
      setIsTracing(false);
      return;
    }

    setIsTracing(true);

    // Coordinates in [lng, lat] order for GeoJSON / MapLibre
    const geoCoords: [number, number][] = [];
    let startLngLat: [number, number] | null = null;
    let endLngLat: [number, number] | null = null;
    let startLabel = "Start";
    let endLabel = "Destination";

    traceRoute.subRoutes.forEach((sub, idx) => {
      const sLng = sub.startLocation?.coordinates?.[0];
      const sLat = sub.startLocation?.coordinates?.[1];
      const eLng = sub.endLocation?.coordinates?.[0];
      const eLat = sub.endLocation?.coordinates?.[1];

      if (fin(sLat, sLng)) {
        geoCoords.push([sLng as number, sLat as number]);
        if (idx === 0) {
          startLngLat = [sLng as number, sLat as number];
          startLabel = sub.starting || "Start";
        }
      }

      if (fin(eLat, eLng) && idx === traceRoute.subRoutes.length - 1) {
        endLngLat = [eLng as number, eLat as number];
        endLabel = sub.ending || "Destination";
        geoCoords.push([eLng as number, eLat as number]);
      }
    });

    if (startLngLat) {
      overlayMarkersRef.current.push(
        new ml.Marker({ element: makeRouteEndpointEl("#4a7c59", startLabel, true), anchor: "center" })
          .setLngLat(startLngLat)
          .addTo(map)
      );
    }
    if (endLngLat) {
      overlayMarkersRef.current.push(
        new ml.Marker({ element: makeRouteEndpointEl("#ea7022", endLabel, false), anchor: "center" })
          .setLngLat(endLngLat)
          .addTo(map)
      );
    }

    if (geoCoords.length === 0) {
      setWarn("No valid coordinates found for this route.");
      setIsTracing(false);
      setTimeout(() => setWarn(null), 4000);
      return;
    }

    const drawLine = (coords: [number, number][]) => {
      if (!mapRef.current) return;
      mapRef.current.getSource(ROUTE_SOURCE).setData({
        type: "Feature",
        geometry: { type: "LineString", coordinates: coords },
      });
      if (coords.length >= 2) {
        const bounds = new ml.LngLatBounds();
        coords.forEach((c: [number, number]) => bounds.extend(c));
        mapRef.current.fitBounds(bounds, { padding: 32, duration: 1000, maxZoom: 14 });
      } else {
        mapRef.current.flyTo({ center: coords[0], zoom: 12, duration: 1000 });
      }
    };

    const routingProvider = process.env.NEXT_PUBLIC_ROUTING_PROVIDER ?? "straight";

    if (routingProvider === "osrm") {
      const controller = new AbortController();
      fetchOSRMRoute(geoCoords, controller.signal).then((roadCoords) => {
        // Fall back to straight line if OSRM fails or returns nothing
        drawLine(roadCoords ?? geoCoords);
      });
      return () => controller.abort();
    }

    // straight — draw immediately, no external request
    drawLine(geoCoords);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traceRoute, ready]);

  // ── Effect: hospitality markers (independent layer) ───────────────────────
  useEffect(() => {
    const map = mapRef.current;
    const ml = mlRef.current;
    if (!ready || !map || !ml) return;

    const layer = hospMarkersRef.current;
    layer.forEach((m) => { try { m.remove(); } catch (_) {} });
    layer.clear();

    (hospitalityPoints ?? []).forEach((pt) => {
      if (!fin(pt.lat, pt.lng)) return;
      const active = pt.id === activeHospitalityId;
      const el = makeHospitalityEl(pt.type, active);
      if (onHospitalityClick) el.addEventListener("click", () => onHospitalityClick(pt.id));
      const marker = new ml.Marker({ element: el, anchor: "center" })
        .setLngLat([pt.lng, pt.lat])
        .addTo(map);
      layer.set(pt.id, marker);
    });

    if (activeHospitalityId && activeHospitalityId !== prevActiveHospId.current) {
      const pt = (hospitalityPoints ?? []).find((p) => p.id === activeHospitalityId);
      if (pt && fin(pt.lat, pt.lng)) map.panTo([pt.lng, pt.lat], { duration: 600 });
    }
    prevActiveHospId.current = activeHospitalityId ?? null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalityPoints, activeHospitalityId, ready]);

  // ── Custom zoom handlers ──────────────────────────────────────────────────
  const handleZoomIn = useCallback(() => mapRef.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => mapRef.current?.zoomOut(), []);
  const handleReset = useCallback(() => {
    const [lat, lng] = mountCenter.current;
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 11, duration: 900 });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PULSE_CSS }} />

      <div className={`relative group/map${wrapperClassName ? ` ${wrapperClassName}` : ""}`}>
        {/* Map canvas */}
        <div
          ref={divRef}
          className={canvasClassName ?? "w-full h-52 md:h-64 rounded-xl overflow-hidden border border-border-warm dark:border-[#3a2e24] bg-sand dark:bg-[#13100d]"}
          aria-label="Interactive route map"
        >
          {!ready && (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-ember/30 border-t-ember animate-spin" />
              <span className="text-stone/40 text-[10px] uppercase tracking-widest">
                Loading map…
              </span>
            </div>
          )}
        </div>

        {/* Custom zoom controls */}
        {ready && (
          <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1 opacity-0 group-hover/map:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleZoomIn}
              className="w-7 h-7 rounded-lg bg-white/95 dark:bg-[#1e1912]/95 border border-border-warm dark:border-[#3a2e24] shadow-md flex items-center justify-center text-ink dark:text-[#f5ede4] hover:bg-ember hover:text-white hover:border-ember transition-all duration-150 backdrop-blur-sm"
              aria-label="Zoom in"
            >
              <Plus size={13} strokeWidth={2.5} />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-7 h-7 rounded-lg bg-white/95 dark:bg-[#1e1912]/95 border border-border-warm dark:border-[#3a2e24] shadow-md flex items-center justify-center text-ink dark:text-[#f5ede4] hover:bg-ember hover:text-white hover:border-ember transition-all duration-150 backdrop-blur-sm"
              aria-label="Zoom out"
            >
              <Minus size={13} strokeWidth={2.5} />
            </button>
            <button
              onClick={handleReset}
              className="w-7 h-7 rounded-lg bg-white/95 dark:bg-[#1e1912]/95 border border-border-warm dark:border-[#3a2e24] shadow-md flex items-center justify-center text-ember hover:bg-ember hover:text-white hover:border-ember transition-all duration-150 backdrop-blur-sm"
              aria-label="Reset view"
            >
              <LocateFixed size={12} strokeWidth={2} />
            </button>
          </div>
        )}

        {/* Tracing badge */}
        {ready && isTracing && (
          <div className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5 bg-white/90 dark:bg-[#1e1912]/90 border border-ember/30 text-[10px] font-semibold text-ember px-2.5 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
            Tracing route
          </div>
        )}

        {/* Scroll hint */}
        {ready && !scrollEnabled && (
          <div className="absolute bottom-3 left-3 z-[1000] pointer-events-none">
            <div className="bg-black/50 text-white/90 text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm tracking-wide select-none">
              Click map · scroll to zoom
            </div>
          </div>
        )}

        {/* Coordinate warning */}
        {warn && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
            ⚠️ {warn}
          </div>
        )}
      </div>
    </>
  );
}
