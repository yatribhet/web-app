"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

const LINKS = [
  { name: "Explore", href: "/explore" },
  { name: "Routes", href: "/routes" },
  { name: "Religion", href: "/religion" },
  { name: "Journal", href: "/journal" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    onScroll(); // initial check
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHomeTop = pathname === "/" && !scrolled;
  
  return (
    <motion.header
      className="fixed top-0 w-full h-14 z-50 flex items-center px-4 md:px-8 border-b-transparent transition-colors"
      initial={{ borderBottomWidth: 0, backgroundColor: "transparent" }}
      animate={{
        borderBottomWidth: scrolled ? 1 : 0,
        borderColor: scrolled ? "var(--color-border)" : "transparent",
        backgroundColor: scrolled
          ? theme === "dark"
            ? "rgba(19, 16, 13, 0.92)" // sand light var is tricky for bg, we use our hex
            : "rgba(253, 244, 236, 0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-1 flex items-center">
        <Link href="/" className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded">
          {/* Mobile Image (Short version) */}
          <img
            src={theme === "dark" ? "/images/logo-short-dark.svg" : "/images/logo-short.svg"}
            alt="Yatribhet Logo"
            className="md:hidden h-9 sm:h-10 w-auto object-contain"
          />
          
          {/* Desktop Image (Full version) */}
          <img
            src={theme === "dark" ? "/images/logo-dark.svg" : "/images/logo.svg"}
            alt="Yatribhet Logo"
            className="hidden md:block h-9 sm:h-10 w-auto object-contain"
          />
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8 relative">
        {LINKS.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`relative py-1 font-medium text-sm transition-colors ${
                isActive
                  ? "text-ember"
                  : isHomeTop 
                    ? "text-white/80 hover:text-white" 
                    : "text-stone hover:text-ink dark:hover:text-[#f5ede4]"
              }`}
            >
              {link.name}
              {isActive && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute left-0 bottom-0 w-full h-[2px] bg-ember rounded-t"
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1 flex items-center justify-end gap-3 md:gap-4">
        <button
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
          className="relative w-16 h-8 rounded-full bg-terracotta dark:bg-[#26201a] p-1 flex items-center justify-between overflow-hidden"
        >
          {/* Always render both icons, one on each side, with high z-index so they sit above the pill */}
          <Sun className={`w-4 h-4 ml-1 relative z-10 transition-colors ${theme === "light" ? "text-ember" : "text-stone/60"}`} />
          <Moon className={`w-4 h-4 mr-1 relative z-10 transition-colors ${theme === "dark" ? "text-ember" : "text-[#8b4a1a]/60"}`} />
          
          <motion.div
            layoutId="theme-pill"
            className="absolute top-1 bottom-1 w-6 bg-white dark:bg-[#3a2e24] rounded-full shadow-sm z-0"
            initial={false}
            animate={{
              left: theme === "light" ? "4px" : "calc(100% - 28px)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </button>

        <button className="hidden md:block bg-ember text-white px-4 h-8 rounded text-sm font-medium hover:bg-dusk transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2">
          Plan a Trip
        </button>

        <button
          className={`md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 rounded ${
            isHomeTop ? "text-white" : "text-ink dark:text-[#f5ede4]"
          }`}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </motion.header>
  );
}
