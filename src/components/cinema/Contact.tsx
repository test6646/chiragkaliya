import { CompositionBackdrop } from "./CompositionBackdrop";
import { Marks } from "./Marks";

export function Contact() {
  return (
    <section id="contact" className="relative container-x py-28 md:py-44 bg-paper-deep/40 overflow-hidden">
      <div className="absolute inset-0 max-w-[1500px] mx-auto">
        <CompositionBackdrop rule="negative-space" visible />
      </div>
      <div className="mx-auto max-w-[1500px] relative">
        <Marks index="R09" label="CONTACT" meta="Open · 2026" />

        <h2
          className="mt-16 text-ink max-w-5xl leading-[0.95]"
          style={{ fontSize: "clamp(2.5rem, 7vw, 7.5rem)" }}
        >
          Let's make something
          <span className="block editorial italic font-light text-ink-soft">quiet, and lasting.</span>
        </h2>

        <div className="mt-20 grid gap-12 md:grid-cols-12 border-t border-ink/25 pt-12">
          <div className="md:col-span-5">
            <p className="cap">Write</p>
            <a href="mailto:chiragkaliya47@gmail.com" className="mt-3 block display text-ink text-2xl md:text-3xl under-grow">
              chiragkaliya47@gmail.com
            </a>
          </div>
          <div className="md:col-span-3">
            <p className="cap">Call</p>
            <a href="tel:+919900990099" className="mt-3 block display text-ink text-2xl md:text-3xl">+91 99009 90099</a>
          </div>
          <div className="md:col-span-4">
            <p className="cap">Studio</p>
            <p className="mt-3 display text-ink text-2xl md:text-3xl">
              Botad, Gujarat<span className="block text-ink-mute text-xl">India · Worldwide</span>
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-y-4 cap">
          {["Instagram", "Vimeo", "Behance", "YouTube"].map((s) => (
            <a key={s} className="hover:text-ink transition under-grow inline-block w-fit" href="#">{s} ↗</a>
          ))}
        </div>
      </div>
    </section>
  );
}
