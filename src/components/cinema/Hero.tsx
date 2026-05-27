import { useEffect, useMemo, useState } from "react";
import heroImg from "@/assets/frame-hero.jpg";

const NAME = "CHIRAG KALIYA";

// deterministic pseudo-random so SSR & client match
function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // random per-letter timing for blur-in + ongoing hunt (slow, organic)
  const rand = useMemo(() => {
    const r = seeded(7);
    const total = 13;
    return Array.from({ length: total }, () => ({
      revealDelay: Math.round(r() * 900),           // 0–900ms scattered
      revealDur: 1400 + Math.round(r() * 700),    // 1.4–2.1s
      huntDelay: Math.round(r() * 9000),          // 0–9s scatter
      huntDur: 9000 + Math.round(r() * 4000),   // 9–13s (slow & lazy)
    }));
  }, []);

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden container-x flex flex-col"
      style={{ minHeight: "100svh", background: "var(--color-paper-deep)" }}
    >
      {/* Minimal backdrop — clean paper, soft gold vignette only */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 70% 30%, color-mix(in oklab, var(--color-gold) 10%, transparent), transparent 70%)",
          }}
        />
      </div>




      <div className="relative w-full mx-auto max-w-[1600px] flex-1 flex flex-col pt-20 md:pt-24 pb-8 md:pb-10">
        <div className="grid gap-8 md:gap-12 lg:gap-16 md:grid-cols-12 items-center flex-1 py-6 md:py-8">
          {/* LEFT — name + CTAs */}
          <div className="md:col-span-8 order-2 md:order-1">
            <div className="cap cap-gold mb-4 md:mb-6 flex items-center gap-3">
              <span className="inline-block w-6 h-px bg-current" />
              <span>R01 · INDEX 2026</span>
            </div>

            {/* Cinematic RACK-FOCUS reveal — letters drift in heavily blurred,
                pull into sharp focus one by one, then occasionally hunt focus
                (random letter softly blurs and snaps back) like a real lens. */}
            <h1
              className="display text-ink hero-name text-center md:text-left"
              style={{
                fontSize: "clamp(2.8rem, 11vw, 10.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
              }}
              aria-label="Chirag Kaliya"
            >
              {["Chirag", "Kaliya"].map((word, wi) => {
                const baseIndex = wi === 0 ? 0 : 7;
                const gradient =
                  wi === 0
                    ? "linear-gradient(180deg, var(--color-ink) 0%, color-mix(in oklab, var(--color-ink) 78%, black) 100%)"
                    : "linear-gradient(180deg, oklch(0.42 0.015 82) 0%, oklch(0.24 0.008 70) 100%)"; return (
                      <span
                        key={wi}
                        className={wi === 0 ? "block" : "block md:pl-[1.25em]"}
                        style={{
                          color: wi === 0
                            ? "var(--color-ink)"
                            : "oklch(0.36 0.012 82)",
                          textShadow:
                            wi === 0
                              ? "0 2px 10px rgba(0,0,0,0.08)"
                              : "0 2px 8px rgba(0,0,0,0.05)",
                        }}
                      >
                        {word.split("").map((ch, i) => {
                          const idx = baseIndex + i;
                          const r = rand[idx] ?? { revealDelay: 0, revealDur: 1200, huntDelay: 0, huntDur: 5000 };
                          return (
                            <span
                              key={idx}
                              aria-hidden
                              className="inline-block hero-letter"
                              style={{
                                opacity: mounted ? 1 : 0,
                                filter: mounted ? "blur(0px)" : "blur(28px)",
                                transform: mounted ? "translateY(0)" : "translateY(8px)",
                                transition: `filter ${r.revealDur}ms cubic-bezier(0.22,1,0.36,1) ${160 + r.revealDelay}ms, opacity 900ms ease-out ${160 + r.revealDelay}ms, transform 1000ms cubic-bezier(0.22,1,0.36,1) ${160 + r.revealDelay}ms`,
                                whiteSpace: "pre",
                                animation: mounted
                                  ? `focus-hunt ${r.huntDur}ms ease-in-out ${1400 + r.huntDelay}ms infinite`
                                  : undefined,
                                willChange: "filter, transform, opacity",
                              }}
                            >
                              {ch}
                            </span>
                          );
                        })}
                        {wi === 0 && (
                          <span className="hidden md:inline">&nbsp;</span>
                        )}
                      </span>
                    );
              })}
            </h1>




            {/* a single hairline + meta strip — replaces the deleted taglines */}
            <div className="mt-6 md:mt-8 hidden md:flex items-center gap-4 text-ink/55">
              <span className="h-px w-10 bg-ink/30" />
              <span className="cap" style={{ fontSize: 11, letterSpacing: "0.3em" }}>
                CINEMATOGRAPHER · BOTAD, GUJARAT
              </span>
            </div>

            <div className="mt-7 md:mt-9 flex items-center gap-3 md:gap-4 flex-nowrap">
              <a
                href="#reel"
                className="cap inline-flex items-center justify-center gap-2 btn-gold"
                style={{ minWidth: 150, height: 48 }}
              >
                ▶ Watch reel
              </a>
              <a
                href="#work"
                className="cap inline-flex items-center justify-center gap-2 btn-ghost"
                style={{ minWidth: 150, height: 48 }}
              >
                Work ↗
              </a>
            </div>
          </div>

          {/* RIGHT — vertical viewfinder */}
          <div className="md:col-span-4 order-1 md:order-2 w-full flex justify-center md:justify-end">
            <div className="relative w-[min(46vw,168px)] md:w-full md:max-w-[260px]">
              <div
                className="relative overflow-hidden bg-[#1a1410] shadow-[0_30px_80px_-30px_rgba(40,28,12,0.4)]"
                style={{ aspectRatio: "3 / 4" }}
              >
                {/* Image: slow ken-burns + gentle duotone wash. No blur. */}
                <img
                  src="/chirag/001.jpeg"
                  alt="Chirag Kaliya, cinematographer"
                  className="absolute inset-0 h-full w-full object-cover will-change-transform origin-top"
                  style={{
                    transform: mounted ? "scale(1.06)" : "scale(1.12)",
                    transition: "transform 9000ms cubic-bezier(0.22,1,0.36,1)",
                    filter: "saturate(0.95) contrast(1.05)",
                  }}
                />
                {/* warm duotone wash to push the image cinematic */}
                <div
                  className="absolute inset-0 mix-blend-soft-light pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, color-mix(in oklab, var(--color-gold) 35%, transparent) 0%, transparent 45%, color-mix(in oklab, #1a0e08 60%, transparent) 100%)",
                  }}
                />
                {/* fine scanlines */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.18] mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 1px, transparent 1px, transparent 3px)",
                  }}
                />
                {/* grain */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                  }}
                />
                {/* vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_45%,rgba(0,0,0,0.55)_100%)]" />

                {/* slow horizontal light-leak sweep */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                >
                  <div
                    className="absolute -inset-y-4 w-1/3"
                    style={{
                      left: "-40%",
                      background:
                        "linear-gradient(90deg, transparent, color-mix(in oklab, var(--color-gold) 50%, transparent), transparent)",
                      mixBlendMode: "screen",
                      filter: "blur(20px)",
                      animation: "hero-sweep 9s ease-in-out infinite",
                    }}
                  />
                </div>

                <div className="cam-corners absolute inset-1.5 z-20 pointer-events-none">
                  <span className="c-tl" /><span className="c-tr" /><span className="c-bl" /><span className="c-br" />
                </div>

                {/* static (non-spinning) center crosshair — feels like a focus mark */}
                <div className="absolute inset-0 z-20 grid place-items-center pointer-events-none">
                  <div
                    className="relative"
                    style={{
                      width: "18%",
                      aspectRatio: "1 / 1",
                      color: "var(--color-gold)",
                      opacity: 0.85,
                      filter: "drop-shadow(0 0 3px rgba(0,0,0,0.4))",
                    }}
                  >
                    <span className="absolute top-0 left-0 w-2 h-2 border-t-[1.5px] border-l-[1.5px]" style={{ borderColor: "currentColor" }} />
                    <span className="absolute top-0 right-0 w-2 h-2 border-t-[1.5px] border-r-[1.5px]" style={{ borderColor: "currentColor" }} />
                    <span className="absolute bottom-0 left-0 w-2 h-2 border-b-[1.5px] border-l-[1.5px]" style={{ borderColor: "currentColor" }} />
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-b-[1.5px] border-r-[1.5px]" style={{ borderColor: "currentColor" }} />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full" style={{ background: "currentColor" }} />
                  </div>
                </div>

                {/* small metadata chip */}
                <div
                  className="absolute left-0 right-0 bottom-2 z-20 flex justify-center pointer-events-none text-ink"
                >
                  <span
                    className="cap tabular-nums"
                    style={{
                      fontSize: 8,
                      letterSpacing: "0.28em",
                      color: "var(--color-gold)",
                      whiteSpace: "nowrap",
                      background: "rgba(0,0,0,0.45)",
                      padding: "3px 7px",
                      backdropFilter: "blur(2px)",
                    }}
                  >
                    ● REC · 35mm · f/1.8
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-6 pt-3 border-t border-ink/10">
          <span className="cap">↓ Scroll</span>
          <span className="cap cap-gold">R01 · INDEX 2026</span>
        </div>
      </div>

      <style>{`
        @keyframes hero-sweep {
          0%   { transform: translateX(0%); opacity: 0; }
          15%  { opacity: 0.6; }
          50%  { transform: translateX(420%); opacity: 0.4; }
          85%  { opacity: 0; }
          100% { transform: translateX(420%); opacity: 0; }
        }
        /* Camera "hunting for focus": letter softly drifts out, snaps back sharp. */
        @keyframes focus-hunt {
          0%,  100% { filter: blur(0px); }
          40%       { filter: blur(0px); }
          55%       { filter: blur(12px); }
          70%       { filter: blur(2px); }
          85%       { filter: blur(0px); }
        }
      `}</style>


    </section>
  );
}
