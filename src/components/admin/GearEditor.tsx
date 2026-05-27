import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Btn, IconBtn, Input, Select, useConfirm, useToast } from "./ui";

type Item = {
  id: string;
  name: string;
  category: string;
  spec: string | null;
  sort_order: number;
  published: boolean;
};

const CATEGORIES = [
  { value: "Camera", label: "Camera" },
  { value: "Lens", label: "Lens" },
  { value: "Lighting", label: "Lighting" },
  { value: "Grip", label: "Grip" },
  { value: "Audio", label: "Audio" },
  { value: "Other", label: "Other" },
];

export function GearEditor() {
  const [list, setList] = useState<Item[] | null>(null);
  const confirm = useConfirm();
  const toast = useToast();

  const load = async () => {
    const { data } = await supabase
      .from("gear")
      .select("*")
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });
    setList((data as Item[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    await supabase.from("gear").insert({
      name: "Untitled item",
      category: "Camera",
      spec: "",
      sort_order: (list?.length ?? 0) + 1,
      published: true,
    });
    toast({ tone: "ok", text: "Item added" });
    load();
  };

  const update = async (id: string, patch: Partial<Item>) => {
    if (typeof patch.name === "string" && !patch.name.trim()) {
      toast({ tone: "err", text: "Item name is required" });
      return;
    }
    await supabase.from("gear").update(patch).eq("id", id);
    load();
  };

  const remove = async (id: string, name: string) => {
    const ok = await confirm({
      title: "Delete gear item",
      message: `“${name}” will be removed from the kit list. This can't be undone.`,
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    await supabase.from("gear").delete().eq("id", id);
    toast({ tone: "ok", text: "Item deleted" });
    load();
  };

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
          {String(list.length).padStart(2, "0")} items
        </span>
        <Btn size="sm" onClick={create}><Plus className="w-3.5 h-3.5" /> New item</Btn>
      </div>

      <div className="flex-1 min-h-0 bg-paper-fold border border-ink/15 rounded-3xl flex flex-col overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 border-b border-ink/15 text-[10px] tracking-[0.22em] uppercase text-ink/40 font-mono shrink-0 bg-paper-deep/55">
          <span className="col-span-3">Category</span>
          <span className="col-span-3">Name</span>
          <span className="col-span-4">Spec</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-ink/10">
          {list.map((it) => (
            <div key={it.id} className="px-5 py-3 grid md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3">
                <Select
                  value={it.category}
                  onChange={(v) => update(it.id, { category: v })}
                  options={CATEGORIES}
                />
              </div>
              <div className="md:col-span-3">
                <Input
                  defaultValue={it.name}
                  required
                  onBlur={(e) => e.target.value !== it.name && update(it.id, { name: e.target.value.trim() })}
                  placeholder="Item name"
                />
              </div>
              <div className="md:col-span-4">
                <Input
                  defaultValue={it.spec ?? ""}
                  onBlur={(e) => (e.target.value !== (it.spec ?? "")) && update(it.id, { spec: e.target.value })}
                  placeholder="Spec / detail"
                />
              </div>
              <div className="md:col-span-2 flex items-center justify-end gap-1">
                <IconBtn onClick={() => update(it.id, { published: !it.published })} aria-label="Toggle publish">
                  <span className={`w-2 h-2 rounded-full ${it.published ? "bg-ink" : "bg-ink/30"}`} />
                </IconBtn>
                <IconBtn tone="danger" onClick={() => remove(it.id, it.name)} aria-label="Delete"><Trash2 className="w-3.5 h-3.5" /></IconBtn>
              </div>
            </div>
          ))}
          {list.length === 0 && (
            <div className="px-5 py-16 text-center text-ink/45 text-sm">
              Nothing yet. Click <span className="text-ink">New item</span> to start.
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 text-[10.5px] tracking-[0.05em] text-ink/40 shrink-0">
        Edits save on blur · Tab through fields to update inline.
      </p>
    </div>
  );
}
