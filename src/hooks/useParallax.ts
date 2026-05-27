import { useEffect, useRef, useState } from "react";

/**
 * Returns a translateY in px based on the element's distance from viewport center,
 * multiplied by `speed`. Positive speed = element moves slower than scroll (drifts up).
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(speed = 0.15) {
  const ref = useRef<T | null>(null);
  const [y, setY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = ref.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const delta = center - window.innerHeight / 2;
        setY(-delta * speed);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  return { ref, y };
}

/** Mouse parallax — returns x/y offset based on cursor distance from element center. */
export function useMouseParallax<T extends HTMLElement = HTMLDivElement>(strength = 12) {
  const ref = useRef<T | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const nx = (e.clientX - cx) / r.width;
      const ny = (e.clientY - cy) / r.height;
      setPos({ x: nx * strength, y: ny * strength });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [strength]);

  return { ref, ...pos };
}
