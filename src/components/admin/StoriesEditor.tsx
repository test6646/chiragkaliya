import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CloudinaryUploader } from "./CloudinaryUploader";
import {
  Loader2, Plus, Trash2, Save, Image as ImageIcon, Edit3, ChevronLeft, ChevronRight,
} from "lucide-react";
import {
  Btn, Field, IconBtn, Input, Modal, Select,
  Switch, Textarea, useConfirm, useToast,
} from "./ui";

type Story = {
  id: string;
  title: string;
  slug: string;
  category: string;
  cover_type: string;
  cover_url: string | null;
  cover_public_id: string | null;
  video_url: string | null;
  format: string | null;
  year: string | null;
  lens: string | null;
  role: string | null;
  location: string | null;
  description: string | null;
  sort_order: number;
  published: boolean;
};

type Media = {
  id: string;
  story_id: string;
  url: string;
  public_id: string | null;
  type: string;
  caption: string | null;
  sort_order: number;
};

const CATEGORIES = [
  { value: "film", label: "Film" },
  { value: "wedding", label: "Wedding" },
  { value: "music", label: "Music video" },
  { value: "brand", label: "Brand" },
  { value: "short", label: "Short" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

export function StoriesEditor() {
  const [list, setList] = useState<Story[] | null>(null);
  const [editing, setEditing] = useState<Story | null>(null);
  const [index, setIndex] = useState(0);
  const confirm = useConfirm();
  const toast = useToast();

  const load = async () => {
    const { data } = await supabase
      .from("stories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    setList((data as Story[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    setEditing({
      id: "",
      title: "",
      slug: "",
      category: "film",
      cover_type: "image",
      cover_url: null,
      cover_public_id: null,
      video_url: null,
      format: null,
      year: null,
      lens: null,
      role: null,
      location: null,
      description: null,
      sort_order: (list?.length ?? 0) + 1,
      published: false,
    });
  };

  const remove = async (id: string, title: string) => {
    const ok = await confirm({
      title: "Delete this work",
      message: `“${title}” and all of its gallery media will be permanently removed.`,
      confirmLabel: "Delete work",
      tone: "danger",
    });
    if (!ok) return;
    await supabase.from("story_media").delete().eq("story_id", id);
    await supabase.from("stories").delete().eq("id", id);
    toast({ tone: "ok", text: "Work deleted" });
    load();
  };

  const togglePublish = async (s: Story) => {
    await supabase.from("stories").update({ published: !s.published }).eq("id", s.id);
    load();
  };

  const total = list?.length ?? 0;
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const current = list && total > 0 ? list[safeIndex] : null;

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
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] tracking-[0.25em] uppercase text-ink/45 font-mono">
          {pad(total > 0 ? safeIndex + 1 : 0)} / {pad(total)}
        </span>
        <Btn onClick={create} size="sm"><Plus className="w-3.5 h-3.5" /> New work</Btn>
      </div>

      {/* Carousel card */}
      <div className="flex-1 min-h-0 flex flex-col">
        {total === 0 || !current ? (
          <div className="flex-1 grid place-items-center border border-dashed border-ink/18 rounded-3xl text-ink/45 text-sm bg-paper-fold">
            No works yet. Click <span className="text-ink ml-1">New work</span> to create one.
          </div>
        ) : (
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[1fr_340px] gap-3">
            {/* Story card */}
            <div className="relative bg-paper-fold border border-ink/15 rounded-3xl flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-ink/15">
                <span className="text-[10px] tracking-[0.28em] uppercase text-ink/45 font-mono">
                  {pad(safeIndex + 1)} / {pad(total)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase font-mono">
                  <span className={`w-1.5 h-1.5 rounded-full ${current.published ? "bg-ink" : "bg-ink/30"}`} />
                  <span className={current.published ? "text-ink" : "text-ink/45"}>
                    {current.published ? "Live" : "Draft"}
                  </span>
                </span>
              </div>

              <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-[180px_1fr]">
                {/* Cover preview */}
                <div className="bg-paper-deep border-r border-ink/15 flex items-center justify-center overflow-hidden">
                  {current.cover_url ? (
                    <img src={current.cover_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-ink/30" />
                  )}
                </div>

                <div className="p-4 md:p-5 flex flex-col min-w-0 overflow-y-auto">
                  <p className="text-[10px] tracking-[0.28em] uppercase text-ink/45 font-mono">
                    {current.category}
                  </p>
                  <h3
                    className="mt-2 text-ink truncate"
                    style={{ fontFamily: "var(--font-display)", fontSize: 36, letterSpacing: "-0.025em", lineHeight: 1 }}
                  >
                    {current.title}
                  </h3>
                  <p className="mt-3 text-ink/65 text-[13.5px] leading-relaxed line-clamp-4">
                    {current.description || "No description yet."}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {[current.year, current.format, current.lens, current.role, current.location]
                      .filter(Boolean)
                      .map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 h-6 inline-flex items-center rounded-full border border-ink/15 text-[9.5px] tracking-[0.2em] uppercase text-ink/70 font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-5 py-3 border-t border-ink/15">
                <span className="text-[10px] tracking-[0.25em] uppercase text-ink/45 font-mono">
                  /{current.slug}
                </span>
                <div className="flex items-center gap-1">
                  <IconBtn onClick={() => togglePublish(current)} aria-label="Toggle publish">
                    <span className={`w-2 h-2 rounded-full ${current.published ? "bg-ink" : "bg-ink/30"}`} />
                  </IconBtn>
                  <IconBtn onClick={() => setEditing(current)} aria-label="Edit">
                    <Edit3 className="w-3.5 h-3.5" />
                  </IconBtn>
                  <IconBtn tone="danger" onClick={() => remove(current.id, current.title)} aria-label="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </IconBtn>
                </div>
              </div>
            </div>

            {/* Side list */}
            <div className="hidden md:flex flex-col bg-ink border border-ink rounded-3xl overflow-hidden text-paper">
              <div className="px-4 py-3 border-b border-paper/12 text-[10px] tracking-[0.25em] uppercase text-paper/45 font-mono">
                All works
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-paper/10">
                {list.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setIndex(i)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      i === safeIndex ? "bg-paper/12" : "hover:bg-paper/[0.07]"
                    }`}
                  >
                    <div className="w-11 h-8 rounded-xl bg-paper/10 overflow-hidden shrink-0 flex items-center justify-center">
                      {s.cover_url ? (
                        <img src={s.cover_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-3 h-3 text-paper/35" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] text-paper truncate">{s.title}</div>
                      <div className="text-[9.5px] tracking-[0.2em] uppercase text-paper/42 font-mono truncate">
                        {s.category} · {s.year || "—"}
                      </div>
                    </div>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.published ? "bg-paper" : "bg-paper/25"}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pager */}
        {total > 0 && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <IconBtn
              onClick={() => setIndex((i) => (i - 1 + total) % total)}
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </IconBtn>
            <span className="text-[10.5px] tracking-[0.3em] uppercase text-ink/55 font-mono">
              {pad(safeIndex + 1)} <span className="text-ink/25">/</span> {pad(total)}
            </span>
            <IconBtn
              onClick={() => setIndex((i) => (i + 1) % total)}
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </IconBtn>
          </div>
        )}
      </div>

      {editing && (
        <StoryEditDialog
          story={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); toast({ tone: "ok", text: "Work saved" }); }}
        />
      )}
    </div>
  );
}

function StoryEditDialog({
  story, onClose, onSaved,
}: { story: Story; onClose: () => void; onSaved: () => void }) {
  const [s, setS] = useState<Story>(story);
  const [media, setMedia] = useState<Media[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirm = useConfirm();

  useEffect(() => {
    supabase
      .from("story_media")
      .select("*")
      .eq("story_id", story.id)
      .order("sort_order", { ascending: true })
      .then(({ data }) => setMedia((data as Media[]) ?? []));
  }, [story.id]);

  const save = async () => {
    const title = s.title.trim();
    const slug = (s.slug?.trim() || slugify(title)).toLowerCase();
    if (!title || !slug || !s.category) {
      setError("Title, slug and category are required.");
      return;
    }
    setSaving(true);
    const payload = {
      title, slug, category: s.category, cover_type: s.cover_type,
      cover_url: s.cover_url, cover_public_id: s.cover_public_id,
      video_url: s.video_url, format: s.format, year: s.year, lens: s.lens,
      role: s.role, location: s.location, description: s.description,
      sort_order: s.sort_order, published: s.published,
    };
    const { error: saveError } = s.id ? await supabase.from("stories").update(payload).eq("id", s.id)
      : await supabase.from("stories").insert(payload);
    if (saveError) {
      setSaving(false);
      setError(saveError.message || "Save failed.");
      return;
    }
    setSaving(false);
    onSaved();
  };

  const addMedia = async (url: string, public_id: string, type: "image" | "video") => {
    if (!story.id) {
      setError("Save the work first, then add gallery media.");
      return;
    }
    const { data } = await supabase
      .from("story_media")
      .insert({ story_id: story.id, url, public_id, type, sort_order: media.length + 1 })
      .select()
      .single();
    if (data) setMedia([...media, data as Media]);
  };

  const removeMedia = async (id: string) => {
    const ok = await confirm({
      message: "Remove this media item from the gallery?",
      confirmLabel: "Remove",
      tone: "danger",
    });
    if (!ok) return;
    await supabase.from("story_media").delete().eq("id", id);
    setMedia(media.filter((m) => m.id !== id));
  };

  const updateCaption = async (id: string, caption: string) => {
    await supabase.from("story_media").update({ caption }).eq("id", id);
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit work"
      subtitle={`Story · ${s.title || "Untitled"}`}
      size="xl"
      footer={
        <>
          <Switch checked={s.published} onChange={(v) => setS({ ...s, published: v })} label="Published" />
          <span className="flex-1" />
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={save} loading={saving}><Save className="w-3.5 h-3.5" /> Save changes</Btn>
        </>
      }
    >
       <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-4 md:gap-5">
        <div className="rounded-3xl bg-paper-fold border border-ink/12 p-4 md:p-5 space-y-4">
          {error && (
            <p className="rounded-2xl border border-ink/20 bg-paper px-4 py-3 text-[11px] tracking-[0.12em] uppercase text-ink/70 font-mono">
              {error}
            </p>
          )}
          <Field label="Title">
            <Input required value={s.title} onChange={(e) => { setError(null); setS({ ...s, title: e.target.value }); }} />
          </Field>
          <Field label="Slug" hint="Lowercase, dashes only">
            <Input value={s.slug} onChange={(e) => setS({ ...s, slug: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            <Field label="Category">
              <Select
                value={s.category}
                onChange={(v) => setS({ ...s, category: v })}
                options={CATEGORIES}
              />
            </Field>
            <Field label="Year">
              <Input value={s.year ?? ""} onChange={(e) => setS({ ...s, year: e.target.value })} placeholder="2026" />
            </Field>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            <Field label="Format">
              <Input value={s.format ?? ""} onChange={(e) => setS({ ...s, format: e.target.value })} placeholder="Wedding Film" />
            </Field>
            <Field label="Lens">
              <Input value={s.lens ?? ""} onChange={(e) => setS({ ...s, lens: e.target.value })} placeholder="85MM · T1.4" />
            </Field>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            <Field label="Role">
              <Input value={s.role ?? ""} onChange={(e) => setS({ ...s, role: e.target.value })} placeholder="DOP" />
            </Field>
            <Field label="Location">
              <Input value={s.location ?? ""} onChange={(e) => setS({ ...s, location: e.target.value })} placeholder="Botad · Gujarat" />
            </Field>
          </div>
          <Field label="Description">
            <Textarea
              rows={4}
              value={s.description ?? ""}
              onChange={(e) => setS({ ...s, description: e.target.value })}
              placeholder="A short note about this story…"
            />
          </Field>
          <Field label="Video URL" hint="Cloudinary auto-fills below, or paste an external link">
            <Input
              value={s.video_url ?? ""}
              onChange={(e) => setS({ ...s, video_url: e.target.value })}
              placeholder="https://…"
            />
          </Field>
        </div>

        <div className="rounded-3xl bg-paper border border-ink/12 p-4 md:p-5 space-y-4">
          <Field label="Cover · thumbnail">
            <CloudinaryUploader
              folder="stories/covers"
              currentUrl={s.cover_url}
              onUploaded={(a) =>
                setS({
                  ...s,
                  cover_url: a.url,
                  cover_public_id: a.public_id,
                  cover_type: a.resource_type === "video" ? "video" : "image",
                })
              }
              onClear={() => setS({ ...s, cover_url: null, cover_public_id: null })}
            />
          </Field>

          <Field label="Full video upload · optional">
            <CloudinaryUploader
              folder="stories/videos"
              accept="video/*"
              label="Upload video file"
              currentUrl={null}
              onUploaded={(a) => setS({ ...s, video_url: a.url })}
              compact
            />
          </Field>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] tracking-[0.22em] uppercase text-ink/55 font-mono">
                Gallery media
              </span>
              <span className="inline-flex items-center px-2 h-6 rounded-full bg-ink/[0.06] text-[10px] tracking-[0.2em] uppercase text-ink/60 font-mono">
                {media.length}
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {media.map((m) => (
                <div
                  key={m.id}
                  className="flex gap-2 items-center bg-paper-deep/30 border border-ink/8 rounded-xl p-2"
                >
                  {m.type === "video" ? (
                    <video src={m.url} className="w-16 h-11 object-cover bg-ink/10 rounded-lg" muted playsInline />
                  ) : (
                    <img src={m.url} alt="" className="w-16 h-11 object-cover bg-ink/10 rounded-lg" />
                  )}
                  <Input
                    defaultValue={m.caption ?? ""}
                    onBlur={(e) => e.target.value !== (m.caption ?? "") && updateCaption(m.id, e.target.value)}
                    placeholder="caption"
                    className="flex-1 h-9 text-[12.5px]"
                  />
                  <IconBtn tone="danger" onClick={() => removeMedia(m.id)} aria-label="Remove">
                    <Trash2 className="w-3.5 h-3.5" />
                  </IconBtn>
                </div>
              ))}
            </div>

            <div className="mt-2">
              <CloudinaryUploader
                folder="stories/media"
                label="Add gallery image / video"
                currentUrl={null}
                onUploaded={(a) =>
                  addMedia(a.url, a.public_id, a.resource_type === "video" ? "video" : "image")
                }
                compact
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
