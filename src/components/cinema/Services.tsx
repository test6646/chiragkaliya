import { useEffect, useRef } from "react";
import { Marks } from "./Marks";
import { Reveal } from "./Reveal";
import { CompositionBackdrop } from "./CompositionBackdrop";


type Clip = { in: number; out: number; label: string; tone: "ink" | "gold" | "maroon" };
type Track = {
  n: string;
  name: string;
  kind: "V" | "A" | "FX";
  tone: Clip["tone"];
  clips: Clip[];
};

/* Clips placed irregularly — touching, gapped, off-center. */
const tracks: Track[] = [
  {
    n: "01",
    name: "Cinematography",
    kind: "V",
    tone: "ink",
    clips: [
      { in: 4,  out: 19, label: "EST · WIDE",     tone: "ink" },
      { in: 19, out: 38, label: "INT · CLOSE",    tone: "gold" },   // touches
      { in: 52, out: 74, label: "DOLLY",          tone: "ink" },    // big gap
      { in: 80, out: 94, label: "MAGIC HOUR",     tone: "maroon" },
    ],
  },
  {
    n: "02",
    name: "Editing",
    kind: "V",
    tone: "gold",
    clips: [
      { in: 8,  out: 22, label: "ASSEMBLY",       tone: "ink" },
      { in: 26, out: 41, label: "ROUGH",          tone: "ink" },
      { in: 41, out: 63, label: "FINE CUT",       tone: "gold" },   // touches
      { in: 70, out: 84, label: "LOCK",           tone: "maroon" },
      { in: 88, out: 96, label: "ONLINE",         tone: "ink" },
    ],
  },
  {
    n: "03",
    name: "Color Grading",
    kind: "FX",
    tone: "maroon",
    clips: [
      { in: 2,  out: 28, label: "NORMALISE",      tone: "ink" },
      { in: 34, out: 56, label: "BALANCE",        tone: "gold" },
      { in: 60, out: 88, label: "LOOK · 2383",    tone: "maroon" }, // close gap
      { in: 91, out: 97, label: "DELIVER",        tone: "ink" },
    ],
  },
  {
    n: "04",
    name: "Direction",
    kind: "A",
    tone: "ink",
    clips: [
      { in: 6,  out: 17, label: "BRIEF",          tone: "ink" },
      { in: 24, out: 39, label: "SCRIPT",         tone: "gold" },
      { in: 39, out: 58, label: "BOARDS",         tone: "ink" },    // touches
      { in: 66, out: 89, label: "SHOOT",          tone: "maroon" },
      { in: 92, out: 97, label: "FIN.",           tone: "gold" },
    ],
  },
];

const toneBg: Record<Clip["tone"], string> = {
  ink:    "var(--color-ink)",
  gold:   "var(--color-gold)",
  maroon: "var(--maroon)",
};

const timecodes = ["00:00", "01:30", "03:00", "04:30", "06:00", "07:30", "09:00"];
const mobileTimecodes = ["00.00", "AA.AA", "BB.BB", "CC.CC", "DD.DD", "EE.EE", "FF.FF"];

