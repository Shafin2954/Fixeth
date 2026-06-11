import { PublicPrefsProvider } from "@/components/public/public-lang";
import { PublicChrome } from "@/components/public/public-chrome";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicPrefsProvider>
      <PublicChrome>{children}</PublicChrome>
    </PublicPrefsProvider>
  );
}
