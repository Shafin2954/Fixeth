import { Suspense } from "react";
import { LoginRegisterScreen } from "@/components/auth/login-register-screen";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <main
          className="flex min-h-screen items-center justify-center"
          style={{ backgroundColor: "#0B0B0F", color: "#8888A8" }}
        >
          Loading...
        </main>
      }
    >
      <LoginRegisterScreen initialMode="signup" />
    </Suspense>
  );
}
