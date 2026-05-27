import { Marks } from "./Marks";
import { Reveal } from "./Reveal";
import { CompositionBackdrop } from "./CompositionBackdrop";

type Item = { name: string; spec: string };
type Group = { code: string; cat: string; tone: string; items: Item[] };

const groups: Group[] = [
  {
    code: "01",
    cat: "Camera",
    tone: "var(--color-ink)",
    items: [
      { name: "Sony A7 IV", spec: "FF · 4K · S-Cinetone · S-Log3" },
    ],
  },
  {
    code: "02",
    cat: "Lenses · Sony GM",
    tone: "var(--color-gold)",
    items: [
      { name: "Sony 24 mm GM", spec: "f/1.4 · wide" },
      { name: "Sony 50 mm GM", spec: "f/1.4 · standard" },
      { name: "Sony 85 mm GM", spec: "f/1.4 · portrait" },
    ],
  },
  {
    code: "03",
    cat: "Lenses · Sigma Art",
    tone: "var(--color-gold)",
    items: [
      { name: "Sigma 24 mm Art", spec: "f/1.4 · wide" },
      { name: "Sigma 50 mm Art", spec: "f/1.4 · standard" },
      { name: "Sigma 85 mm Art", spec: "f/1.4 · portrait" },
    ],
  },
  {
    code: "04",
    cat: "Stabilisation",
    tone: "var(--maroon)",
    items: [
      { name: "DJI RS 2", spec: "3-axis · gimbal" },
      { name: "DJI RS 3", spec: "3-axis · gimbal" },
    ],
  },
];

const focals = [24, 50, 85];

export function Gear() {
  return (
    <section id="kit" className="relative container-x py-24 md:py-40 overflow-hidden" style={{ backgroundColor: "var(--color-paper)" }}>
      <CompositionBackdrop rule="golden" />
      <div className="mx-auto max-w-[1400px] relative">
        <Marks index="R07" label="KIT · WORKING SET" meta="What I reach for · regularly" />

        {/* Header */}
        <Reveal>
          <div className="mt-10 md:mt-14 flex md:items-end md:justify-between gap-6 md:gap-10 flex-wrap">
            <h2
              className="display text-ink max-w-3xl"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4.2rem)", lineHeight: 1.02 }}
            >
              A small kit,
              <span className="editorial italic gold-grad"> regularly worked.</span>
            </h2>
            <p className="editorial text-ink-soft text-[15px] md:text-[15.5px] leading-[1.75] max-w-sm">
              Not a rental list. A short set of tools I shoot with on most
              days — body, three focal lengths, two gimbals.
            </p>
          </div>
        </Reveal>

        {/* Focal-length ruler — the three primes I live on */}
        <Reveal delay={0.05}>
          <div className="mt-12 md:mt-16">
            <div className="flex items-center justify-between cap mb-4">
              <span>THE THREE FOCALS · MM</span>
              <span className="cap-gold">● ALWAYS IN THE BAG</span>
            </div>
            <div className="relative border-t border-ink/30 pt-6">
              <div className="flex justify-between max-w-[680px]">
                {focals.map((mm) => (
                  <div key={mm} className="flex flex-col items-center">
                    <span
                      className="rounded-full"
                      style={{
                        width: 12,
                        height: 12,
                        background: "var(--color-gold)",
                        boxShadow:
                          "0 0 12px color-mix(in oklab, var(--color-gold) 55%, transparent)",
                      }}
                    />
                    <span className="cap cap-ink mt-2 tabular-nums">{mm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Working set manifest */}
        <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-5 md:gap-6">
          {groups.map((g, gi) => (
            <Reveal key={g.code} delay={gi * 0.05}>
              <div className="premium-card p-6 md:p-8 h-full flex flex-col">
                <div className="flex items-center justify-between cap">
                  <span className="cap-gold">{g.code}</span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block w-1.5 h-1.5"
                      style={{ background: g.tone }}
                    />
                    {g.cat.toUpperCase()}
                  </span>
                </div>

                <h3
                  className="display text-ink mt-3"
                  style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.55rem)", lineHeight: 1.1 }}
                >
                  {g.cat}
                </h3>

                <ul className="mt-5 flex flex-col gap-3">
                  {g.items.map((it) => (
                    <li
                      key={it.name}
                      className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-2 last:border-0"
                    >
                      <span className="text-ink text-[15px] md:text-[16px] leading-tight">
                        {it.name}
                      </span>
                      <span className="cap text-ink-mute tabular-nums text-right">
                        {it.spec}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Footer line */}
        <div className="mt-6 flex items-center justify-between cap text-ink-mute">
          <span>WORKED WITH</span>
          <span className="cap-gold">SONY · SIGMA · DJI</span>
        </div>
      </div>
    </section>
  );
}