export function Services() {
  return (
    <section id="disciplines" className="relative container-x py-16 md:py-40 md:overflow-hidden" style={{ backgroundColor: "var(--color-paper)" }}>
      <CompositionBackdrop rule="leading-lines" />
      <div className="mx-auto max-w-[1280px] relative">
        <Marks index="R04" label="CRAFT · TIMELINE" meta="Four tracks · one sequence" />

        {/* Title — shared (desktop flex / mobile block above the sticky pin) */}
        <div className="mt-10 md:mt-14 flex md:items-end md:justify-between gap-6 md:gap-8 flex-wrap">
          <div className="max-w-3xl">
            <h2 className="display text-ink" style={{ fontSize: "clamp(2.2rem, 5vw, 4.2rem)", lineHeight: 1.02 }}>
              Four tracks,
              <span className="editorial italic gold-grad"> one cut.</span>
            </h2>
            <p className="mt-4 text-ink-mute max-w-xl" style={{ fontSize: "clamp(1rem, 1.2vw, 1.15rem)", lineHeight: 1.55 }}>
              Cinematography, editing, colour, and direction — each a discipline,
              woven into one continuous frame. Every project is built inside this
              timeline from the first wide shot to the final grade.
            </p>
          </div>
          <div className="cap flex items-center gap-3">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 inline-block" style={{background: toneBg.ink}} /> CINE</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 inline-block" style={{background: toneBg.gold}} /> CUT</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 inline-block" style={{background: toneBg.maroon}} /> LOOK</span>
          </div>
        </div>

        {/* ============ DESKTOP TIMELINE ============ */}
        <div className="hidden md:block mt-14 border border-ink/20 bg-paper-fold/50">

          {/* Ruler */}
          <div className="relative h-10 border-b border-ink/20 flex items-end" style={{ paddingLeft: "clamp(160px,18vw,230px)", paddingRight: "clamp(16px,2vw,28px)" }}>
            <div className="relative w-full h-full">
              {Array.from({ length: 37 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute bottom-0 w-px bg-ink/30"
                  style={{ left: `${(i / 36) * 100}%`, height: i % 6 === 0 ? 14 : i % 3 === 0 ? 8 : 4 }}
                />
              ))}
              {timecodes.map((tc, i) => (
                <span
                  key={tc}
                  className="absolute bottom-3 cap tabular-nums text-ink-mute"
                  style={{ left: `${(i / (timecodes.length - 1)) * 100}%`, transform: "translateX(-50%)", fontSize: 10 }}
                >
                  {tc}
                </span>
              ))}
              <div className="absolute top-0 bottom-0 w-px bg-gold timeline-playhead">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-gold" />
              </div>
            </div>
          </div>

          {/* Tracks */}
          <ul>
            {tracks.map((t, ti) => (
              <Reveal key={t.n} delay={ti * 0.05}>
                <li className="grid grid-cols-[clamp(160px,18vw,230px)_1fr] border-b border-ink/15 last:border-0">
                  <div className="px-4 py-5 pr-6 border-r border-ink/15 bg-paper/40">
                    <div className="flex items-center justify-end">
                      <span className="cap text-ink/55 font-bold" style={{ fontSize: 10 }}>{t.kind}{t.n}</span>
                    </div>
                    <div className="display text-ink mt-2 pr-2" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.1 }}>
                      {t.name}
                    </div>
                  </div>

                  <div className="relative h-[72px]">
                    <div className="absolute inset-x-0 top-1/2 h-px bg-ink/10" />
                    {t.clips.map((c, ci) => (
                    <div
                      key={ci}
                      className="absolute top-1/2 -translate-y-1/2 h-[34px] overflow-hidden cursor-default"
                      style={{
                        left: `${c.in}%`,
                        width: `${c.out - c.in}%`,
                        background: toneBg[c.tone],
                        color: c.tone === "gold" ? "#fff" : "var(--color-paper)",
                      }}
                    >
                        <div
                          className="absolute inset-0 opacity-30 pointer-events-none"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 6px)",
                          }}
                        />
                        <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-black/40" />
                        <span className="absolute right-0 top-0 bottom-0 w-[2px] bg-black/40" />
                        <div className="absolute inset-0 flex items-center px-2.5">
                          <span className="cap truncate" style={{ fontSize: 10, color: "inherit", letterSpacing: "0.22em" }}>
                            {c.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>

        </div>

        {/* ============ MOBILE TIMELINE — ROTATED -90°, SCROLL-REVEAL ============ */}
        <MobileTimeline />
      </div>
    </section>
  );
}

/* uneven per-track placement for the mobile rotated view (one clip per track)
   `at` = scroll progress (0..1) at which the clip snaps in fully */
const mobileClips: { in: number; out: number; at: number }[] = [
  { in: 6,  out: 78, at: 0.34 }, // Cinematography
  { in: 14, out: 92, at: 0.50 }, // Editing
  { in: 4,  out: 68, at: 0.66 }, // Color Grading
  { in: 22, out: 96, at: 0.82 }, // Direction
];

function MobileTimeline() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    const target = stickyRef.current;
    if (!el || !target) return;
    let raf = 0;
    let last = -1;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const stickyRange = r.height - vh;
      let p = 0;
      if (stickyRange > 0) {
        if (r.top >= 0) p = 0;
        else if (-r.top >= stickyRange) p = 1;
        else p = -r.top / stickyRange;
      }
      if (Math.abs(p - last) < 0.0015) return;
      last = p;
      target.style.setProperty("--p", p.toFixed(4));
      const pct = String(Math.round(p * 100)).padStart(3, "0");
      if (pctRef.current) pctRef.current.textContent = pct + "%";
    };
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("touchmove", schedule, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("touchmove", schedule);
    };
  }, []);

  // CSS-only ramps derived from --p (no React re-renders)
  const hintP    = "clamp(0, var(--p) / 0.16, 1)";                  // 0 → 1 across [0, 0.16]
  const hintFade = "calc(1 - clamp(0, (var(--p) - 0.16) / 0.08, 1))"; // 1 → 0 across [0.16, 0.24]
  const frameP   = "clamp(0, (var(--p) - 0.18) / 0.12, 1)";          // 0 → 1 across [0.18, 0.30]
  const playhead = "calc(44px + clamp(0, (var(--p) - 0.28) / 0.68, 1) * (100% - 52px) * 0.84)";

  return (
    <div ref={wrapRef} className="md:hidden relative" style={{ height: "440svh" }}>
      <div
        ref={stickyRef}
        className="sticky flex items-center justify-center overflow-hidden bg-paper mx-auto"
        style={{
          top: 0,
          height: "100svh",
          width: "100%",
          ["--p" as string]: "0",
          // Outer/inner share the SAME visual rectangle.
          // --oh = visual height of the rotated frame, --ow = visual width.
          ["--oh" as string]: "min(82svh, calc(86vw * 1.6))",
          ["--ow" as string]: "calc(var(--oh) / 1.6)",
        } as React.CSSProperties}
      >
        <div
          className="relative"
          style={{ width: "var(--ow)", height: "var(--oh)" }}
        >

          {/* ============ PHASE 1 · ROTATE-PHONE HINT ============ */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{ opacity: hintFade as unknown as number }}
          >
            <div className="relative" style={{ width: 140, height: 140 }}>
              <svg
                width="140" height="140" viewBox="0 0 100 100"
                className="absolute inset-0"
                style={{ color: "var(--maroon)", opacity: 0.55 }}
              >
                <path d="M 20 50 A 30 30 0 0 1 50 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="3 3" />
                <polyline points="46,16 50,20 46,24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 80 50 A 30 30 0 0 1 50 80" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="3 3" />
                <polyline points="54,84 50,80 54,76" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {/* Phone — rotates CW (+90deg) as user scrolls */}
              <svg
                width="140" height="140" viewBox="0 0 100 100"
                className="absolute inset-0"
                style={{
                  transform: `rotate(calc(${hintP} * 90deg))`,
                  transformOrigin: "50% 50%",
                  color: "var(--color-ink)",
                  willChange: "transform",
                }}
              >
                <rect x="36" y="18" width="28" height="64" rx="5" ry="5"
                  fill="var(--color-paper)" stroke="currentColor" strokeWidth="2" />
                <line x1="45" y1="24" x2="55" y2="24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="43" y1="76" x2="57" y2="76" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <rect x="40" y="29" width="20" height="42" rx="1.5" fill="var(--maroon)" opacity={0.18} />
              </svg>
            </div>
            <p className="mt-6 display text-ink text-center" style={{ fontSize: "clamp(1.2rem, 5vw, 1.6rem)", lineHeight: 1.1 }}>
              Turn the <span className="editorial italic" style={{ color: "var(--maroon)" }}>sequence</span> sideways.
            </p>
            <p className="mt-3 cap text-ink-mute text-center" style={{ fontSize: 9.5, letterSpacing: "0.22em" }}>
              KEEP SCROLLING · LOADING TIMELINE
            </p>
            <div className="mt-5 w-[140px] h-px overflow-hidden" style={{ background: "rgba(0,0,0,0.12)" }}>
              <div
                className="h-px bg-ink"
                style={{
                  transform: `scaleX(${hintP})`,
                  transformOrigin: "left center",
                }}
              />
            </div>
          </div>

          {/* ============ PHASE 2 · SEQUENCE FRAME (rotated +90°) ============ */}
          <div
            className="absolute left-1/2 border border-ink/20 bg-paper-fold/60 flex flex-col shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]"
            style={{
              top: "50%",
              // pre-rotate: width = visual height, height = visual width
              width: "var(--oh)",
              height: "var(--ow)",
              transform: `translate(-50%, -50%) rotate(90deg) scale(calc(0.96 + ${frameP} * 0.04))`,
              transformOrigin: "center center",
              opacity: frameP as unknown as number,
              willChange: "transform, opacity",
              pointerEvents: "none",
            }}

          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between px-3 py-2 border-b border-ink/20 cap"
              style={{ fontSize: 9 }}
            >
              <span className="cap-gold">SEQUENCE</span>
              <span ref={pctRef} className="tabular-nums">000%</span>
            </div>

            {/* Ruler */}
            <div className="relative h-7 border-b border-ink/20 overflow-hidden">
              <div className="relative w-full h-full px-3">
                <div className="relative w-full h-full">
                  {Array.from({ length: 37 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute bottom-0 w-px bg-ink/30"
                      style={{ left: `${(i / 36) * 100}%`, height: i % 6 === 0 ? 12 : i % 3 === 0 ? 7 : 4 }}
                    />
                  ))}
                  <div className="absolute left-0 right-0 bottom-1.5 flex justify-between">
                    {mobileTimecodes.map((tc) => (
                      <span
                        key={tc}
                        className="cap tabular-nums text-ink-mute"
                        style={{ fontSize: 7.5, letterSpacing: "0.12em" }}
                      >
                        {tc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tracks */}
            <ul className="flex-1 flex flex-col relative">
              <div
                className="absolute top-0 bottom-0 w-px bg-gold pointer-events-none z-10"
                style={{ left: playhead, boxShadow: "0 0 8px var(--color-gold)", willChange: "left" }}
              >
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-gold" />
              </div>

              {tracks.map((t, ti) => {
                const m = mobileClips[ti];
                const clipOp = `clamp(0, (var(--p) - ${(m.at - 0.02).toFixed(3)}) / 0.05, 1)`;
                return (
                  <li
                    key={t.n}
                    className="flex-1 flex items-center border-b border-ink/15 last:border-0 relative"
                  >
                    <div className="absolute left-[44px] right-2 top-1/2 h-px bg-ink/10" />

                    <span
                      className="absolute left-1.5 top-1/2 cap text-ink-mute tabular-nums z-20"
                      style={{
                        transform: "translateY(-50%)",
                        transformOrigin: "center",
                        fontSize: 8,
                        letterSpacing: "0.22em",
                      }}
                    >
                      T{t.n}
                    </span>

                    <div
                      className="absolute top-1/2 -translate-y-1/2 overflow-hidden"
                      style={{
                        left: `calc(44px + ${m.in}% * 0.84)`,
                        width: `calc(${m.out - m.in}% * 0.84)`,
                        height: "62%",
                        background: toneBg[t.tone],
                        color: t.tone === "gold" ? "#fff" : "var(--color-paper)",
                        opacity: clipOp as unknown as number,
                        willChange: "opacity",
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-25 pointer-events-none"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(90deg, rgba(255,255,255,0.22) 0 1px, transparent 1px 8px)",
                        }}
                      />
                      <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-black/40" />
                      <span className="absolute right-0 top-0 bottom-0 w-[2px] bg-black/40" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="display whitespace-nowrap"
                          style={{
                            fontSize: "clamp(0.95rem, 4.2vw, 1.35rem)",
                            lineHeight: 1,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {t.name}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Footer */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-ink/20 cap" style={{ fontSize: 9 }}>
              <span className="cap-gold">FOUR TRACKS</span>
              <span className="tabular-nums">ONE CUT</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

