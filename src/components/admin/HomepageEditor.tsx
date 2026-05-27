import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save } from "lucide-react";
import { Btn, Field, Input, Textarea, useToast } from "./ui";

type Row = {
  id: string;
  hero_tagline: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  instagram_url: string | null;
  vimeo_url: string | null;
  youtube_url: string | null;
};

export function HomepageEditor() {
  const [row, setRow] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => { if (data) setRow(data as Row); });
  }, []);

  const save = async () => {
    if (!row) return;
    if (!row.email?.trim() || !row.phone?.trim() || !row.location?.trim()) {
      setError("Email, phone and location are required.");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        hero_tagline: row.hero_tagline,
        phone: row.phone,
        email: row.email,
        location: row.location,
        instagram_url: row.instagram_url,
        vimeo_url: row.vimeo_url,
        youtube_url: row.youtube_url,
      })
      .eq("id", row.id);
    setSaving(false);
    toast({ tone: error ? "err" : "ok", text: error ? "Save failed" : "Homepage saved" });
  };

  if (!row) {
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
          Site settings
        </span>
        <Btn size="sm" onClick={save} loading={saving}>
          <Save className="w-3.5 h-3.5" /> Save
        </Btn>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto grid md:grid-cols-[1.2fr_0.8fr] gap-3">
      <div className="bg-paper-fold border border-ink/15 rounded-3xl p-5 md:p-6 space-y-4">
        {error && (
          <p className="rounded-2xl border border-ink/20 bg-paper px-4 py-3 text-[11px] tracking-[0.12em] uppercase text-ink/70 font-mono">
            {error}
          </p>
        )}
        <Field label="Hero tagline">
          <Textarea
            value={row.hero_tagline ?? ""}
            onChange={(e) => { setError(null); setRow({ ...row, hero_tagline: e.target.value }); }}
            rows={3}
            placeholder="A study in light, stillness…"
          />
        </Field>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Email">
            <Input required value={row.email ?? ""} onChange={(e) => { setError(null); setRow({ ...row, email: e.target.value }); }} placeholder="hello@…" />
          </Field>
          <Field label="Phone">
            <Input required value={row.phone ?? ""} onChange={(e) => { setError(null); setRow({ ...row, phone: e.target.value }); }} placeholder="+91 …" />
          </Field>
          <Field label="Location">
            <Input required value={row.location ?? ""} onChange={(e) => { setError(null); setRow({ ...row, location: e.target.value }); }} placeholder="Botad · Gujarat" />
          </Field>
        </div>
      </div>

      <div className="bg-paper border border-ink/15 rounded-3xl p-5 md:p-6 space-y-4">
        <p className="text-[10px] tracking-[0.28em] uppercase text-ink/45 font-mono">Social</p>
        <Field label="Instagram URL">
          <Input value={row.instagram_url ?? ""} onChange={(e) => setRow({ ...row, instagram_url: e.target.value })} placeholder="https://instagram.com/…" />
        </Field>
        <Field label="Vimeo URL">
          <Input value={row.vimeo_url ?? ""} onChange={(e) => setRow({ ...row, vimeo_url: e.target.value })} placeholder="https://vimeo.com/…" />
        </Field>
        <Field label="YouTube URL">
          <Input value={row.youtube_url ?? ""} onChange={(e) => setRow({ ...row, youtube_url: e.target.value })} placeholder="https://youtube.com/@…" />
        </Field>
      </div>
      </div>
    </div>
  );
}
