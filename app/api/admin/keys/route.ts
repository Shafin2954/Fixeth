import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isPlatformAdmin } from "@/lib/supabase/admin";

type ApiKeySlot = {
  slot: number;
  key: string;
  status: "active" | "limit_used" | "empty";
};

function resolveStoredKey(currentKey: string, submittedKey: string, status: ApiKeySlot["status"]) {
  const trimmed = submittedKey.trim();
  if (status === "empty") return "";
  if (!trimmed || trimmed.includes("...")) return currentKey;
  return trimmed;
}

export async function PATCH(req: Request) {
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
    const adminSupabase = createAdminClient();
    const isAdmin = await isPlatformAdmin(adminSupabase, user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { data: null, error: "Forbidden: insufficient permissions" },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const { slot, key, status } = body;

    // Validate input
    if (typeof slot !== "number" || slot < 1 || slot > 4) {
      return NextResponse.json(
        { data: null, error: "Invalid slot number. Must be between 1 and 4." },
        { status: 400 }
      );
    }
    if (typeof key !== "string") {
      return NextResponse.json(
        { data: null, error: "Key must be a string." },
        { status: 400 }
      );
    }
    if (!["active", "limit_used", "empty"].includes(status)) {
      return NextResponse.json(
        { data: null, error: "Invalid status. Must be 'active', 'limit_used', or 'empty'." },
        { status: 400 }
      );
    }

    // Enforce one active API key slot server-side
    if (status === "active") {
      // First, set all slots to non-active
      const { data: config, error: configError } = await adminSupabase
        .from("admin_config")
        .select("value")
        .eq("key", "api_keys")
        .single();

      if (configError) {
        throw configError;
      }

      const configValue = config.value as { slots: ApiKeySlot[] };
      const updatedSlots = configValue.slots.map((s) =>
        s.slot === slot
          ? { ...s, key: resolveStoredKey(s.key, key, "active"), status: "active" }
          : { ...s, status: s.status === "active" ? "empty" : s.status }
      );

      // Update the config
      const { error: updateError } = await adminSupabase
        .from("admin_config")
        .update({ value: { slots: updatedSlots }, updated_by: user.email })
        .eq("key", "api_keys");

      if (updateError) {
        throw updateError;
      }

      // Write to admin_audit
      await adminSupabase.from("admin_audit").insert({
        action: "key_activated",
        details: { slot, key: updatedSlots.find((s) => s.slot === slot)?.key.substring(0, 4) + "...", updated_by: user.email },
        actor: user.email
      });

      return NextResponse.json({ data: { success: true }, error: null });
    } else {
      // For limit_used or empty, just update the specific slot
      const { data: config, error: configError } = await adminSupabase
        .from("admin_config")
        .select("value")
        .eq("key", "api_keys")
        .single();

      if (configError) {
        throw configError;
      }

      const configValue = config.value as { slots: ApiKeySlot[] };
      const slotIndex = configValue.slots.findIndex((s) => s.slot === slot);
      if (slotIndex === -1) {
        return NextResponse.json(
          { data: null, error: "Slot not found" },
          { status: 400 }
        );
      }

      const updatedSlots = [...configValue.slots];
      updatedSlots[slotIndex] = {
        ...updatedSlots[slotIndex],
        key: resolveStoredKey(updatedSlots[slotIndex].key, key, status),
        status
      };

      // Update the config
      const { error: updateError } = await adminSupabase
        .from("admin_config")
        .update({ value: { slots: updatedSlots }, updated_by: user.email })
        .eq("key", "api_keys");

      if (updateError) {
        throw updateError;
      }

      // Write to admin_audit
      const action = status === "limit_used" ? "key_limit_used" : "key_saved";
      await adminSupabase.from("admin_audit").insert({
        action,
        details: { slot, key: updatedSlots[slotIndex].key.substring(0, 4) + "...", status, updated_by: user.email },
        actor: user.email
      });

      return NextResponse.json({ data: { success: true }, error: null });
    }
  } catch (error) {
    console.error("[API Admin Keys] Error:", error);
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
