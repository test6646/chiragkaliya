import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePublishedTable<T>(
  table: "stories" | "color_grades" | "gear",
  orderBy: string = "sort_order"
) {
  const [rows, setRows] = useState<T[] | null>(null);
  useEffect(() => {
    let alive = true;
    supabase
      .from(table)
      .select("*")
      .eq("published", true)
      .order(orderBy, { ascending: true })
      .then(({ data }) => {
        if (alive) setRows((data as T[]) ?? []);
      });
    return () => {
      alive = false;
    };
  }, [table, orderBy]);
  return rows;
}

export type SiteSettings = {
  hero_tagline: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  instagram_url: string | null;
  vimeo_url: string | null;
  youtube_url: string | null;
};

export function useSiteSettings() {
  const [s, setS] = useState<SiteSettings | null>(null);
  useEffect(() => {
    supabase
      .from("site_settings")
      .select("hero_tagline,phone,email,location,instagram_url,vimeo_url,youtube_url")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setS((data as SiteSettings) ?? null));
  }, []);
  return s;
}
