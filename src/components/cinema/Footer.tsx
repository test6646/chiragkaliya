export function Footer() {
  return (
    <footer
      id="contact"
      className="relative px-6 pt-20 pb-10 overflow-hidden scroll-mt-24"
      style={{ background: "var(--color-ink)", color: "var(--color-paper)" }}
    >
      <div
        className="absolute -top-px inset-x-0 h-px"
        style={{ background: "rgba(243,231,212,0.10)" }}
      />

      <div className="relative mx-auto max-w-[1400px]">
        {/* Headline */}
        <div
          className="pb-12 border-b"
          style={{ borderColor: "rgba(243,231,212,0.10)" }}
        >
          <p className="cap" style={{ color: "rgba(243,231,212,0.45)" }}>
            CONTACT
          </p>
          <p
            className="display mt-4 max-w-3xl"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 4.8rem)",
              lineHeight: 0.98,
              color: "var(--color-paper)",
            }}
          >
            Let&apos;s make something{" "}
            <span className="editorial italic" style={{ color: "rgba(243,231,212,0.65)" }}>
              cinematic.
            </span>
          </p>
        </div>

        {/* Contact details grid */}
        <div className="mt-12 grid gap-10 md:grid-cols-4">
          <div>
            <p className="cap" style={{ color: "rgba(243,231,212,0.40)" }}>EMAIL</p>
            <a
              href="mailto:chiragkaliya47@gmail.com"
              className="block mt-2 editorial italic text-lg md:text-xl under-grow break-all"
              style={{ color: "var(--color-paper)" }}
            >
              chiragkaliya47@gmail.com
            </a>
          </div>

          <div>
            <p className="cap" style={{ color: "rgba(243,231,212,0.40)" }}>PHONE</p>
            <a
              href="tel:+919979937462"
              className="block mt-2 editorial italic text-lg md:text-xl under-grow"
              style={{ color: "var(--color-paper)" }}
            >
              +91 99799 37462
            </a>
            <p className="mt-1 cap" style={{ color: "rgba(243,231,212,0.35)" }}>
              MON – SAT · 10—8
            </p>
          </div>

          <div>
            <p className="cap" style={{ color: "rgba(243,231,212,0.40)" }}>BASED IN</p>
            <p
              className="mt-2 editorial italic text-lg md:text-xl"
              style={{ color: "var(--color-paper)" }}
            >
              Botad, Gujarat
            </p>
            <p className="mt-1 cap" style={{ color: "rgba(243,231,212,0.35)" }}>
              AVAILABLE WORLDWIDE
            </p>
          </div>

          <div>
            <p className="cap" style={{ color: "rgba(243,231,212,0.40)" }}>ELSEWHERE</p>
            <ul className="mt-2 flex flex-col gap-1.5 text-[15px]">
              {[
                ["Instagram", "https://instagram.com/"],
                ["Vimeo", "https://vimeo.com/"],
                ["YouTube", "https://youtube.com/"],
              ].map(([n, h]) => (
                <li key={n}>
                  <a
                    href={h}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="under-grow"
                    style={{ color: "var(--color-paper)" }}
                  >
                    {n} <span style={{ color: "rgba(243,231,212,0.5)" }}>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Baseline */}
        <div
          className="mt-14 pt-5 border-t flex flex-col md:flex-row items-start md:items-center justify-between gap-3 cap"
          style={{
            borderColor: "rgba(243,231,212,0.08)",
            color: "rgba(243,231,212,0.45)",
          }}
        >
          <span>© 2026 CHIRAG KALIYA</span>
          <span style={{ color: "rgba(243,231,212,0.55)" }}>CK · CINEMATOGRAPHER</span>
        </div>
      </div>
    </footer>
  );
}
