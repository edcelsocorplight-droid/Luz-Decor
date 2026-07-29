"use client";

import { useEffect } from "react";

export default function Spotlight() {
  useEffect(() => {
    const layer = document.querySelector<HTMLElement>(".spotlight-layer");
    if (!layer) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    function onMove(e: PointerEvent) {
      layer!.style.setProperty("--mx", e.clientX + "px");
      layer!.style.setProperty("--my", e.clientY + "px");
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return <div className="spotlight-layer" aria-hidden="true" />;
}
