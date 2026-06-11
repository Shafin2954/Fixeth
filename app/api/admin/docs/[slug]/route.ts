import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isPlatformAdmin } from "@/lib/supabase/admin";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Get the user from the request (using the supabase client for auth)
    const supabase = await createClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if the user is a platform admin
    // Use the same type of client used for auth to check user role
    const authSupabase = await createClient();
    const isAdmin = await isPlatformAdmin(authSupabase, user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { data: null, error: "Forbidden: insufficient permissions" },
        { status: 403 }
      );
    }

    const { slug } = await params;
    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { data: null, error: "Invalid slug" },
        { status: 400 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { title, content_md, published } = body;

    // Validate input
    if (typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { data: null, error: "Title must be a non-empty string." },
        { status: 400 }
      );
    }
    if (typeof content_md !== "string") {
      return NextResponse.json(
        { data: null, error: "Content must be a string." },
        { status: 400 }
      );
    }
    if (typeof published !== "boolean") {
      return NextResponse.json(
        { data: null, error: "Published must be a boolean." },
        { status: 400 }
      );
    }

    // Upsert the docs_content row so admins can create `/docs` pages from the panel.
    const adminSupabase = createAdminClient();
    const { data: updateData, error } = await adminSupabase
      .from("docs_content")
      .upsert(
        {
          slug,
          title,
          content_md,
          published,
          updated_by: user.email,
          updated_at: new Date().toISOString()
        },
        { onConflict: "slug" }
      )
      .select("slug");

    if (error) {
      throw error;
    }

    // Check if any rows were affected (update succeeded)
    // Asserting type to work around potential typing issues with admin client
    const dataArray = updateData as unknown as any[];
    if (!dataArray || dataArray.length === 0) {
      return NextResponse.json(
        { data: null, error: "Document not found" },
        { status: 404 }
      );
    }

    // Write to admin_audit
    await adminSupabase.from("admin_audit").insert({
      action: "doc_updated",
      details: { slug, title: title.substring(0, 20) + "...", updated_by: user.email },
      actor: user.email
    });

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (error) {
    console.error("[API Admin Docs] Error:", error);
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
