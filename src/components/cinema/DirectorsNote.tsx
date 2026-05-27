import { Marks } from "./Marks";
import { Reveal } from "./Reveal";
import { CompositionBackdrop } from "./CompositionBackdrop";

const stats: Array<[string, string]> = [
  ["YEARS EXPERIENCE", "08+"],
  ["FILMS DELIVERED", "140+"],
  ["LANGUAGES CUT", "05"],
  ["CRAFTS MASTERED", "04"],
];

export function DirectorsNote() {
  return (
    <section
      id="about"
      className="relative container-x overflow-hidden flex flex-col"
      style={{
        paddingTop: "clamp(48px, 6vh, 72px)",
        paddingBottom: "clamp(32px, 4vh, 56px)",
        backgroundColor: "var(--color-paper)",
      }}
    >
      {/* ===== Backdrop — light, hero-family ===== */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <CompositionBackdrop rule="golden" />
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 0.7px, transparent 0.7px)",
            backgroundSize: "26px 26px",
            color: "var(--color-ink)",
            maskImage:
              "radial-gradient(120% 80% at 60% 45%, black 30%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(120% 80% at 60% 45%, black 30%, transparent 78%)",
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1600 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <g fill="none">
            <g opacity="0.07" stroke="var(--color-ink)" strokeWidth="0.6">
              <line x1="533" y1="0" x2="533" y2="1000" />
              <line x1="1066" y1="0" x2="1066" y2="1000" />
              <line x1="0" y1="333" x2="1600" y2="333" />
              <line x1="0" y1="666" x2="1600" y2="666" />
            </g>
            <g opacity="0.14" stroke="var(--color-gold)" strokeWidth="0.7">
              <line x1="988" y1="0" x2="988" y2="1000" />
              <line x1="0" y1="382" x2="1600" y2="382" />
            </g>
          </g>
          <g stroke="var(--color-ink)" strokeWidth="0.8" opacity="0.3" fill="none">
            <path d="M 60 60 L 60 100 M 60 60 L 100 60" />
            <path d="M 1540 60 L 1540 100 M 1540 60 L 1500 60" />
            <path d="M 60 940 L 60 900 M 60 940 L 100 940" />
            <path d="M 1540 940 L 1540 900 M 1540 940 L 1500 940" />
          </g>
        </svg>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 55% at 70% 50%, color-mix(in oklab, var(--color-gold) 10%, transparent), transparent 70%)",
          }}
        />
      </div>

      {/* ===== Content ===== */}
      <div className="relative mx-auto max-w-[1500px] w-full flex-1 flex flex-col justify-center">
        <Marks index="R02" label="ABOUT · A07" meta="Cinematographer · Editor" />

        <div className="mt-6 md:mt-10 grid gap-8 md:gap-14 md:grid-cols-12 items-center">
          {/* LEFT */}
          <div className="md:col-span-7">
            <Reveal>
              <p className="cap">A note, undated</p>
              <h2
                className="mt-4 display text-ink"
                style={{
                  fontSize: "clamp(2.2rem, 5.4vw, 4.6rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                Patience, <span className="editorial italic gold-grad">framed.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p
                className="mt-7 md:mt-9 editorial text-ink/90 max-w-2xl"
                style={{
                  fontSize: "clamp(19px, 1.7vw, 24px)",
                  lineHeight: 1.6,
                  letterSpacing: "-0.005em",
                  fontWeight: 400,
                }}
              >
                I came to cinematography by accident, in the late afternoon,
                looking for somewhere quiet to think — and stayed because the
                light kept changing. What began as a borrowed camera in a
                rented room became a discipline: a way of watching the world
                long enough for it to reveal its own grammar. My work lives
                between the camera and the cut —
                <span className="italic text-ink"> shot like an editor, edited like a cinematographer,</span> built
                for the breath and silence between two takes. Every film I make
                is a small argument for patience — for trusting the room, the
                face, the weather, and the quiet arithmetic of light.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <p
                className="mt-6 editorial italic text-ink"
                style={{ fontSize: "clamp(14px, 1.1vw, 16px)" }}
              >
                — Chirag Kaliya · 2026
              </p>
            </Reveal>
          </div>

          {/* RIGHT — stats card */}
          <div className="md:col-span-5">
            <Reveal>
              <div className="premium-card max-w-[440px] ml-auto">
                <div className="flex items-center justify-between px-4 py-2 border-b border-ink/20 cap">
                  <span className="cap-gold">CARNET · 2026</span>
                  <span>SHEET 02</span>
                </div>

                <div className="grid grid-cols-2">
                  {stats.map(([k, v], i) => {
                    const isRight = i % 2 === 1;
                    const isBottom = i >= 2;
                    return (
                      <div
                        key={k}
                        className={`px-4 py-4 md:px-5 md:py-5 ${!isRight ? "border-r border-ink/15" : ""} ${!isBottom ? "border-b border-ink/15" : ""}`}
                      >
                        <span className="cap cap-gold" style={{ fontSize: 9 }}>{String(i + 1).padStart(2, "0")}</span>
                        <div
                          className="display text-ink tabular-nums leading-none mt-2"
                          style={{ fontSize: "clamp(1.7rem, 2.6vw, 2.3rem)" }}
                        >
                          {v}
                        </div>
                        <div className="cap mt-2" style={{ fontSize: 10 }}>
                          {k}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between px-4 py-2 border-t border-ink/20 cap">
                  <span>● SIGNED</span>
                  <span className="cap-gold">C.K.</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Footer hairline */}
        <div className="mt-8 md:mt-10 flex items-end justify-between gap-6 pt-3 border-t border-ink/15">
          <span className="cap">↓ Continue</span>
        </div>
      </div>
    </section>
  );
}
