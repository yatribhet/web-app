"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Sun, Moon, X } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

const LINKS = [
  { name: "Explore", href: "/explore" },
  { name: "Routes", href: "/routes" },
  { name: "Religion", href: "/religion" },
  { name: "Journal", href: "/journal" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isHomeTop = pathname === "/" && !scrolled && !menuOpen;

  const navBg = scrolled || menuOpen
    ? theme === "dark"
      ? "rgba(19, 16, 13, 0.96)"
      : "rgba(253, 244, 236, 0.96)"
    : "transparent";

  return (
    <>
      <motion.header
        className="fixed top-0 w-full h-14 z-50 flex items-center px-4 md:px-8"
        initial={{ borderBottomWidth: 0, backgroundColor: "transparent" }}
        animate={{
          borderBottomWidth: scrolled || menuOpen ? 1 : 0,
          borderColor: scrolled || menuOpen ? "var(--color-border)" : "transparent",
          backgroundColor: navBg,
          backdropFilter: scrolled || menuOpen ? "blur(12px)" : "blur(0px)",
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Logo */}
        <div className="flex-1 flex items-center">
          <Link
            href="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember rounded"
          >
            <img
              src={theme === "dark" ? "/images/logo-short-dark.svg" : "/images/logo-short.svg"}
              alt="Yatribhet Logo"
              className="md:hidden h-9 sm:h-10 w-auto object-contain"
            />
            <img
              src={theme === "dark" ? "/images/logo-dark.svg" : "/images/logo.svg"}
              alt="Yatribhet Logo"
              className="hidden md:block h-9 sm:h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop nav links */}
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

        {/* Right controls */}
        <div className="flex-1 flex items-center justify-end gap-3 md:gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="relative w-16 h-8 rounded-full bg-terracotta dark:bg-[#26201a] p-1 flex items-center justify-between overflow-hidden"
          >
            <Sun
              className={`w-4 h-4 ml-1 relative z-10 transition-colors ${
                theme === "light" ? "text-ember" : "text-stone/60"
              }`}
            />
            <Moon
              className={`w-4 h-4 mr-1 relative z-10 transition-colors ${
                theme === "dark" ? "text-ember" : "text-[#8b4a1a]/60"
              }`}
            />
            <motion.div
              layoutId="theme-pill"
              className="absolute top-1 bottom-1 w-6 bg-white dark:bg-[#3a2e24] rounded-full shadow-sm z-0"
              initial={false}
              animate={{ left: theme === "light" ? "4px" : "calc(100% - 28px)" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </button>

          {/* Desktop CTA */}
          <button className="hidden md:block bg-ember text-white px-4 h-8 rounded text-sm font-medium hover:bg-dusk transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2">
            Plan a Trip
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className={`md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 rounded p-0.5 ${
              isHomeTop ? "text-white" : "text-ink dark:text-[#f5ede4]"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  <X className="w-6 h-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  <Menu className="w-6 h-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-14 z-40 bg-black/30 md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.nav
              key="drawer"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-14 left-0 right-0 z-40 md:hidden bg-sand/97 dark:bg-[#13100d]/97 backdrop-blur-xl border-b border-border-warm dark:border-[#3a2e24] shadow-xl"
            >
              <div className="flex flex-col px-4 py-3 gap-1">
                {LINKS.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center px-3 py-3.5 rounded-lg text-base font-medium transition-colors ${
                        isActive
                          ? "text-ember bg-terracotta/50 dark:bg-[#26201a]"
                          : "text-ink dark:text-[#f5ede4] hover:bg-terracotta/30 dark:hover:bg-[#26201a]/60"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                <div className="mt-2 pt-3 border-t border-border-warm dark:border-[#3a2e24]">
                  <button className="w-full bg-ember text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-dusk transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember">
                    Plan a Trip
                  </button>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
