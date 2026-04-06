"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useGeolocation } from "../../hooks/useGeolocation";
import { Toast } from "../ui/Toast";
import { useRouter } from "next/navigation";

const TABS = [
  "All",
  "Religious",
  "Nature",
  "Historical",
  "Adventure",
  "Viewpoint",
  "Village",
];

export function FilterTabBar() {
  const [isSticky, setIsSticky] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const { getLocation, coordinates, error } = useGeolocation();
  const [toastMsg, setToastMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const sentinel = document.getElementById("hero-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If sentinel is above viewport (boundingClientRect.top < 0)
        setIsSticky(entry.boundingClientRect.top < 0);
      },
      { rootMargin: "-56px 0px 0px 0px", threshold: 1.0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (error) {
      setToastMsg("Location access denied");
    } else if (coordinates) {
      router.push(
        `/explore?near=${coordinates.latitude},${coordinates.longitude}`
      );
    }
  }, [coordinates, error, router]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "All") {
      router.push("/explore");
    } else {
      router.push(`/explore?type=${encodeURIComponent(tab)}`);
    }
  };

  return (
    <>
      <div
        className={`w-full bg-white dark:bg-[#1e1912] border-b border-border-warm dark:border-[#3a2e24] z-40 transition-all ${
          isSticky ? "fixed top-14 left-0 shadow-sm" : "relative"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center space-x-6 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`relative py-4 text-sm whitespace-nowrap focus-visible:outline-none ${
                  activeTab === tab
                    ? "text-ember font-medium"
                    : "text-stone hover:text-ink dark:hover:text-[#f5ede4]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute left-0 bottom-0 w-full h-[2px] bg-ember"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="border-l border-border-warm dark:border-[#3a2e24] pl-4 ml-4 py-3 flex-shrink-0">
            <button
              onClick={getLocation}
              className="flex items-center text-sm text-stone hover:text-ember transition-colors focus-visible:outline-none"
            >
              <MapPin size={16} className="mr-1.5" />
              <span>Near Me</span>
            </button>
          </div>
        </div>
      </div>
      <Toast
        message={toastMsg}
        isVisible={!!toastMsg}
        onClose={() => setToastMsg("")}
      />
    </>
  );
}
