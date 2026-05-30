import { createClient } from "@/lib/supabase/client";

export type NotebookCell = {
  id: string;
  type: "code" | "markdown";
  content: string;
  output?: string;
  error?: boolean;
};

export type NotebookDoc = {
  id: string;
  title: string;
  cells: NotebookCell[];
  lesson_id?: string | null;
  updated_at?: string;
};

const LOCAL_KEY = "fixeth.notebooks";

function readLocal(): NotebookDoc[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLocal(docs: NotebookDoc[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(docs));
}

/**
 * List a user's notebooks. Tries the Supabase `notebooks` table first and
 * transparently falls back to localStorage when the table is absent or the
 * user is anonymous, so the lab always works in the showcase.
 */
export async function listNotebooks(userId?: string | null): Promise<NotebookDoc[]> {
  if (userId) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notebooks")
      .select("id,title,cells,lesson_id,updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (!error && data) return data as NotebookDoc[];
  }
  return readLocal();
}

/** Upsert a notebook to Supabase (when signed in) and mirror it locally. */
export async function saveNotebook(
  doc: NotebookDoc,
  userId?: string | null
): Promise<NotebookDoc> {
  const next: NotebookDoc = { ...doc, updated_at: new Date().toISOString() };

  // Always keep a local mirror so reloads are instant and offline-safe.
  const docs = readLocal();
  const idx = docs.findIndex((d) => d.id === next.id);
  if (idx >= 0) docs[idx] = next;
  else docs.unshift(next);
  writeLocal(docs);

  if (userId) {
    const supabase = createClient();
    await supabase.from("notebooks").upsert(
      {
        id: next.id,
        user_id: userId,
        title: next.title,
        cells: next.cells,
        lesson_id: next.lesson_id ?? null,
        updated_at: next.updated_at
      },
      { onConflict: "id" }
    );
  }
  return next;
}

export async function deleteNotebook(id: string, userId?: string | null): Promise<void> {
  writeLocal(readLocal().filter((d) => d.id !== id));
  if (userId) {
    const supabase = createClient();
    await supabase.from("notebooks").delete().eq("id", id).eq("user_id", userId);
  }
}
