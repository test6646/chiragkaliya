import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Film, Palette, Camera, Home, Lock } from "lucide-react";
import {
  adminConfigured,
  checkPin,
  isAdminAuthed,
  loginAdmin,
  logoutAdmin,
} from "@/lib/admin-auth";
import { HomepageEditor } from "@/components/admin/HomepageEditor";
import { StoriesEditor } from "@/components/admin/StoriesEditor";
import { GradesEditor } from "@/components/admin/GradesEditor";
import { GearEditor } from "@/components/admin/GearEditor";
import { Btn, ConfirmProvider, ToastProvider } from "@/components/admin/ui";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Studio · Chirag Kaliya" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Tab = "home" | "works" | "grades" | "gear";

const TABS = [
  { id: "home" as Tab, label: "Homepage", icon: Home, code: "R00" },
  { id: "works" as Tab, label: "Selected Works", icon: Film, code: "R02" },
  { id: "grades" as Tab, label: "Color Grading", icon: Palette, code: "R04" },
  { id: "gear" as Tab, label: "Working Kit", icon: Camera, code: "R07" },
];

/** Scoped ink-first studio palette — black ink primary, neutral paper surfaces */
const ADMIN_THEME = {
  ["--paper" as any]: "oklch(0.902 0.010 82)",
  ["--paper-deep" as any]: "oklch(0.835 0.010 82)",
  ["--paper-fold" as any]: "oklch(0.958 0.006 82)",
  ["--ink" as any]: "oklch(0.155 0.006 72)",
  ["--ink-soft" as any]: "oklch(0.265 0.006 72)",
  ["--ink-mute" as any]: "oklch(0.455 0.006 72)",
  ["--gold" as any]: "oklch(0.50 0.035 82)",
  ["--gold-soft" as any]: "oklch(0.66 0.026 84)",
} as React.CSSProperties;

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("home");

  useEffect(() => {
    setAuthed(isAdminAuthed());
  }, []);

  if (!authed) return <PinGate onPass={() => setAuthed(true)} />;

  const active = TABS.find((t) => t.id === tab)!;

  return (
    <ToastProvider>
      <ConfirmProvider>
        <div
          className="h-screen w-full bg-paper text-ink overflow-hidden relative"
          style={ADMIN_THEME}
        >
          {/* Subtle status badge top-left (desktop) */}
          <div className="hidden md:flex absolute top-4 left-5 z-30 items-center gap-2 pointer-events-none">
            <span
              className="text-[13px] leading-none text-ink"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}
            >
              CK<span className="text-ink/45 mx-0.5">/</span>
              <span className="editorial italic">Studio</span>
            </span>
            <span className="h-3 w-px bg-ink/20" />
            <p className="text-[9.5px] tracking-[0.32em] uppercase text-ink/45 font-mono">
              {active.code}
            </p>
          </div>

          {/* Floating vertical nav — right side, icon only */}
          <FloatingNav
            tab={tab}
            onTab={setTab}
            onLogout={() => { logoutAdmin(); setAuthed(false); }}
          />

          <main className="h-full overflow-y-auto">
            <div className="h-full pt-16 md:pt-14 pb-5 px-4 md:pl-8 md:pr-28">
              {tab === "home" && <HomepageEditor />}
              {tab === "works" && <StoriesEditor />}
              {tab === "grades" && <GradesEditor />}
              {tab === "gear" && <GearEditor />}
            </div>
          </main>
        </div>
      </ConfirmProvider>
    </ToastProvider>
  );
}

/* ---------------- Floating vertical icon-only nav (right side) ---------------- */

