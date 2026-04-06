"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Route } from "../../types/place";
import { Plus, Minus, LocateFixed } from "lucide-react";

export interface RouteMapPoint {
  lat: number;
  lng: number;
  label: string;
}

interface RouteMapProps {
  center: [number, number]; // [lat, lng] — the place's own coordinates
  focusPoint?: RouteMapPoint | null;
  traceRoute?: Route | null;
  canvasClassName?: string; // override the inner map canvas classes
}

/** Returns true only when every value is a valid, finite number */
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

export function RouteMap({ center, focusPoint, traceRoute, canvasClassName }: RouteMapProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);
  const polyRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [warn, setWarn] = useState<string | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [isTracing, setIsTracing] = useState(false);

  // Capture center once at mount so it never becomes a stale closure
  const mountCenter = useRef<[number, number]>(
    fin(center[0], center[1]) ? [center[0], center[1]] : [27.7172, 85.324]
  );

  // ── Bootstrap map (runs exactly once) ─────────────────────────────────
  useEffect(() => {
    let dead = false;

    import("leaflet").then((mod) => {
      if (dead || !divRef.current) return;
      if ((divRef.current as any)._leaflet_id) return; // already initialised

      const L = (mod as any).default ?? mod;
      LRef.current = L;

      // Fix Next.js webpack icon path issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const c = mountCenter.current;
      const map = L.map(divRef.current, {
        center: c,
        zoom: 11,
        scrollWheelZoom: false,
        zoomControl: false,        // we render our own
        attributionControl: false,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 19 }
      ).addTo(map);

      // Pulsing ember pin for the place
      L.marker(c, {
        icon: L.divIcon({
          className: "",
          html: `<div style="position:relative;width:22px;height:22px">
            <div style="position:absolute;inset:0;background:#ea7022;border-radius:50%;animation:mapPulse 2.2s ease-out infinite"></div>
            <div style="position:absolute;top:4px;left:4px;width:14px;height:14px;background:#ea7022;border:3px solid white;border-radius:50%;box-shadow:0 2px 10px rgba(234,112,34,0.65)"></div>
          </div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        }),
      }).addTo(map);

      // Enable scroll zoom on user click
      map.on("click", () => {
        if (!map.scrollWheelZoom.enabled()) {
          map.scrollWheelZoom.enable();
          if (!dead) setScrollEnabled(true);
        }
      });

      mapRef.current = map;
      if (!dead) setReady(true);
    });

    return () => {
      dead = true;
      mapRef.current?.remove();
      mapRef.current = null;
      LRef.current = null;
      overlaysRef.current = [];
      polyRef.current = null;
      setReady(false);
      setScrollEnabled(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Clear helper ───────────────────────────────────────────────────────
  const clear = () => {
    overlaysRef.current.forEach((o) => { try { o?.remove(); } catch (_) {} });
    overlaysRef.current = [];
    try { polyRef.current?.remove(); } catch (_) {}
    polyRef.current = null;
  };

  // ── Pill label icon ────────────────────────────────────────────────────
  const pill = (L: any, color: string, text: string, animate = false) =>
    L.divIcon({
      className: animate ? "animate-drop" : "",
      html: `<div style="background:${color};color:#fff;font:700 9px/1 sans-serif;padding:3px 8px;border-radius:999px;white-space:nowrap;box-shadow:0 3px 10px rgba(0,0,0,.25);border:2px solid rgba(255,255,255,0.9);letter-spacing:0.03em">${
        text.length > 18 ? text.slice(0, 18) + "…" : text
      }</div>${
        animate ? `<style>.animate-drop{animation:pinDrop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;}</style>` : ""
      }`,
      iconAnchor: [0, 0],
    });

  // ── Route endpoint markers (start/end) ────────────────────────────────
  const routeMarker = (L: any, color: string, text: string, isStart = false) =>
    L.divIcon({
      className: isStart ? "route-start-marker" : "route-end-marker",
      html: `<div style="position:relative;width:28px;height:28px">
        <div style="position:absolute;inset:0;background:${color};border-radius:50%;box-shadow:0 3px 12px rgba(0,0,0,0.3);border:3px solid white"></div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font:700 10px/1 sans-serif;color:white;white-space:nowrap">${
          isStart ? "S" : "E"
        }</div>
        <div style="position:absolute;top:-22px;left:50%;transform:translateX(-50%);background:${color};color:white;font:700 9px/1 sans-serif;padding:2px 6px;border-radius:4px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.9)">${text}</div>
      </div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

  // ── Individual step pin marker ────────────────────────────────────────
  const stepPin = (L: any, color: string, text: string) =>
    L.divIcon({
      className: "step-pin-marker",
      html: `<div style="position:relative;width:24px;height:32px">
        <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:20px;height:20px;background:${color};border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:3px solid white"></div>
        <div style="position:absolute;bottom:18px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:8px solid ${color};filter:drop-shadow(0 1px 2px rgba(0,0,0,0.2))"></div>
        <div style="position:absolute;top:-20px;left:50%;transform:translateX(-50%);background:${color};color:white;font:700 9px/1 sans-serif;padding:3px 7px;border-radius:4px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.9);text-align:center">${text.length > 12 ? text.slice(0, 12) + "…" : text}</div>
      </div>`,
      iconSize: [24, 32],
      iconAnchor: [12, 32],
    });

  // ── Fly to a point (no-op if coordinates are bad) ─────────────────────
  const safeFly = (map: any, lat: unknown, lng: unknown, z: number) => {
    if (!fin(lat, lng)) {
      setWarn(`Coordinates unavailable (${lat}, ${lng})`);
      setTimeout(() => setWarn(null), 3000);
      return false;
    }
    map.flyTo([lat, lng], z, { duration: 1.1, easeLinearity: 0.25 });
    return true;
  };

  // ── Highlight ring (temporary) ────────────────────────────────────────
  const addHighlightRing = (L: any, lat: number, lng: number) => {
    const ring = L.circleMarker([lat, lng], {
      radius: 18,
      fill: false,
      color: '#ea7022',
      weight: 3,
      opacity: 0.8,
      className: 'highlight-ring',
    }).addTo(mapRef.current);
    requestAnimationFrame(() => {
      const el = ring.getElement?.();
      if (el) {
        el.style.animation = 'ringExpand 1.2s ease-out forwards';
        el.style.transformOrigin = 'center';
      }
    });
    setTimeout(() => {
      try { ring?.remove?.(); } catch (_) {}
    }, 1200);
  };

  // ── Effect: focus a single step ───────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!ready || !map || !L) return;

    clear();
    setWarn(null);
    setIsTracing(false);

    if (!focusPoint) return; // no flyTo on deselect — just clear markers

    const { lat, lng, label } = focusPoint;
    // Tighter zoom for focus points so the user can see the exact location
    if (!safeFly(map, lat, lng, 15)) return;

    overlaysRef.current = [
      // Add a visible pin marker for the selected step
      L.marker([lat, lng], { icon: stepPin(L, "#ea7022", label) }).addTo(map),
      // Keep the pill label as well for additional clarity
      L.marker([lat, lng], { icon: pill(L, "#ea7022", label, true) }).addTo(map),
    ];

    // Add a temporary expanding ring to highlight the selected point
    addHighlightRing(L, lat, lng);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusPoint, ready]);

  // ── Effect: trace full route ──────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!ready || !map || !L) return;

    clear();
    setWarn(null);

    if (!traceRoute) {
      setIsTracing(false);
      return;
    }

    setIsTracing(true);

    const coords: [number, number][] = [];

    let startPoint: [number, number] | null = null;
    let endPoint: [number, number] | null = null;
    let startLabel = "Start";
    let endLabel = "Destination";

    traceRoute.subRoutes.forEach((sub, idx) => {
      const sLng = sub.startLocation?.coordinates?.[0];
      const sLat = sub.startLocation?.coordinates?.[1];
      const eLng = sub.endLocation?.coordinates?.[0];
      const eLat = sub.endLocation?.coordinates?.[1];

      if (fin(sLat, sLng)) {
        coords.push([sLat as number, sLng as number]);
        if (idx === 0) {
          startPoint = [sLat as number, sLng as number];
          startLabel = sub.starting || "Start";
        }
      }

      if (fin(eLat, eLng)) {
        if (idx === traceRoute.subRoutes.length - 1) {
          endPoint = [eLat as number, eLng as number];
          endLabel = sub.ending || "Destination";
          coords.push([eLat as number, eLng as number]);
        }
      }
    });

    // Add persistent start/end markers
    if (startPoint) {
      overlaysRef.current.push(
        L.marker(startPoint, { icon: routeMarker(L, "#4a7c59", startLabel, true) }).addTo(map)
      );
    }
    if (endPoint) {
      overlaysRef.current.push(
        L.marker(endPoint, { icon: routeMarker(L, "#ea7022", endLabel, false) }).addTo(map)
      );
    }

    if (coords.length === 0) {
      setWarn("No valid coordinates found for this route.");
      setIsTracing(false);
      setTimeout(() => setWarn(null), 4000);
      return;
    }

    polyRef.current = L.polyline(coords, {
      color: "#ea7022", weight: 3.5, opacity: 0.9, dashArray: "10, 7",
      lineCap: "round", lineJoin: "round",
    }).addTo(map);

    // ── Animated route-draw (SVG stroke-dashoffset trick) ────────────────
    requestAnimationFrame(() => {
      const el: SVGPathElement | null = polyRef.current?.getElement?.() ?? null;
      if (el && typeof el.getTotalLength === "function") {
        const len = el.getTotalLength();
        el.style.strokeDasharray = `${len}`;
        el.style.strokeDashoffset = `${len}`;
        el.style.transition = "stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)";
        requestAnimationFrame(() => {
          el.style.strokeDashoffset = "0";
        });
      }
    });

    if (coords.length >= 2) {
      map.fitBounds(coords, { padding: [32, 32], animate: true, duration: 1 });
    } else {
      map.flyTo(coords[0], 12, { duration: 1 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traceRoute, ready]);

  // ── Custom zoom handlers ───────────────────────────────────────────────
  const handleZoomIn = useCallback(() => mapRef.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => mapRef.current?.zoomOut(), []);
  const handleReset = useCallback(() => {
    mapRef.current?.flyTo(mountCenter.current, 11, { duration: 0.9, easeLinearity: 0.3 });
  }, []);

  return (
    <>
      {/* Inject pulse keyframe once */}
      <style dangerouslySetInnerHTML={{ __html: PULSE_CSS }} />

      <div className="relative group/map">
        {/* ── Map canvas ─────────────────────────────────────────── */}
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

        {/* ── Custom zoom controls (top-right) ───────────────────── */}
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

        {/* ── Tracing badge ──────────────────────────────────────── */}
        {ready && isTracing && (
          <div className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5 bg-white/90 dark:bg-[#1e1912]/90 border border-ember/30 text-[10px] font-semibold text-ember px-2.5 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
            Tracing route
          </div>
        )}

        {/* ── Scroll-to-zoom hint ─────────────────────────────────── */}
        {ready && !scrollEnabled && (
          <div className="absolute bottom-3 left-3 z-[1000] pointer-events-none">
            <div className="bg-black/50 text-white/90 text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm tracking-wide select-none">
              Click map · scroll to zoom
            </div>
          </div>
        )}

        {/* ── Coordinate warning toast ────────────────────────────── */}
        {warn && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
            ⚠️ {warn}
          </div>
        )}
      </div>
    </>
  );
}
