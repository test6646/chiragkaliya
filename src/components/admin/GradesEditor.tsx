import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CloudinaryUploader } from "./CloudinaryUploader";
import { Plus, Trash2, ChevronLeft, ChevronRight, Loader2, Save, Edit3 } from "lucide-react";
import {
  Btn, Field, IconBtn, Input, Modal,
  Switch, Textarea, useConfirm, useToast,
} from "./ui";

type Grade = {
  id: string;
  title: string;
  meta: string | null;
  raw_label: string | null;
  graded_label: string | null;
  before_url: string;
  after_url: string;
  before_public_id: string | null;
  after_public_id: string | null;
  sort_order: number;
  published: boolean;
};

export function GradesEditor() {
  const [list, setList] = useState<Grade[] | null>(null);
  const [editing, setEditing] = useState<Grade | null>(null);
  const [index, setIndex] = useState(0);
  const confirm = useConfirm();
  const toast = useToast();

  const load = async () => {
    const { data } = await supabase
      .from("color_grades")
      .select("*")
      .order("sort_order", { ascending: true });
    setList((data as Grade[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    setEditing({
      id: "",
      title: "",
      meta: "",
      raw_label: "",
      graded_label: "",
      before_url: "",
      after_url: "",
      before_public_id: null,
      after_public_id: null,
      sort_order: (list?.length ?? 0) + 1,
      published: false,
    });
  };

  const remove = async (id: string, title: string) => {
    const ok = await confirm({
      title: "Delete grade pair",
      message: `“${title}” and its uploaded stills (in DB) will be removed.`,
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    await supabase.from("color_grades").delete().eq("id", id);
    toast({ tone: "ok", text: "Grade deleted" });
    load();
  };

  const togglePublish = async (g: Grade) => {
    await supabase.from("color_grades").update({ published: !g.published }).eq("id", g.id);
    load();
  };

  const total = list?.length ?? 0;
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const g = list && total > 0 ? list[safeIndex] : null;
  const pad = (n: number) => String(n).padStart(2, "0");

  if (!list) {
    return (
      <div className="inline-flex items-center gap-2 text-ink/60 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] tracking-[0.25em] uppercase text-ink/45 font-mono">
          {pad(total > 0 ? safeIndex + 1 : 0)} / {pad(total)}
        </span>
        <Btn size="sm" onClick={create}><Plus className="w-3.5 h-3.5" /> New pair</Btn>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {!g ? (
          <div className="flex-1 grid place-items-center border border-dashed border-ink/18 rounded-3xl bg-paper-fold text-ink/45 text-sm">
            No grades yet. Click <span className="text-ink ml-1">New pair</span> to start.
          </div>
        ) : (
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-3">
            <div className="bg-paper-fold border border-ink/15 rounded-3xl flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-ink/15">
                <span className="text-[10px] tracking-[0.28em] uppercase text-ink/45 font-mono">
                  {pad(safeIndex + 1)} / {pad(total)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase font-mono">
                  <span className={`w-1.5 h-1.5 rounded-full ${g.published ? "bg-ink" : "bg-ink/30"}`} />
                  <span className={g.published ? "text-ink" : "text-ink/45"}>
                    {g.published ? "Live" : "Draft"}
                  </span>
                </span>
              </div>
              <div className="flex-1 min-h-0 grid grid-cols-2 gap-px bg-ink/15">
                <div className="bg-paper-deep flex items-center justify-center overflow-hidden relative">
                  {g.before_url ? (
                    <img src={g.before_url} alt="before" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] tracking-[0.25em] uppercase text-ink/40 font-mono">Before</span>
                  )}
                  <span className="absolute top-2 left-2 px-2 h-5 rounded-full bg-paper/95 text-ink text-[9px] tracking-[0.22em] uppercase font-mono inline-flex items-center">A</span>
                </div>
                <div className="bg-paper-deep flex items-center justify-center overflow-hidden relative">
                  {g.after_url ? (
                    <img src={g.after_url} alt="after" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] tracking-[0.25em] uppercase text-ink/40 font-mono">After</span>
                  )}
                  <span className="absolute top-2 right-2 px-2 h-5 rounded-full bg-ink/85 text-paper text-[9px] tracking-[0.22em] uppercase font-mono inline-flex items-center">B</span>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-ink/15 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-ink truncate" style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: "-0.015em" }}>
                    {g.title}
                  </div>
                  <div className="text-[10px] tracking-[0.22em] uppercase text-ink/45 font-mono truncate mt-0.5">
                    {g.meta || "—"}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <IconBtn onClick={() => togglePublish(g)} aria-label="Toggle publish">
                    <span className={`w-2 h-2 rounded-full ${g.published ? "bg-ink" : "bg-ink/30"}`} />
                  </IconBtn>
                  <IconBtn onClick={() => setEditing(g)} aria-label="Edit">
                    <Edit3 className="w-3.5 h-3.5" />
                  </IconBtn>
                  <IconBtn tone="danger" onClick={() => remove(g.id, g.title)} aria-label="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </IconBtn>
                </div>
              </div>
            </div>

            {/* Side list */}
            <div className="hidden md:flex flex-col bg-ink border border-ink rounded-3xl overflow-hidden text-paper">
              <div className="px-4 py-3 border-b border-paper/12 text-[10px] tracking-[0.25em] uppercase text-paper/45 font-mono">
                All pairs
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-paper/10">
                {list.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => setIndex(i)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      i === safeIndex ? "bg-paper/12" : "hover:bg-paper/[0.07]"
                    }`}
                  >
                    <div className="w-11 h-8 rounded-xl bg-paper/10 overflow-hidden shrink-0 grid grid-cols-2 gap-px">
                      <div className="bg-paper/10 overflow-hidden">
                        {item.before_url && <img src={item.before_url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="bg-paper/10 overflow-hidden">
                        {item.after_url && <img src={item.after_url} alt="" className="w-full h-full object-cover" />}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] text-paper truncate">{item.title}</div>
                      <div className="text-[9.5px] tracking-[0.2em] uppercase text-paper/42 font-mono truncate">
                        {item.meta || "—"}
                      </div>
                    </div>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.published ? "bg-paper" : "bg-paper/25"}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {total > 0 && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <IconBtn onClick={() => setIndex((i) => (i - 1 + total) % total)} aria-label="Previous">
              <ChevronLeft className="w-4 h-4" />
            </IconBtn>
            <span className="text-[10.5px] tracking-[0.3em] uppercase text-ink/55 font-mono">
              {pad(safeIndex + 1)} <span className="text-ink/25">/</span> {pad(total)}
            </span>
            <IconBtn onClick={() => setIndex((i) => (i + 1) % total)} aria-label="Next">
              <ChevronRight className="w-4 h-4" />
            </IconBtn>
          </div>
        )}
      </div>

      {editing && (
        <GradeEditDialog
          grade={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); toast({ tone: "ok", text: "Grade saved" }); }}
        />
      )}
    </div>
  );
}

function GradeEditDialog({
  grade, onClose, onSaved,
}: { grade: Grade; onClose: () => void; onSaved: () => void }) {
  const [g, setG] = useState<Grade>(grade);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    const title = g.title.trim();
    if (!title || !g.before_url || !g.after_url) {
      setError("Title, before image and after image are required.");
      return;
    }
    setSaving(true);
    const payload = {
        title,
        meta: g.meta,
        raw_label: g.raw_label,
        graded_label: g.graded_label,
        before_url: g.before_url,
        after_url: g.after_url,
        before_public_id: g.before_public_id,
        after_public_id: g.after_public_id,
        published: g.published,
        sort_order: g.sort_order,
      };
    const { error: saveError } = g.id
      ? await supabase.from("color_grades").update(payload).eq("id", g.id)
      : await supabase.from("color_grades").insert(payload);
    if (saveError) {
      setSaving(false);
      setError(saveError.message || "Save failed.");
      return;
    }
    setSaving(false);
    onSaved();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit grade pair"
      subtitle={`Grade · ${g.title || "Untitled"}`}
      size="xl"
      footer={
        <>
          <Switch checked={g.published} onChange={(v) => setG({ ...g, published: v })} label="Published" />
          <span className="flex-1" />
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={save} loading={saving}><Save className="w-3.5 h-3.5" /> Save changes</Btn>
        </>
      }
    >
      <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-4 md:gap-5">
        <div className="rounded-3xl bg-paper-fold border border-ink/12 p-4 md:p-5 space-y-4">
          {error && (
            <p className="rounded-2xl border border-ink/20 bg-paper px-4 py-3 text-[11px] tracking-[0.12em] uppercase text-ink/70 font-mono">
              {error}
            </p>
          )}
          <Field label="Title">
            <Input required value={g.title} onChange={(e) => { setError(null); setG({ ...g, title: e.target.value }); }} />
          </Field>
          <Field label="Meta · subtitle">
            <Input value={g.meta ?? ""} onChange={(e) => setG({ ...g, meta: e.target.value })} placeholder="LOG → REC.709 · Warm anamorphic" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Raw label">
              <Input value={g.raw_label ?? ""} onChange={(e) => setG({ ...g, raw_label: e.target.value })} placeholder="RAW · LOG-C" />
            </Field>
            <Field label="Graded label">
              <Input value={g.graded_label ?? ""} onChange={(e) => setG({ ...g, graded_label: e.target.value })} placeholder="GRADED · 2383" />
            </Field>
          </div>
          <Field label="Notes (optional)">
            <Textarea
              rows={3}
              placeholder="Internal note about this look…"
              value={g.meta ?? ""}
              onChange={(e) => setG({ ...g, meta: e.target.value })}
            />
          </Field>
        </div>

        <div className="rounded-3xl bg-paper border border-ink/12 p-4 md:p-5 grid sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-4">
          <Field label="Before image">
            <CloudinaryUploader
              folder="grades/before"
              accept="image/*"
              currentUrl={g.before_url || null}
              onUploaded={(a) => { setError(null); setG({ ...g, before_url: a.url, before_public_id: a.public_id }); }}
              onClear={() => setG({ ...g, before_url: "", before_public_id: null })}
            />
          </Field>
          <Field label="After image">
            <CloudinaryUploader
              folder="grades/after"
              accept="image/*"
              currentUrl={g.after_url || null}
              onUploaded={(a) => { setError(null); setG({ ...g, after_url: a.url, after_public_id: a.public_id }); }}
              onClear={() => setG({ ...g, after_url: "", after_public_id: null })}
            />
          </Field>
        </div>
      </div>
    </Modal>
  );
}
