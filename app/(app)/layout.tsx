import { AppAuthShell } from "@/components/providers/app-auth-shell";

export const dynamic = "force-dynamic";

export default function AppGroupLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AppAuthShell>{children}</AppAuthShell>;
}
