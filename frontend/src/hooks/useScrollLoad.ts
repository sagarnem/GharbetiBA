import { useEffect } from "react";

export function useScrollLoad(threshold: number, callback: () => void) {
  useEffect(() => {
    let triggered = false;

    function onScroll() {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      const scrollRatio = (scrollTop + windowHeight) / fullHeight;

      if (scrollRatio >= threshold && !triggered) {
        triggered = true; // prevent multiple calls until re-enabled
        callback();
      }

      // Reset trigger if user scrolls back up so it can fire again
      if (scrollRatio < threshold) {
        triggered = false;
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, callback]);
}
