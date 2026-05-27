import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown, Loader2, X, AlertTriangle, Check } from "lucide-react";

/* ---------------- Button + IconButton ---------------- */

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "soft";
  loading?: boolean;
  size?: "sm" | "md";
};

export function Btn({
  variant = "primary",
  loading,
  size = "md",
  className = "",
  children,
  disabled,
  type,
  ...rest
}: BtnProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[0.18em] uppercase transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none";
  const sizes = {
    sm: "text-[10px] px-3.5 h-8",
    md: "text-[11px] px-5 h-10",
  };
  const variants = {
    primary: "bg-ink text-paper hover:bg-ink-soft",
    ghost:
      "bg-transparent text-ink/80 hover:text-ink hover:bg-ink/5 border border-ink/15 hover:border-ink/30",
    danger:
      "bg-transparent text-[oklch(0.45_0.16_28)] border border-[oklch(0.45_0.16_28)]/30 hover:bg-[oklch(0.45_0.16_28)] hover:text-paper",
    soft: "bg-ink/[0.04] text-ink hover:bg-ink/[0.08] border border-ink/10",
  };
  return (
    <button
      {...rest}
      type={type ?? "button"}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  );
}

export function IconBtn({
  className = "",
  tone = "default",
  type,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "default" | "danger" }) {
  const toneClass =
    tone === "danger"
      ? "text-ink/45 hover:text-[oklch(0.5_0.18_28)] hover:bg-[oklch(0.5_0.18_28)]/8"
      : "text-ink/55 hover:text-ink hover:bg-ink/[0.06]";
  return (
    <button
      {...rest}
      type={type ?? "button"}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${toneClass} ${className}`}
    />
  );
}

/* ---------------- Field + Input + Textarea + Switch ---------------- */

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[10px] tracking-[0.22em] uppercase text-ink/55 mb-2 font-mono">
        {label}
      </span>
      {children}
      {hint && (
        <span className="block mt-1.5 text-[10.5px] tracking-[0.05em] text-ink/40">{hint}</span>
      )}
    </label>
  );
}

const inputBase =
  "w-full bg-paper border border-ink/18 text-ink placeholder:text-ink/34 rounded-2xl px-4 h-11 text-[14px] font-sans outline-none focus:border-ink/70 transition-colors";

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`${inputBase} ${props.className ?? ""}`} />
);

export const Textarea = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) => (
  <textarea
    {...props}
    className={`${inputBase} h-auto py-3 leading-relaxed resize-y min-h-[88px] ${props.className ?? ""}`}
  />
);

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="group flex items-center gap-3 text-left"
    >
      <span
        className={`relative inline-flex h-6 w-11 rounded-full border transition-colors ${
          checked ? "bg-ink border-ink" : "bg-paper-deep/60 border-ink/20"
        }`}
      >
        <span
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-paper transition-all ${
            checked ? "left-[22px]" : "left-1"
          }`}
        />
      </span>
      {label && (
        <span className="text-[12.5px] tracking-[0.02em] text-ink/75">{label}</span>
      )}
    </button>
  );
}

/* ---------------- Custom Select (no Radix) ---------------- */

