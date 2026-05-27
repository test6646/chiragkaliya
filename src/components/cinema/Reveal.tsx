import { useEffect, useRef, type ReactNode, type HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
}

/** Lightweight CSS-only reveal. Uses IntersectionObserver + `.is-in` class. */
export function Reveal({ children, delay = 0, className = "", style, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}s`, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
