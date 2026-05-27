/**
 * Brand marquee — uses ONLY local assets from /public/brands.
 * No third-party icon libraries, no remote URLs.
 */

type Brand = {
  name: string;
  src: string;
  scale?: number; // height multiplier vs base
};

const brands: Brand[] = [
  { name: "Sony",            src: "/brands/sony.svg",           scale: 3.5 },
  { name: "Canon",           src: "/brands/canon.png",          scale: 1.0  },
  { name: "Nikon",           src: "/brands/nikon.svg",          scale: 3.5 },
  { name: "Leica",           src: "/brands/leica.png",          scale: 0.95 },
  { name: "Fujifilm",        src: "/brands/fujifilm.svg",       scale: 3.5 },
  { name: "Panasonic",       src: "/brands/panasonic.svg",      scale: 3.5 },
  { name: "Zeiss",           src: "/brands/zeiss.svg",          scale: 1.0  },
  { name: "DJI",             src: "/brands/dji.svg",            scale: 1.0  },
  { name: "Aputure",         src: "/brands/aputure.svg",        scale: 1.0  },
  { name: "Godox",           src: "/brands/godox.svg",          scale: 1.05 },
  { name: "Apple",           src: "/brands/apple.svg",          scale: 0.85 },
  { name: "DaVinci Resolve", src: "/brands/davinciresolve.svg", scale: 1.0  },
];

function BrandMark({ b }: { b: Brand }) {
  const h = 44 * (b.scale ?? 1);
  return (
    <img
      src={b.src}
      alt={b.name}
      loading="lazy"
      draggable={false}
      style={{
        height: h,
        width: "auto",
        maxWidth: 200,
        // Normalize every logo to a single ink tone
        filter: "brightness(0) saturate(100%) opacity(0.78)",
        transition: "opacity 300ms ease, filter 300ms ease",
      }}
      className="hover:opacity-100"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLImageElement).style.filter =
          "brightness(0) saturate(100%) opacity(1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLImageElement).style.filter =
          "brightness(0) saturate(100%) opacity(0.78)";
      }}
    />
  );
}

function Row({
  dir = "left",
  duration = 60,
  list,
}: {
  dir?: "left" | "right";
  duration?: number;
  list: Brand[];
}) {
  const doubled = [...list, ...list];
  return (
    <div className="marquee-wrap">
      <div
        className="marquee-track items-center"
        style={{ animation: `marquee-${dir} ${duration}s linear infinite` }}
      >
        {doubled.map((b, i) => (
          <div key={`${b.name}-${i}`} className="flex items-center" aria-hidden={i >= list.length}>
            <div
              className="px-10 md:px-16 flex items-center justify-center"
              style={{ minHeight: 72, minWidth: 160 }}
            >
              <BrandMark b={b} />
            </div>
            <span className="text-gold/40 text-lg select-none">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BrandsMarquee() {
  const rowA = brands.filter((_, i) => i % 2 === 0);
  const rowB = brands.filter((_, i) => i % 2 === 1);

  return (
    <section className="relative py-20 md:py-28 border-y border-gold/15 overflow-hidden bg-paper">
      {/* Backdrop */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "radial-gradient(currentColor 0.7px, transparent 0.7px)",
            backgroundSize: "26px 26px",
            color: "var(--color-ink)",
            maskImage: "radial-gradient(120% 70% at 50% 50%, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(120% 70% at 50% 50%, black 30%, transparent 80%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(75% 55% at 50% 50%, color-mix(in oklab, var(--color-gold) 12%, transparent), transparent 70%)",
          }}
        />
      </div>

      {/* Heading */}
      <div className="relative mx-auto max-w-[1600px] px-6 mb-12 md:mb-16 flex items-end justify-between gap-6">
        <div>
          <p className="cap cap-gold">R · X · INSTRUMENTS</p>
          <h2
            className="display text-ink mt-3"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)" }}
          >
            Composed on the{" "}
            <span className="gold-grad italic editorial">finest glass.</span>
          </h2>
        </div>
        <span className="cap hidden md:inline">{brands.length} brands · one language</span>
      </div>

      {/* Mobile: editorial grid (no marquee — practical at small widths) */}
      <div className="relative md:hidden mx-auto max-w-[1600px] px-6">
        <div className="grid grid-cols-3 border-t border-l border-gold/15">
          {brands.map((b) => {
            const s = b.scale ?? 1;
            // base 26px, allow big logos (Sony/Nikon/Fujifilm/Panasonic at 3.5)
            // to actually breathe — cap at 56px so they don't overflow the cell
            const h = Math.min(56, 26 * (s > 1.5 ? 1.8 : s));
            const tight = s >= 2; // no padding on the big SVG marks
            return (
              <div
                key={b.name}
                className={`aspect-[3/2] border-r border-b border-gold/15 flex items-center justify-center ${tight ? "p-0" : "p-3"}`}
              >
                <img
                  src={b.src}
                  alt={b.name}
                  loading="lazy"
                  draggable={false}
                  style={{
                    height: h,
                    maxHeight: 56,
                    maxWidth: tight ? "100%" : "85%",
                    width: "auto",
                    filter: "brightness(0) saturate(100%) opacity(0.82)",
                  }}
                />
              </div>
            );
          })}
        </div>
        <p className="cap text-center mt-6 opacity-70">{brands.length} brands · one language</p>
      </div>

      {/* Desktop: marquee with edge fade masks */}
      <div className="relative hidden md:block">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-32 md:w-56 z-10"
          style={{
            background:
              "linear-gradient(to right, var(--color-paper), transparent)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-32 md:w-56 z-10"
          style={{
            background:
              "linear-gradient(to left, var(--color-paper), transparent)",
          }}
        />

        <Row dir="left" duration={55} list={rowA} />
        <div className="h-px bg-gold/15 my-8 md:my-10" />
        <Row dir="right" duration={70} list={rowB} />
      </div>
    </section>
  );
}
