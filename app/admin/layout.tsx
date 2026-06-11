import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const { data: profile, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile || profile.role !== "platform_admin") {
    return redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200">
      <nav className="border-b border-gray-800 bg-[#010409]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-black text-white">
            <ShieldCheck size={16} className="text-[#00C896]" />
            Admin Panel
          </div>
          <div className="flex-1" />
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white"
          >
            <ArrowLeft size={13} />
            Back to app
          </Link>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
