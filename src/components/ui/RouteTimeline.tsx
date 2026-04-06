"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Route, SubRoute } from "../../types/place";
import { Clock, MapPin, CornerDownRight, Navigation2, Route as RouteIcon } from "lucide-react";
import type { RouteMapPoint } from "../ui/RouteMap";

interface RouteTimelineProps {
  routes?: Route[];
  onFocusPoint?: (point: RouteMapPoint | null) => void;
  onTraceRoute?: (route: Route | null) => void;
  activeTracedRoute?: Route | null;
  activeFocusPoint?: RouteMapPoint | null;
}

export function RouteTimeline({
  routes = [],
  onFocusPoint,
  onTraceRoute,
  activeTracedRoute,
  activeFocusPoint,
}: RouteTimelineProps) {
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);
  const [activeStepCode, setActiveStepCode] = useState<string | null>(null);

  if (!routes || routes.length === 0) return null;

  const currentRoute = routes[activeRouteIndex];
  const steps = currentRoute.subRoutes;
  const isTracing = activeTracedRoute?.myRouteUniqueCode === currentRoute.myRouteUniqueCode;

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return hours < 24 ? `${hours}h` : `${Math.floor(hours / 24)}d`;
  };

  const handleStepClick = (step: SubRoute) => {
    const lat = step.startLocation.coordinates[1];
    const lng = step.startLocation.coordinates[0];
    const point: RouteMapPoint = { lat, lng, label: step.name };

    if (activeStepCode === step.myCode) {
      // Toggle off
      setActiveStepCode(null);
      onFocusPoint?.(null);
    } else {
      // Cancel trace if active
      if (isTracing) onTraceRoute?.(null);
      setActiveStepCode(step.myCode);
      onFocusPoint?.(point);
    }
  };

  const handleTrace = () => {
    if (isTracing) {
      onTraceRoute?.(null);
      setActiveStepCode(null);
      onFocusPoint?.(null);
    } else {
      setActiveStepCode(null);
      onFocusPoint?.(null);
      onTraceRoute?.(currentRoute);
    }
  };

  return (
    <div className="flex flex-col space-y-5">
      {/* Route Switcher */}
      {routes.length > 1 && (
        <div className="flex flex-wrap gap-2 p-1 bg-sand/50 dark:bg-black/20 rounded-lg">
          {routes.map((r, i) => (
            <button
              key={r.myRouteUniqueCode}
              onClick={() => {
                setActiveRouteIndex(i);
                setActiveStepCode(null);
                onFocusPoint?.(null);
                onTraceRoute?.(null);
              }}
              className={`flex-1 min-w-fit px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-300 ${
                activeRouteIndex === i
                  ? "bg-white dark:bg-[#3a2e24] text-ember shadow-sm ring-1 ring-border-warm dark:ring-[#5a3820]"
                  : "text-stone hover:text-ink dark:hover:text-[#f5ede4]"
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      )}

      {/* Main Timeline View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRoute.myRouteUniqueCode}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Stats + Trace control */}
          <div className="flex items-center justify-between gap-3 py-3 border-b border-border-warm/50 dark:border-[#3a2e24]/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-ember" />
                <span className="text-xs font-semibold text-ink dark:text-[#f5ede4]">
                  {formatTime(currentRoute.estimatedDuration)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-ember" />
                <span className="text-xs font-semibold text-ink dark:text-[#f5ede4]">
                  {currentRoute.estimatedDistance}km
                </span>
              </div>
            </div>

            {/* Trace button */}
            <button
              onClick={handleTrace}
              title={isTracing ? "Stop trace" : "Trace full route on map"}
              className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-300 ${
                isTracing
                  ? "bg-ember text-white border-ember shadow-md"
                  : "border-border-warm dark:border-[#3a2e24] text-stone hover:text-ember hover:border-ember/40"
              }`}
            >
              <RouteIcon size={12} className={isTracing ? "animate-pulse" : ""} />
              {isTracing ? "Tracing…" : "Trace route"}
            </button>
          </div>

          {/* Click-to-locate tip */}
          <p className="text-[10px] text-stone/60 flex items-center gap-1.5 italic">
            <Navigation2 size={10} className="text-ember shrink-0" />
            Click any stop below to pin it on the map
          </p>

          {/* Timeline steps */}
          <div className="relative pl-6 space-y-4">
            {/* Thread line */}
            <div className="absolute left-[7px] top-3 bottom-3 w-px bg-gradient-to-b from-ember via-border-warm dark:via-[#3a2e24] to-sage/60" />

            {steps.map((step) => {
              const isActive = activeStepCode === step.myCode;
              return (
                <motion.div
                  key={step.myCode}
                  whileHover={{ x: 2 }}
                  className={`relative cursor-pointer group rounded-lg px-3 py-2 -mx-3 transition-colors duration-200 ${
                    isActive
                      ? "bg-ember/8 dark:bg-ember/10 ring-1 ring-ember/30"
                      : "hover:bg-sand/70 dark:hover:bg-[#26201a]/60"
                  }`}
                  onClick={() => handleStepClick(step)}
                >
                  {/* Dot */}
                  <div
                    className={`absolute -left-[17px] md:-left-[19px] top-[10px] w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#1e1912] shadow-sm transition-all duration-200 ${
                      isActive ? "bg-ember scale-125" : "bg-border-warm dark:bg-[#3a2e24] group-hover:bg-ember/60"
                    }`}
                  />

                  <div className="flex flex-col">
                    <div className="flex items-center justify-between gap-2">
                      <h5
                        className={`text-[13px] font-medium transition-colors ${
                          isActive ? "text-ember" : "text-ink dark:text-[#f5ede4] group-hover:text-ember"
                        }`}
                      >
                        {step.name}
                      </h5>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-stone font-mono">{step.estimatedDistance}km</span>
                        <span className="text-[10px] text-stone/60">{formatTime(step.estimatedDuration)}</span>
                        {isActive && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-[9px] text-white bg-ember px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold"
                          >
                            Pinned
                          </motion.span>
                        )}
                      </div>
                    </div>
                    {step.description && (
                      <p className="text-[11px] text-stone/70 mt-0.5 leading-relaxed">{step.description}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* End marker */}
            <div className="relative pt-1">
              <div className="absolute -left-[17px] md:-left-[19px] top-2 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#1e1912] bg-sage shadow-sm" />
              <div className="flex items-center gap-2 px-3">
                <h5 className="text-[13px] font-semibold text-sage">
                  {steps[steps.length - 1].ending}
                </h5>
                <span className="bg-sage/15 text-sage text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full">
                  Destination
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Disclaimer */}
      <div className="p-3 bg-terracotta/20 dark:bg-[#26201a]/30 rounded-lg border border-dashed border-border-warm dark:border-[#3a2e24]">
        <div className="flex gap-2">
          <CornerDownRight size={13} className="text-ember mt-0.5 shrink-0" />
          <p className="text-[10px] text-stone/70 leading-relaxed italic">
            Actual trail conditions may vary. Always rely on local guides for real-time route safety.
          </p>
        </div>
      </div>
    </div>
  );
}
