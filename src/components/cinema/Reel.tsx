import reelImg from "@/assets/frame-projector.jpg";
import { CompositionBackdrop } from "./CompositionBackdrop";
import { Marks } from "./Marks";
import { Reveal } from "./Reveal";
import { useParallax } from "@/hooks/useParallax";

export function Reel() {
  const p = useParallax<HTMLDivElement>(0.08);
  return (
    <section id="reel" className="relative container-x py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 max-w-[1400px] mx-auto"><CompositionBackdrop rule="balance" /></div>
      <div className="mx-auto max-w-[1400px] relative">
        <Marks index="R01·C" label="REEL" meta="Runtime 02:14 · 24P" />

        <Reveal>
          <div className="mt-12 relative mx-auto max-w-[1200px]">
            <div className="relative aspect-[2.39/1] bg-ink overflow-hidden">
              <div ref={p.ref} className="absolute inset-0" style={{ transform: `translate3d(0, ${p.y}px, 0) scale(1.06)` }}>
                <img src={reelImg} alt="A film projector beam cutting through dust" className="absolute inset-0 h-full w-full object-cover opacity-85" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-ink/20" />

              <button className="group absolute inset-0 grid place-items-center" aria-label="Play reel">
                <span className="grid place-items-center w-20 h-20 md:w-24 md:h-24 rounded-full border border-paper/70 group-hover:scale-[1.05] transition duration-700">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-paper translate-x-[2px]"><path d="M6 4l14 8L6 20V4z" /></svg>
                </span>
                <span className="absolute bottom-5 cap text-paper/90">PLAY REEL · 2026</span>
              </button>

              <div className="absolute top-4 left-4 cap text-paper/85">ALEXA · T2.0</div>
              <div className="absolute top-4 right-4 cap text-paper/85 tabular-nums">01:24:06:11</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
