"use client";

import CertificatesScreen from "@/components/screens/Certificates";
import { useAppTheme } from "@/components/providers/app-theme-provider";

export default function CertificatesPage() {
  const { T, t, lang, user } = useAppTheme();
  return <CertificatesScreen T={T} t={t} lang={lang} user={user} />;
}
