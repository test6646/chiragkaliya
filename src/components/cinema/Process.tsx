import { useEffect, useRef } from "react";
import { Marks } from "./Marks";
import { CompositionBackdrop } from "./CompositionBackdrop";

const chapters = [
  {
    tc: "00:00:00",
    n: "01",
    title: "Pre-light",
    body:
      "We walk the location at the hour you mean to shoot. We talk about the people, not the equipment. A shot list is drawn — then held loosely.",
  },
  {
    tc: "00:42:00",
    n: "02",
    title: "Capture",
    body:
      "On the day, the set is calm. Few words. We protect the small accidents — a glance, a turn of a head — because those are the takes that survive.",
  },
  {
    tc: "01:18:00",
    n: "03",
    title: "Conform",
    body:
      "Footage is logged, synced, organised like a library. A first assembly goes long before it goes tight. The film tells me when to stop.",
  },
  {
    tc: "02:04:00",
    n: "04",
    title: "Finish",
    body:
      "Grade, sound, titles. The look is finished last — once the cut has earned it. Delivery in your formats; archive in mine.",
  },
];

export function Process() {
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
      const range = r.height - vh;
      let p = 0;
      if (range > 0) {
        if (r.top >= 0) p = 0;
        else if (-r.top >= range) p = 1;
        else p = -r.top / range;
      }
      if (Math.abs(p - last) < 0.0015) return;
      last = p;
      target.style.setProperty("--p", p.toFixed(4));
      if (pctRef.current)
        pctRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0") + "%";
    };
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section
      id="process"
      ref={wrapRef}
      className="relative container-x"
      style={{ height: "420svh", backgroundColor: "var(--color-paper-deep)" }}
    >
      <CompositionBackdrop rule="leading-lines" />
      <div
        ref={stickyRef}
        className="sticky overflow-hidden"
        style={{
          top: 0,
          height: "100svh",
          ["--p" as string]: "0",
        }}
      >
        <div className="relative h-full w-full mx-auto max-w-[1400px] flex flex-col py-16 md:py-20">
          {/* Header */}
          <div className="flex items-end justify-between gap-6">
            <Marks index="R08" label="PROCESS · TIMELINE" meta="Four chapters · one reel" />
          </div>

          <div className="mt-6 md:mt-10 flex items-baseline justify-between">
            <h2
              className="display text-ink"
              style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)", lineHeight: 1 }}
            >
              How a film is made,
              <span className="editorial italic gold-grad"> in four chapters.</span>
            </h2>
            <span
              ref={pctRef}
              className="cap tabular-nums hidden md:inline"
              style={{ color: "var(--color-ink-mute)" }}
            >
              000%
            </span>
          </div>

          {/* Timeline body */}
          <div className="relative flex-1 mt-8 md:mt-12 grid grid-cols-[60px_1fr] md:grid-cols-[90px_1fr] gap-4 md:gap-10">
            {/* RAIL */}
            <div className="relative h-full">
              {/* base rail */}
              <div
                className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px"
                style={{ background: "color-mix(in oklab, var(--color-ink) 18%, transparent)" }}
              />
              {/* progress rail */}
              <div
                className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px]"
                style={{
                  background: "var(--maroon)",
                  height: "calc(var(--p) * 100%)",
                  boxShadow: "0 0 14px -2px var(--maroon)",
                  willChange: "height",
                }}
              />
              {/* tick marks per chapter — placed at chapter centers */}
              {chapters.map((c, i) => {
                const N = chapters.length;
                const center = (i + 0.5) / N;
                const active = `clamp(0, (var(--p) - ${(center - 0.06).toFixed(3)}) / 0.06, 1)`;
                return (
                  <div key={c.n}>
                    <div
                      className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border"
                      style={{
                        top: `calc(${center * 100}% - 6px)`,
                        background: `color-mix(in oklab, var(--maroon) calc(${active} * 100%), var(--color-paper))`,
                        borderColor: "var(--maroon)",
                      }}
                    />
                    <span
                      className="absolute left-1/2 -translate-x-1/2 cap tabular-nums whitespace-nowrap"
                      style={{
                        top: `calc(${center * 100}% + 12px)`,
                        fontSize: 9,
                        color: "var(--color-ink-mute)",
                      }}
                    >
                      {c.tc}
                    </span>
                  </div>
                );
              })}
              {/* playhead diamond */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
                style={{
                  top: "calc(var(--p) * 100% - 8px)",
                  background: "var(--color-gold)",
                  boxShadow: "0 0 16px -2px var(--color-gold)",
                  willChange: "top",
                }}
              />
            </div>

            {/* CHAPTERS — one visible at a time */}
            <div className="relative h-full">
              {chapters.map((c, i) => {
                const N = chapters.length;
                const center = (i + 0.5) / N;
                const half = 0.5 / N; // 0.125
                const fade = 0.035;
                // distance from center; opacity is 1 inside the window, 0 outside (with brief fade)
                const dist = `max(calc(var(--p) - ${center.toFixed(4)}), calc(${center.toFixed(4)} - var(--p)))`;
                const op = `clamp(0, (${half.toFixed(4)} - ${dist}) / ${fade}, 1)`;
                // small parallax in/out
                const ty = `calc((var(--p) - ${center.toFixed(4)}) * -28vh)`;
                return (
                  <article
                    key={c.n}
                    className="absolute inset-x-0 top-1/2"
                    style={{
                      opacity: op as unknown as number,
                      transform: `translateY(calc(-50% + ${ty}))`,
                      willChange: "opacity, transform",
                      pointerEvents: "none",
                    }}
                  >
                    <div className="flex items-baseline gap-4 max-w-3xl">
                      <span className="cap cap-gold tabular-nums">CH · {c.n}</span>
                      <span className="h-px flex-1 bg-ink/15" />
                      <span
                        className="cap tabular-nums"
                        style={{ color: "var(--color-ink-mute)" }}
                      >
                        {c.tc}
                      </span>
                    </div>
                    <h3
                      className="display text-ink mt-5"
                      style={{ fontSize: "clamp(2.4rem, 7vw, 5.2rem)", lineHeight: 0.98 }}
                    >
                      {c.title}
                      <span className="editorial italic" style={{ color: "var(--maroon)" }}>
                        .
                      </span>
                    </h3>
                    <p
                      className="mt-6 editorial text-ink-soft max-w-2xl"
                      style={{ fontSize: "clamp(1.05rem, 1.45vw, 1.25rem)", lineHeight: 1.7 }}
                    >
                      {c.body}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Footer strip */}
          <div
            className="mt-6 md:mt-8 flex items-center justify-between cap"
            style={{ color: "var(--color-ink-mute)" }}
          >
            <span className="cap-gold">FOUR CHAPTERS</span>
            <span className="tabular-nums">SCROLL ↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
