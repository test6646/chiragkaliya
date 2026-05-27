import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, X, SkipBack, SkipForward } from "lucide-react";
import bride from "@/assets/frame-bride.jpg";
import monsoon from "@/assets/frame-monsoon.jpg";
import music from "@/assets/frame-music.jpg";
import lamp from "@/assets/frame-lamp.jpg";
import fog from "@/assets/frame-fog.jpg";
import { Marks } from "./Marks";
import { Reveal } from "./Reveal";
import { CompositionBackdrop } from "./CompositionBackdrop";
import { usePublishedTable } from "@/hooks/useContent";


type Film = {
  title: string;
  format: string;
  year: string;
  lens: string;
  src: string;
  videoUrl: string;
};

type StoryRow = {
  id: string;
  title: string;
  format: string | null;
  year: string | null;
  lens: string | null;
  cover_url: string | null;
  video_url: string | null;
};

const fallbackFilms: Film[] = [
  { title: "Aanchal & Rohan",  format: "Wedding Film", year: "2025", lens: "85MM · T1.4", src: bride,   videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
  { title: "Monsoon, Slowly",  format: "Short · 16mm", year: "2024", lens: "35MM · T2.0", src: monsoon, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
  { title: "Saanjh",           format: "Music Video",  year: "2025", lens: "50MM · T2.0", src: music,   videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
  { title: "Aarti",            format: "Brand Film",   year: "2024", lens: "25MM · T2.8", src: lamp,    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
  { title: "Salt & Silence",   format: "Teaser",       year: "2023", lens: "135MM · T2.0", src: fog,    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
];

/* ------------- Custom Premium Video Player ------------- */
function PlayerModal({ film, onClose }: { film: Film; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [started, setStarted] = useState(false);
  const [errored, setErrored] = useState(false);

  const toggle = () => {
    const v = videoRef.current; if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };
  const toggleMute = () => {
    const v = videoRef.current; if (!v) return;
    v.muted = !v.muted; setMuted(v.muted);
  };
  const toggleFullscreen = () => {
    const el = wrapRef.current; if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };
  const skip = (s: number) => {
    const v = videoRef.current; if (!v) return;
    v.currentTime = Math.max(0, Math.min((v.duration || 0), v.currentTime + s));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") { e.preventDefault(); toggle(); }
      if (e.key === "m" || e.key === "M") toggleMute();
      if (e.key === "f" || e.key === "F") toggleFullscreen();
    };
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFs);
    document.body.style.overflow = "hidden";
    const v = videoRef.current;
    if (v) {
      try { v.load(); } catch {}
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFs);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line
  }, []);

  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current; if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * v.duration;
  };

  const pct = (progress / (duration || 1)) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-md p-4 md:p-8 animate-fade-in">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between cap text-paper/70">
          <span className="cap-gold">● REC · {film.year}</span>
          <span>{film.lens}</span>
        </div>
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between cap text-paper/70">
          <span>{film.format}</span>
          <span className="hidden md:inline">SPACE · M · F · ESC</span>
        </div>
      </div>

      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 md:top-7 md:right-7 z-20 w-10 h-10 grid place-items-center rounded-full border border-paper/20 bg-paper/5 text-paper/85 hover:text-gold hover:border-gold/60 hover:bg-gold/10 transition-all"
      >
        <X className="w-4 h-4" strokeWidth={1.5} />
      </button>

      <div
        ref={wrapRef}
        className="relative w-full max-w-[880px] aspect-video bg-black shadow-[0_30px_120px_-20px_rgba(0,0,0,0.85)] rounded-[2px] overflow-hidden"
      >
        <video
          ref={videoRef}
          src={film.videoUrl}
          autoPlay
          playsInline
          preload="auto"
          muted={muted}
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onPlaying={() => { setStarted(true); setPlaying(true); }}
          onPause={() => setPlaying(false)}
          onError={() => setErrored(true)}
          onClick={toggle}
          className="absolute inset-0 w-full h-full object-contain bg-black cursor-pointer"
        />

        {!started && !errored && (
          <img
            src={film.src}
            alt={film.title}
            className="absolute inset-0 w-full h-full object-contain bg-black pointer-events-none"
          />
        )}

        {errored && (
          <div className="absolute inset-0 grid place-items-center bg-black/80 text-paper/80 cap text-center px-6">
            Video unavailable
          </div>
        )}

        <div className="absolute inset-2.5 pointer-events-none">
          <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gold/70" />
          <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gold/70" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gold/70" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gold/70" />
        </div>

        <div className="absolute top-3 left-4 right-16 pointer-events-none">
          <p className="cap cap-gold" style={{ fontSize: 9 }}>NOW PLAYING</p>
          <h3 className="display text-paper mt-1 leading-none" style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)" }}>
            {film.title}
          </h3>
        </div>

        <div className="absolute left-0 right-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-black/95 via-black/55 to-transparent">
          <div
            onClick={onSeek}
            className="group relative h-[3px] bg-paper/15 cursor-pointer hover:h-[5px] transition-all rounded-full"
          >
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold/70 to-gold rounded-full" style={{ width: `${pct}%` }} />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold shadow-[0_0_0_4px_rgba(0,0,0,0.45)] opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${pct}% - 6px)` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <button onClick={() => skip(-10)} aria-label="Back 10s"
                className="w-8 h-8 grid place-items-center text-paper/80 hover:text-gold transition-colors">
                <SkipBack className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button onClick={toggle} aria-label={playing ? "Pause" : "Play"}
                className="w-10 h-10 grid place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold hover:bg-gold hover:text-ink transition-all">
                {playing
                  ? <Pause className="w-4 h-4" strokeWidth={2} fill="currentColor" />
                  : <Play className="w-4 h-4 ml-0.5" strokeWidth={2} fill="currentColor" />}
              </button>
              <button onClick={() => skip(10)} aria-label="Forward 10s"
                className="w-8 h-8 grid place-items-center text-paper/80 hover:text-gold transition-colors">
                <SkipForward className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <span className="ml-2 cap tabular-nums text-paper/85" style={{ fontSize: 10 }}>
                {fmt(progress)} <span className="text-paper/35 mx-1">/</span> {fmt(duration)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="cap text-paper/50 hidden md:inline mr-2" style={{ fontSize: 9 }}>
                {film.lens} · {film.format}
              </span>
              <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}
                className="w-8 h-8 grid place-items-center text-paper/80 hover:text-gold transition-colors">
                {muted ? <VolumeX className="w-4 h-4" strokeWidth={1.5} /> : <Volume2 className="w-4 h-4" strokeWidth={1.5} />}
              </button>
              <button onClick={toggleFullscreen} aria-label="Fullscreen"
                className="w-8 h-8 grid place-items-center text-paper/80 hover:text-gold transition-colors">
                {fullscreen ? <Minimize2 className="w-4 h-4" strokeWidth={1.5} /> : <Maximize2 className="w-4 h-4" strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------- Desktop hover row ------------- */
function FilmRow({ f, i, onOpen }: { f: Film; i: number; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative w-full text-left border-t border-ink/15 py-6 md:py-8 transition-colors hover:bg-ink/[0.025]"
    >
      <div className="grid grid-cols-12 gap-4 items-center px-2">
        <span className="col-span-1 cap cap-gold tabular-nums" style={{ fontSize: 11 }}>
          {String(i + 1).padStart(2, "0")}
        </span>
        <h3
          className="col-span-5 display text-ink leading-none tracking-tight"
          style={{
            fontSize: "clamp(1.5rem, 2.6vw, 2.4rem)",
            transform: hover ? "translateX(8px)" : "translateX(0)",
            transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {f.title}
        </h3>
        <span className="col-span-3 cap">{f.format}</span>
        <span className="col-span-1 cap tabular-nums">{f.lens}</span>
        <span className="col-span-1 cap tabular-nums text-right">{f.year}</span>
        <span className="col-span-1 cap text-right text-ink group-hover:text-gold transition-colors">
          PLAY ▶
        </span>
      </div>

      {/* Floating preview thumb */}
      <div
        className="pointer-events-none absolute right-[14%] top-1/2 -translate-y-1/2 w-[280px] aspect-[16/9] overflow-hidden shadow-[0_25px_60px_-20px_rgba(0,0,0,0.4)] z-10"
        style={{
          opacity: hover ? 1 : 0,
          transform: `translateY(-50%) translateX(${hover ? 0 : 20}px) scale(${hover ? 1 : 0.95})`,
          transition: "all 450ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <img src={f.src} alt={f.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute top-2 left-2 cap text-paper/85" style={{ fontSize: 9 }}>● PREVIEW</span>
      </div>
    </button>
  );
}

/* ------------- Mobile film card (no hover; play button always visible) ------------- */
function FilmCard({ f, i, onOpen }: { f: Film; i: number; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group relative w-full text-left overflow-hidden border border-ink/15 bg-ink/[0.02] active:scale-[0.99] transition-transform"
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-ink/10">
        <img src={f.src} alt={f.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

        {/* corner ticks */}
        <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-gold/70" />
        <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-gold/70" />
        <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-gold/70" />
        <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-gold/70" />

        {/* top meta */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
          <span className="cap cap-gold tabular-nums" style={{ fontSize: 10 }}>
            № {String(i + 1).padStart(2, "0")}
          </span>
          <span className="cap text-paper/80" style={{ fontSize: 10 }}>● {f.year}</span>
        </div>

        {/* play button center */}
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 grid place-items-center rounded-full border border-gold/60 bg-ink/55 backdrop-blur-sm text-gold shadow-[0_8px_30px_-5px_rgba(0,0,0,0.55)] group-active:scale-95 transition-transform"
        >
          <Play className="w-5 h-5 ml-0.5" strokeWidth={2} fill="currentColor" />
        </span>

        {/* title + meta bottom */}
        <div className="absolute left-4 right-4 bottom-3">
          <h3
            className="display text-paper leading-tight tracking-tight"
            style={{ fontSize: "clamp(1.35rem, 5.5vw, 1.75rem)" }}
          >
            {f.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-2 cap text-paper/75" style={{ fontSize: 10 }}>
            <span>{f.format}</span>
            <span className="text-gold/60">·</span>
            <span className="tabular-nums">{f.lens}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export function SelectedWork() {
  const [active, setActive] = useState<Film | null>(null);
  const rows = usePublishedTable<StoryRow>("stories");
  const films: Film[] = (rows && rows.length > 0)
    ? rows.map((r) => ({
        title: r.title,
        format: r.format ?? "",
        year: r.year ?? "",
        lens: r.lens ?? "",
        src: r.cover_url ?? bride,
        videoUrl: r.video_url ?? "",
      }))
    : fallbackFilms;


  return (
    <section id="work" className="relative container-x py-24 md:py-32" style={{ backgroundColor: "var(--color-paper-deep)" }}>
      <CompositionBackdrop rule="thirds" />
      <div className="mx-auto max-w-[1500px]">
        <Marks index="R02" label="SELECTED WORK" meta="2023 → 2026 · 5 frames" />

        <Reveal>
          <h2
            className="display mt-10 text-ink max-w-4xl"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3.6rem)", lineHeight: 1.05 }}
          >
            Five films, <span className="editorial italic gold-grad">a long quiet decade.</span>
          </h2>
        </Reveal>

        {/* MOBILE: vertical stack of cards (no hover) */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:hidden">
          {films.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.04}>
              <FilmCard f={f} i={i} onOpen={() => { if (f.videoUrl) setActive(f); }} />
            </Reveal>
          ))}
        </div>

        {/* DESKTOP: connected hover list */}
        <div className="mt-12 md:mt-16 border-b border-ink/15 hidden md:block">
          <div className="grid grid-cols-12 gap-4 px-2 pb-3 cap text-ink-mute" style={{ fontSize: 10 }}>
            <span className="col-span-1">№</span>
            <span className="col-span-5">TITLE</span>
            <span className="col-span-3">FORMAT</span>
            <span className="col-span-1">LENS</span>
            <span className="col-span-1 text-right">YEAR</span>
            <span className="col-span-1 text-right">·</span>
          </div>
          {films.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.04}>
              <FilmRow f={f} i={i} onOpen={() => { if (f.videoUrl) setActive(f); }} />
            </Reveal>
          ))}
        </div>
      </div>

      {active && <PlayerModal film={active} onClose={() => setActive(null)} />}
    </section>
  );
}
