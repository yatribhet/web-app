"use client";

import { OpeningHoursSpec } from "../../types/place";

interface OpeningHoursProps {
  hours: OpeningHoursSpec[];
}

export function OpeningHours({ hours }: OpeningHoursProps) {
  if (!hours || hours.length === 0) return null;

  const getTodayFull = () => {
    return new Date().toLocaleDateString("en-US", { weekday: "long" });
  };

  const todayStr = getTodayFull();
  
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="flex flex-col space-y-1">
      {hours.map((spec, idx) => {
        const isToday = spec.days.includes(todayStr);
        const isOpen =
          isToday && currentTime >= spec.opens && currentTime <= spec.closes;

        const isAllWeek = spec.days.length === 7;
        const daysDisplay = isAllWeek ? "Everyday" : spec.days.join(", ");

        return (
          <div
            key={idx}
            className={`flex justify-between items-center text-xs py-1.5 border-b border-border-warm dark:border-[#3a2e24] last:border-0 ${
              isToday ? "bg-ember/8 text-ember font-medium px-2 -mx-2 rounded" : "text-stone"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={isToday ? "text-ember" : "text-stone"}>
                {daysDisplay}
              </span>
              {isToday && isOpen && (
                <span className="bg-sage text-white text-[10px] rounded px-1.5 py-0.5 uppercase tracking-wide">
                  Open Now
                </span>
              )}
            </div>
            <span className={isToday ? "text-ember" : "text-ink dark:text-[#f5ede4]"}>
              {spec.opens === "00:00" && spec.closes === "23:59"
                ? "24 Hours"
                : `${spec.opens} - ${spec.closes}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
