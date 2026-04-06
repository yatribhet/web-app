"use client";

import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

export function ScrollbarProvider({ children }: { children: React.ReactNode }) {
  return (
    <OverlayScrollbarsComponent
      options={{ scrollbars: { theme: "os-theme-ember", autoHide: "scroll" } }}
      defer
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}
