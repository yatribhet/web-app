"use client";

import { useEffect } from "react";
import "overlayscrollbars/overlayscrollbars.css";
import { useOverlayScrollbars } from "overlayscrollbars-react";

export function ScrollbarProvider({ children }: { children: React.ReactNode }) {
  const [initialize] = useOverlayScrollbars({
    options: { scrollbars: { theme: "os-theme-ember", autoHide: "scroll" } },
    defer: true,
  });

  useEffect(() => {
    initialize(document.body);
  }, [initialize]);

  return <>{children}</>;
}