export function Select<T extends string>({
  value,
  onChange,
  options,
  placeholder = "Select…",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${inputBase} flex items-center justify-between text-left ${
          open ? "border-ink/55" : ""
        }`}
      >
        <span className={current ? "text-ink" : "text-ink/40"}>
          {current?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-ink/50 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute z-40 mt-2 w-full rounded-2xl border border-ink/15 bg-paper overflow-hidden">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3.5 py-2.5 text-[13.5px] text-left hover:bg-ink/[0.05] transition-colors ${
                o.value === value ? "text-ink font-medium" : "text-ink/70"
              }`}
            >
              {o.label}
              {o.value === value && <Check className="w-3.5 h-3.5 text-gold" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Modal (ESC + button close only — backdrop is inert) ---------------- */

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg" | "xl";
}) {
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.documentElement.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  const widths = { md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl" };
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-3 md:p-6 bg-ink/70">
      <div
        className={`relative w-full ${widths[size]} bg-paper-deep border border-ink/16 rounded-3xl my-auto overflow-hidden`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4 px-5 md:px-6 pt-5 pb-4 border-b border-ink/15 bg-paper-fold/65">
          <div>
            <h3
              className="text-ink text-[22px] md:text-[26px] leading-none"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
            >
              {title}
            </h3>
            {subtitle && (
              <p className="mt-2 text-[11px] tracking-[0.2em] uppercase text-ink/45 font-mono">
                {subtitle}
              </p>
            )}
          </div>
          <IconBtn onClick={onClose} aria-label="Close">
            <X className="w-4 h-4" />
          </IconBtn>
        </div>
        <div className="px-5 md:px-6 py-5">{children}</div>
        {footer && (
          <div className="px-5 md:px-6 py-4 border-t border-ink/15 flex flex-wrap items-center justify-end gap-3 bg-paper-fold/65">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Confirm dialog with useConfirm() hook ---------------- */

type ConfirmOpts = {
  title?: string;
  message: string;
  confirmLabel?: string;
  tone?: "danger" | "neutral";
};

const ConfirmCtx = createContext<((opts: ConfirmOpts) => Promise<boolean>) | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<
    (ConfirmOpts & { resolve: (v: boolean) => void }) | null
  >(null);

  const confirm = useCallback(
    (opts: ConfirmOpts) =>
      new Promise<boolean>((resolve) => setState({ ...opts, resolve })),
    [],
  );

  const close = (v: boolean) => {
    state?.resolve(v);
    setState(null);
  };

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      {state && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-ink/50">
          <div className="w-full max-w-md bg-paper-deep rounded-3xl border border-ink/15 overflow-hidden">
            <div className="p-6 md:p-8">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${
                  state.tone === "danger"
                    ? "bg-[oklch(0.5_0.18_28)]/12 text-[oklch(0.5_0.18_28)]"
                    : "bg-ink/8 text-ink"
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4
                className="text-ink text-[20px] leading-tight"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.015em" }}
              >
                {state.title ?? "Are you sure?"}
              </h4>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/65">{state.message}</p>
            </div>
            <div className="px-6 md:px-8 py-4 border-t border-ink/15 flex justify-end gap-3">
              <Btn variant="ghost" onClick={() => close(false)}>
                Cancel
              </Btn>
              <Btn
                variant={state.tone === "danger" ? "danger" : "primary"}
                onClick={() => close(true)}
              >
                {state.confirmLabel ?? "Confirm"}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </ConfirmCtx.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmCtx);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}

/* ---------------- Toast (lightweight) ---------------- */

type Toast = { id: string; tone: "ok" | "err"; text: string };
const ToastCtx = createContext<((t: Omit<Toast, "id">) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setItems((arr) => [...arr, { ...t, id }]);
    setTimeout(() => setItems((arr) => arr.filter((x) => x.id !== id)), 2800);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-6 right-6 z-[120] flex flex-col gap-2 pointer-events-none">
        {items.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl border text-[12.5px] tracking-[0.04em] ${
              t.tone === "ok"
                ? "bg-ink text-paper border-ink"
                : "bg-paper text-[oklch(0.45_0.18_28)] border-[oklch(0.45_0.18_28)]/30"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

/* ---------------- Card / Section ---------------- */

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-paper-fold border border-ink/15 rounded-3xl ${className}`}>
      {children}
    </div>
  );
}

export function StatPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full bg-ink/[0.05] text-[10.5px] tracking-[0.2em] uppercase text-ink/65 font-mono">
      {children}
    </span>
  );
}

export function uid() {
  return Math.random().toString(36).slice(2);
}

export const _useId = useId;
export const _useMemo = useMemo;
