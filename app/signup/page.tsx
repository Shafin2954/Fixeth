import { Suspense } from "react";
import { LoginRegisterScreen } from "@/components/auth/login-register-screen";
import LoadingCanvas from "@/components/ui/loading-canvas";

export default function SignupPage() {
  return (
    <Suspense
      fallback={<LoadingCanvas variant="auth" />}
    >
      <LoginRegisterScreen initialMode="signup" />
    </Suspense>
  );
}