function FloatingNav({
  tab,
  onTab,
  onLogout,
}: {
  tab: Tab;
  onTab: (t: Tab) => void;
  onLogout: () => void;
}) {
  return (
    <>
    {/* Mobile: top horizontal bar */}
    <nav
      aria-label="Studio sections"
      className="md:hidden fixed z-40 top-2 inset-x-2 flex items-center justify-between gap-1 px-2 h-12 rounded-full border border-ink/18 bg-ink text-paper"
    >
      <span
        className="text-[12px] leading-none text-paper pl-2"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
      >
        CK<span className="text-paper/45 mx-0.5">/</span>
        <span className="editorial italic">Studio</span>
      </span>
      <div className="flex items-center gap-0.5">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTab(t.id)}
              aria-label={t.label}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isActive ? "bg-paper text-ink" : "text-paper/65 hover:text-paper"
              }`}
            >
              <Icon className="w-[16px] h-[16px]" />
            </button>
          );
        })}
        <span className="w-px h-5 bg-paper/18 mx-1" />
        <button
          onClick={onLogout}
          aria-label="Sign out"
          className="w-9 h-9 rounded-full flex items-center justify-center text-paper/65 hover:text-paper transition-colors"
        >
          <LogOut className="w-[16px] h-[16px]" />
        </button>
      </div>
    </nav>

    {/* Desktop: floating vertical right rail */}
    <nav
      aria-label="Studio sections"
      className="hidden md:flex fixed z-40 right-5 top-1/2 -translate-y-1/2 flex-col items-center gap-1.5 p-2 rounded-full border border-ink/18 bg-ink text-paper"
    >
      {TABS.map((t) => {
        const Icon = t.icon;
        const isActive = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onTab(t.id)}
            aria-label={t.label}
            title={t.label}
            className={`group relative w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              isActive
                ? "bg-paper text-ink"
                : "text-paper/62 hover:text-paper hover:bg-paper/10"
            }`}
          >
            <Icon className="w-[18px] h-[18px]" />
            {/* tooltip */}
            <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 h-7 rounded-full bg-ink text-paper text-[10px] tracking-[0.22em] uppercase font-mono whitespace-nowrap inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              {t.label}
            </span>
          </button>
        );
      })}
      <span className="w-7 h-px bg-paper/18 my-1" />
      <button
        onClick={onLogout}
        aria-label="Sign out"
        title="Sign out"
        className="group relative w-11 h-11 rounded-full flex items-center justify-center text-paper/55 hover:text-paper hover:bg-paper/10 transition-colors"
      >
        <LogOut className="w-[18px] h-[18px]" />
        <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 h-7 rounded-full bg-ink text-paper text-[10px] tracking-[0.22em] uppercase font-mono whitespace-nowrap inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          Sign out
        </span>
      </button>
    </nav>
    </>
  );
}

/* ---------------- PIN gate (paper theme) ---------------- */

function PinGate({ onPass }: { onPass: () => void }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const configured = adminConfigured();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPin(pin)) { setErr("Incorrect PIN"); return; }
    loginAdmin(pin);
    onPass();
  };

  return (
    <div
      className="min-h-screen grid place-items-center bg-paper text-ink px-5"
      style={ADMIN_THEME}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <span
            className="text-[18px] leading-none text-ink"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
          >
            CK<span className="text-gold/70 mx-0.5">/</span>
            <span className="editorial italic">Studio</span>
          </span>
        </div>
        <form
          onSubmit={submit}
          className="bg-paper-fold border border-ink/15 rounded-3xl p-8 md:p-10"
        >
          <div className="w-11 h-11 rounded-full bg-ink/8 text-ink flex items-center justify-center mx-auto">
            <Lock className="w-4.5 h-4.5" />
          </div>
          <p className="mt-5 text-center text-[10px] tracking-[0.32em] uppercase text-ink/50 font-mono">
            Restricted · Studio access
          </p>
          <h1
            className="mt-3 text-center text-ink"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1,
            }}
          >
            Enter your PIN
          </h1>
          <p
            className="mt-2 text-center text-ink/55"
            style={{ fontFamily: "var(--font-editorial)", fontSize: "15px" }}
          >
            This area is private to the studio.
          </p>

          <input
            type="password"
            autoFocus
            inputMode="numeric"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setErr(null); }}
            placeholder="••••••"
            className="mt-8 w-full h-14 rounded-xl bg-paper-deep/50 border border-ink/12 px-4 text-center tracking-[0.55em] text-[18px] text-ink placeholder:text-ink/30 outline-none focus:border-ink/55 transition-colors"
          />

          {err && (
            <p className="mt-3 text-center text-[10.5px] tracking-[0.25em] uppercase font-mono text-[oklch(0.5_0.18_28)]">
              {err}
            </p>
          )}
          {!configured && (
            <p className="mt-3 text-center text-[10px] tracking-[0.2em] uppercase font-mono text-amber-700">
              VITE_ADMIN_PIN not set in .env
            </p>
          )}

          <Btn type="submit" className="w-full mt-6">
            Continue
          </Btn>

          <p className="mt-7 text-center text-[9.5px] tracking-[0.28em] uppercase font-mono text-ink/35">
            PIN check is client-side · Set VITE_ADMIN_PIN
          </p>
        </form>
      </div>
    </div>
  );
}
