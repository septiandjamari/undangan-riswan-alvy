import { useState, useRef, useCallback, useEffect } from "react";

export function useActivePanel(totalPanels) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const skipRef = useRef(false);
  const skipTimerRef = useRef(null);
  const rafRef = useRef(null);

  const detectActive = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerTop = container.getBoundingClientRect().top;
    let closest = 0;
    let minDist = Infinity;
    [...container.querySelectorAll(".panel")].forEach((panel, i) => {
      const dist = Math.abs(panel.getBoundingClientRect().top - containerTop);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveIndex(closest);
  }, []);

  const scrollToPanel = useCallback((index) => {
    const container = containerRef.current;
    if (!container) return;
    const bounded = Math.max(0, Math.min(index, totalPanels - 1));

    // Update indikator langsung
    setActiveIndex(bounded);

    // Blokir scroll events selama animasi
    skipRef.current = true;
    clearTimeout(skipTimerRef.current);
    skipTimerRef.current = setTimeout(() => { skipRef.current = false; }, 900);

    const h = container.clientHeight || window.innerHeight;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    container.scrollTo({ top: bounded * h, behavior: prefersReduced ? "auto" : "smooth" });
  }, [totalPanels]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      if (skipRef.current) return;
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        detectActive();
        rafRef.current = null;
      });
    };

    const onScrollEnd = () => {
      skipRef.current = false;
      clearTimeout(skipTimerRef.current);
      detectActive();
    };

    const onTouchEnd = () => {
      if (skipRef.current) return;
      setTimeout(detectActive, 300);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    container.addEventListener("scrollend", onScrollEnd, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("scroll", onScroll);
      container.removeEventListener("scrollend", onScrollEnd);
      document.removeEventListener("touchend", onTouchEnd);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(skipTimerRef.current);
    };
  }, [detectActive]);

  return { activeIndex, containerRef, scrollToPanel };
}
