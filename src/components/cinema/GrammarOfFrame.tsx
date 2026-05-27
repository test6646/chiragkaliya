import { CompositionBackdrop } from "./CompositionBackdrop";
import { Marks } from "./Marks";
import { Reveal } from "./Reveal";

const rules = [
  { rule: "thirds" as const,        n: "I",   title: "Rule of Thirds",   body: "Subjects rest on the strong intersections, not on the centre. Tension lives at the third." },
  { rule: "golden" as const,        n: "II",  title: "Golden Ratio",     body: "Phi · 1.618. The spiral that nature, architecture and the eye all return to." },
  { rule: "leading-lines" as const, n: "III", title: "Leading Lines",    body: "Geometry that carries the gaze. A road, a railing, a shaft of light — all the same verb." },
  { rule: "symmetry" as const,      n: "IV",  title: "Symmetry",         body: "An axis of stillness. Used sparingly; the camera says here it is, look, do not move." },
  { rule: "asymmetry" as const,     n: "V",   title: "Asymmetry & Balance", body: "Weight without mirror. The heavy form against the small mark — the photograph as a scale." },
  { rule: "negative-space" as const, n: "VI", title: "Negative Space",   body: "What is not shown does the loudest work. Air is a character." },
];

export function GrammarOfFrame() {
  return (
    <section id="grammar" className="relative py-28 md:py-40 bg-paper-deep/50 overflow-hidden">
      <div className="mx-auto max-w-[1500px] px-6">
        <Marks index="R03" label="GRAMMAR OF FRAME" meta="Six principles · one grammar" />

        <Reveal>
          <h2
            className="display mt-12 max-w-3xl text-ink"
            style={{ fontSize: "clamp(2rem, 4.4vw, 3.75rem)" }}
          >
            A quiet grammar —
            <span className="editorial italic font-light"> the rules behind the photograph.</span>
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rules.map((r, i) => (
            <Reveal key={r.n} delay={i * 0.04}>
              <article className="relative bg-paper border border-ink/15 aspect-[4/5] p-7 flex flex-col justify-between overflow-hidden">
                <CompositionBackdrop rule={r.rule} visible />
                <div className="relative flex items-baseline justify-between">
                  <span className="display text-4xl text-ink/80">{r.n}</span>
                  <span className="cap">P.0{i + 1}</span>
                </div>
                <div className="relative">
                  <h3 className="display text-2xl text-ink">{r.title}.</h3>
                  <p className="mt-3 editorial text-ink-soft leading-[1.6] text-[15px]">{r.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
