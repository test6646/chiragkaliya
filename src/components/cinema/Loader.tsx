import { useEffect, useState } from "react";

/**
 * Loader:
 *   Act 1 — camera HUD (only inner ring rotates) + name + progress bar on paper.
 *   Act 2 — center dot grows to flood the screen in BEIGE (paper-deep), not white.
 *   Act 3 — beige flood fades out to reveal the page.
 *   Waits for document.fonts.ready before starting so display fonts don't flicker.
 */
export function Loader() {
  const [ready, setReady] = useState(false);
  const [pct, setPct] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [fade, setFade] = useState(false);
  const [hidden, setHidden] = useState(false);

  const DURATION = 1800;
  const HOLD = 240;
  const ZOOM = 780;
  const FADE = 700;

  // Wait for fonts before showing typography (no FOUT flicker).
  useEffect(() => {
    let cancelled = false;
    const fonts = (document as any).fonts;
    const proceed = () => { if (!cancelled) setReady(true); };
    if (fonts?.ready) {
      fonts.ready.then(proceed).catch(proceed);
      // safety fallback
      setTimeout(proceed, 1500);
    } else {
      setTimeout(proceed, 300);
    }
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DURATION);
      const eased = 1 - Math.pow(1 - p, 3);
      setPct(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const tZoom = setTimeout(() => setZoom(true), DURATION + HOLD);
    const tFade = setTimeout(() => setFade(true), DURATION + HOLD + ZOOM);
    const tHide = setTimeout(() => setHidden(true), DURATION + HOLD + ZOOM + FADE + 60);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(tZoom);
      clearTimeout(tFade);
      clearTimeout(tHide);
    };
  }, [ready]);

  if (hidden) return null;

  const ease = "cubic-bezier(0.7, 0, 0.2, 1)";
  // Maroon flood — accent color
  const FLOOD = "var(--maroon)";
  const INK = "var(--color-ink)";

  return (
    <div
      className="fixed inset-0 z-[90] overflow-hidden pointer-events-auto"
      aria-hidden
      style={{
        opacity: fade ? 0 : 1,
        transition: `opacity ${FADE}ms ${ease}`,
      }}
    >
      {/* Base paper layer — same warm paper as the rest of the site */}
      <div className="absolute inset-0" style={{ background: "var(--color-paper)" }} />

      {/* Subtle warm vignette only — no heavy noise/grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(255,245,220,0.25) 0%, transparent 55%), radial-gradient(100% 80% at 50% 110%, rgba(60,38,18,0.10) 0%, transparent 60%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Center stack — only visible once fonts are ready */}
      <div
        className="absolute inset-0 grid place-items-center px-10 md:px-16"
        style={{ opacity: ready ? 1 : 0, transition: "opacity 240ms ease-out" }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          {/* Camera HUD — outer ring is STATIC, only the inner reticle rotates */}
          <div
            className="relative"
            style={{
              width: "clamp(120px, 22vw, 168px)",
              aspectRatio: "1 / 1",
              opacity: zoom ? 0 : 1,
              transition: "opacity 220ms ease-out",
            }}
          >
            {/* Static outer ring + ticks + crosshair + perfectly centered dot */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
              <defs>
                <mask id="tickMask">
                  <rect width="200" height="200" fill="black" />
                  {Array.from({ length: 60 }).map((_, i) => {
                    const long = i % 5 === 0;
                    const a = (i / 60) * Math.PI * 2;
                    const r1 = 96;
                    const r2 = long ? 80 : 88;
                    const x1 = +(100 + Math.cos(a) * r1).toFixed(2);
                    const y1 = +(100 + Math.sin(a) * r1).toFixed(2);
                    const x2 = +(100 + Math.cos(a) * r2).toFixed(2);
                    const y2 = +(100 + Math.sin(a) * r2).toFixed(2);
                    return (
                      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="white" strokeWidth={long ? 3 : 1.6} strokeLinecap="round" />
                    );
                  })}
                </mask>
              </defs>
              <circle cx="100" cy="100" r="96" fill="none" stroke={INK as any} strokeWidth="2.5" />
              <rect width="200" height="200" fill={INK as any} mask="url(#tickMask)" />
              <rect x="98.5" y="44" width="3" height="22" rx="1.5" fill={INK as any} />
              <rect x="98.5" y="134" width="3" height="22" rx="1.5" fill={INK as any} />
              <rect x="44" y="98.5" width="22" height="3" rx="1.5" fill={INK as any} />
              <rect x="134" y="98.5" width="22" height="3" rx="1.5" fill={INK as any} />
              {/* Perfectly centered dot — same coordinate system as crosshair */}
              <circle cx="100" cy="100" r="9" fill={FLOOD as any} />
            </svg>

            {/* INNER section — only the dashed rings spin, no center marks (so the dot reads perfectly centered) */}
            <div
              className="absolute inset-0"
              style={{ animation: "hud-spin 6s linear infinite", transformOrigin: "50% 50%" }}
            >
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
                <circle cx="100" cy="100" r="68" fill="none" stroke={INK as any} strokeWidth="1.4" opacity="0.7" strokeDasharray="6 4" />
                <circle cx="100" cy="100" r="58" fill="none" stroke={INK as any} strokeWidth="0.9" opacity="0.4" strokeDasharray="2 6" />
              </svg>
            </div>
          </div>

        </div>

      </div>

      {/* Flood splash — separate full-viewport element centered at screen center */}
      <div
        className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
        style={{
          width: "clamp(120px, 22vw, 168px)",
          aspectRatio: "1 / 1",
          background: FLOOD,
          transform: `translate(-50%, -50%) scale(${zoom ? 60 : 0})`,
          transformOrigin: "50% 50%",
          transition: `transform ${ZOOM}ms ${ease}`,
          willChange: "transform",
        }}
      />

      {/* Progress bar */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-10 flex items-center gap-3"
        style={{
          width: "min(72vw, 320px)",
          opacity: ready && !zoom ? 1 : 0,
          transition: "opacity 220ms ease-out",
        }}
      >
        <div className="relative flex-1 h-px bg-ink/15 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0"
            style={{ width: `${pct}%`, background: "var(--color-ink)", transition: "width 80ms linear" }}
          />
        </div>
        <span
          className="cap tabular-nums text-ink"
          style={{ fontSize: 10, letterSpacing: "0.3em", minWidth: 32, textAlign: "right" }}
        >
          {String(pct).padStart(3, "0")}
        </span>
      </div>

      <style>{`
        @keyframes hud-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}