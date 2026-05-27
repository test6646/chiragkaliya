import { useCallback, useRef, useState } from "react";
import { usePublishedTable } from "@/hooks/useContent";
import before1 from "@/assets/grade-before.jpg";
import after1 from "@/assets/grade-after.jpg";
import before2 from "@/assets/grade-2-before.jpg";
import after2 from "@/assets/grade-2-after.jpg";
import before3 from "@/assets/grade-3-before.jpg";
import after3 from "@/assets/grade-3-after.jpg";
import { CompositionBackdrop } from "./CompositionBackdrop";
import { Marks } from "./Marks";
import { Reveal } from "./Reveal";

type Pair = {
  id: string;
  name: string;
  meta: string;
  rawLabel: string;
  gradedLabel: string;
  before: string;
  after: string;
};

const PAIRS: Pair[] = [
  {
    id: "warm-anam",
    name: "Warm Anamorphic",
    meta: "LOG → REC.709 · Warm anamorphic",
    rawLabel: "RAW · LOG-C",
    gradedLabel: "GRADED · 2383",
    before: before1,
    after: after1,
  },
  {
    id: "neon-noir",
    name: "Neon Noir",
    meta: "Teal / magenta · crushed blacks",
    rawLabel: "RAW · LOG-C",
    gradedLabel: "GRADED · NOIR",
    before: before2,
    after: after2,
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    meta: "Amber lift · 65mm film emulation",
    rawLabel: "RAW · LOG-C",
    gradedLabel: "GRADED · 65MM",
    before: before3,
    after: after3,
  },
];

function Comparator({ pair }: { pair: Pair }) {
  const [pos, setPos] = useState(52);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[16/9] overflow-hidden select-none touch-none cursor-ew-resize bg-ink"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => { if (dragging.current) update(e.clientX); }}
      onPointerUp={(e) => {
        dragging.current = false;
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }}
      onPointerCancel={() => (dragging.current = false)}
    >
      <img
        src={pair.after}
        alt={`Color-graded — ${pair.name}`}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={pair.before}
          alt={`Raw LOG — ${pair.name}`}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="absolute top-3 left-3 px-2 py-1 cap text-paper/90 bg-black/30 backdrop-blur-[2px]">{pair.rawLabel}</div>
      <div className="absolute top-3 right-3 px-2 py-1 cap text-paper/90 bg-black/30 backdrop-blur-[2px]">{pair.gradedLabel}</div>

      <div
        className="absolute top-0 bottom-0 w-px bg-paper/85 pointer-events-none shadow-[0_0_18px_rgba(0,0,0,0.4)]"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 grid place-items-center w-11 h-11 rounded-full bg-paper text-ink border border-ink/20 shadow-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 3 12 9 18" />
            <polyline points="15 6 21 12 15 18" />
          </svg>
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-1.5 cap text-paper/85 bg-gradient-to-t from-black/55 to-transparent">
        <span>A / B COMPARE · {pair.name.toUpperCase()}</span>
        <span className="tabular-nums">{Math.round(pos)}%</span>
      </div>
    </div>
  );
}

export function ColorGrading() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const rows = usePublishedTable<{ id: string; title: string; meta: string | null; raw_label: string | null; graded_label: string | null; before_url: string; after_url: string }>("color_grades");
  const PAIRS_DYN: Pair[] = (rows && rows.length > 0)
    ? rows.map((r) => ({
        id: r.id,
        name: r.title,
        meta: r.meta ?? "",
        rawLabel: r.raw_label ?? "RAW · LOG-C",
        gradedLabel: r.graded_label ?? "GRADED",
        before: r.before_url,
        after: r.after_url,
      }))
    : PAIRS;
  const safeIdx = Math.min(idx, PAIRS_DYN.length - 1);
  const current = PAIRS_DYN[safeIdx];


  const go = (next: number) => {
    const n = (next + PAIRS_DYN.length) % PAIRS_DYN.length;
    setDir(n > idx || (idx === PAIRS_DYN.length - 1 && n === 0) ? 1 : -1);
    setIdx(n);
  };

  return (
    <section className="relative container-x py-28 md:py-40 overflow-hidden" style={{ backgroundColor: "var(--color-paper-deep)" }}>
      <div className="absolute inset-0 max-w-[1400px] mx-auto"><CompositionBackdrop rule="symmetry" /></div>
      <div className="mx-auto max-w-[1400px] relative">
        <Marks index="R06" label="COLOR GRADING" meta={current.meta} />

        <div className="mt-16 grid gap-10 md:grid-cols-12 items-end">
          <Reveal className="md:col-span-4">
            <h2 className="display text-ink" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}>
              The grade is where
              <span className="editorial italic font-light"> memory begins.</span>
            </h2>
            <p className="mt-6 editorial text-ink-soft leading-relaxed max-w-sm text-[16px]">
              A look is not a filter — it is a decision about how a place felt at
              a certain hour. Drag to compare raw capture against the finished
              grade, then step through three signature looks.
            </p>
            <div className="mt-8 flex items-center gap-4 cap">
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-ink-mute" /> RAW</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-gold" /> GRADED</span>
              <span className="hidden md:inline">·</span>
              <span className="hidden md:inline">DRAG ↔ TO REVEAL</span>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-8">
            {/* Swiping stage */}
            <div className="relative overflow-hidden">
              <div
                key={current.id}
                style={{
                  animation: `grade-slide-${dir === 1 ? "in-right" : "in-left"} 650ms cubic-bezier(0.22,1,0.36,1) both`,
                }}
              >
                <Comparator pair={current} />
              </div>
            </div>

            {/* Switcher: prev / pairs / next */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => go(idx - 1)}
                aria-label="Previous grade"
                className="cap inline-flex items-center justify-center w-11 h-11 border border-ink/20 text-ink hover:border-gold hover:text-ink hover:bg-gold/10 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 6 9 12 15 18" />
                </svg>
              </button>

              <div className="flex flex-wrap items-center justify-center gap-2 flex-1">
                {PAIRS_DYN.map((p, i) => {
                  const active = i === idx;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => go(i)}
                      aria-pressed={active}
                      className={`cap px-3 py-2 border transition-colors ${
                        active
                          ? "border-gold text-ink bg-gold/10"
                          : "border-ink/15 text-ink-soft hover:text-ink hover:border-ink/35"
                      }`}
                    >
                      <span className="tabular-nums opacity-60 mr-2">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {p.name}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => go(idx + 1)}
                aria-label="Next grade"
                className="cap inline-flex items-center justify-center w-11 h-11 border border-ink/20 text-ink hover:border-gold hover:text-ink hover:bg-gold/10 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </button>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 cap text-ink-soft">
              <span className="tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
              <span className="opacity-50">/</span>
              <span className="tabular-nums opacity-50">{String(PAIRS_DYN.length).padStart(2, "0")}</span>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @keyframes grade-slide-in-right {
          from { opacity: 0; transform: translateX(6%); filter: blur(8px); }
          to   { opacity: 1; transform: translateX(0);   filter: blur(0);   }
        }
        @keyframes grade-slide-in-left {
          from { opacity: 0; transform: translateX(-6%); filter: blur(8px); }
          to   { opacity: 1; transform: translateX(0);   filter: blur(0);   }
        }
      `}</style>
    </section>
  );
}
