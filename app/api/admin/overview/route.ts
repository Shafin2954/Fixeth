import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isPlatformAdmin } from "@/lib/supabase/admin";

type ApiKeySlot = {
  slot: number;
  key: string;
  status: "active" | "limit_used" | "empty";
};

type DocsContentRow = {
  slug: string;
  title: string;
  content_md: string;
  published: boolean;
};

const MAIN_DOC_STARTER = `# Fixeth Docs

Edit this markdown from the admin panel. Saving this document updates the public /docs page.
`;

function maskKey(key: string) {
  if (!key) return "";
  return key.length <= 8 ? `${key.slice(0, 4)}...` : `${key.slice(0, 4)}...${key.slice(-4)}`;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await isPlatformAdmin(supabase, user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { data: null, error: "Forbidden: insufficient permissions" },
        { status: 403 }
      );
    }

    const [docsResult, keysResult, logsResult] = await Promise.all([
      supabase
        .from("docs_content")
        .select("slug, title, content_md, published")
        .order("slug"),
      supabase
        .from("admin_config")
        .select("value")
        .eq("key", "api_keys")
        .maybeSingle(),
      supabase
        .from("admin_audit")
        .select("action, details, actor, created_at")
        .order("created_at", { ascending: false })
        .limit(100)
    ]);

    if (docsResult.error) throw docsResult.error;
    if (keysResult.error) throw keysResult.error;
    if (logsResult.error) throw logsResult.error;

    const slots =
      (keysResult.data?.value as { slots?: ApiKeySlot[] } | null)?.slots ?? [];

    const docs = ((docsResult.data ?? []) as DocsContentRow[]).slice();
    if (!docs.some((doc) => doc.slug === "main")) {
      docs.unshift({
        slug: "main",
        title: "Fixeth Docs",
        content_md: MAIN_DOC_STARTER,
        published: true
      });
    }

    return NextResponse.json({
      data: {
        docs,
        apiKeys: slots.map((slot) => ({
          slot: slot.slot,
          key: maskKey(slot.key),
          status: slot.status
        })),
        auditLogs: logsResult.data ?? []
      },
      error: null
    });
  } catch (error) {
    console.error("[API Admin Overview] Error:", error);
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
