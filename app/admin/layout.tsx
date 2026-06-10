import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, redirect to login
  if (!user) {
    return redirect("/login");
  }

  // Check if the user is a platform admin
  const { data: profile, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile || profile.role !== "platform_admin") {
    return redirect("/dashboard");
  }

  // If the user is a platform admin, render the admin page
  return (
    <div>
      <nav style={{ background: "#000", padding: "1rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#fff" }}>
              Admin Panel
            </div>
          </div>
        </div>
      </nav>
      <main style={{ padding: "2rem" }}>{children}</main>
    </div>
  );
}
