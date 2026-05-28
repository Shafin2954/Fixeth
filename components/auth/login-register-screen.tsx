"use client";

import { createClient } from "@/lib/supabase/client";
import { themes } from "@/lib/ui/themes";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type AuthMode = "signin" | "signup";

const T = {
  ...themes.dark,
  accentTxt: "#000000",
  danger: themes.dark.red,
  dangerBg: themes.dark.redDim,
  warning: themes.dark.amber,
  info: themes.dark.blue,
  success: themes.dark.accent
};

const GoogleIcon = () => (
  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
    <path
      fill="currentColor"
      d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.001 12.001 0 0024 12c0-6.63-5.37-12-12-12z"
    />
  </svg>
);

function calculatePasswordStrength(pwd: string) {
  if (pwd.length < 8) return "weak" as const;
  if (pwd.length < 12) return "fair" as const;
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd))
    return "strong" as const;
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return "good" as const;
  return "fair" as const;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function LoginRegisterScreen({
  initialMode = "signin"
}: {
  initialMode?: AuthMode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(
    null
  );
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "fair" | "good" | "strong"
  >("weak");

  const urlAuthError = searchParams.get("error");
  const displayError = urlAuthError
    ? "Sign in failed. Please try again."
    : error;

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;

      const { data: profile } = await supabase
        .from("users")
        .select("onboarding_complete")
        .eq("id", session.user.id)
        .maybeSingle();

      router.replace(
        profile?.onboarding_complete ? "/dashboard" : "/onboarding"
      );
    });
  }, [router, supabase]);

  const redirectAfterAuth = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/onboarding");
      return;
    }
    const { data: profile } = await supabase
      .from("users")
      .select("onboarding_complete")
      .eq("id", user.id)
      .maybeSingle();
    router.replace(profile?.onboarding_complete ? "/dashboard" : "/onboarding");
  };

  const handleOAuth = (provider: "google" | "github") => async () => {
    setOauthLoading(provider);
    setError("");
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (oauthError) throw oauthError;
    } catch {
      setError("OAuth sign in failed. Please try again.");
      setOauthLoading(null);
    }
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError("");
    if (next === "signin") {
      setName("");
      setConfirmPassword("");
      router.replace("/login");
    } else {
      router.replace("/signup");
    }
  };

  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd);
    if (mode === "signup") {
      setPasswordStrength(calculatePasswordStrength(pwd));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your name");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        if (signUpError) throw signUpError;
      }
      await redirectAfterAuth();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Authentication failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = {
    weak: T.danger,
    fair: T.warning,
    good: T.info,
    strong: T.success
  };
  const strengthLabels = {
    weak: "Weak",
    fair: "Fair",
    good: "Good",
    strong: "Strong"
  };

  const oauthBusy = oauthLoading !== null;

  return (
    <div
      className="relative flex min-h-screen items-center justify-center px-4 transition-colors duration-300"
      style={{ backgroundColor: T.bg0 }}
    >
      <div
        className="absolute top-0 right-0 h-96 w-96 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: T.accent }}
      />
      <div
        className="absolute bottom-0 left-0 h-96 w-96 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: T.accent }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1
            className="mb-2 text-3xl font-bold transition-colors duration-300"
            style={{ color: T.txt0 }}
          >
            Fixeth
          </h1>
          <p className="text-sm" style={{ color: T.txt1 }}>
            {mode === "signin"
              ? "Welcome back. Continue your learning journey."
              : "Start learning today. Build your future."}
          </p>
        </div>

        <div
          className="rounded-2xl border p-8 shadow-xl backdrop-blur-sm transition-colors duration-300"
          style={{
            backgroundColor: T.bg1,
            borderColor: T.border
          }}
        >
          <div
            className="mb-6 flex gap-1 rounded-lg p-1"
            style={{ backgroundColor: T.bg0 }}
          >
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: mode === "signin" ? T.accent : "transparent",
                color: mode === "signin" ? T.accentTxt : T.txt1
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: mode === "signup" ? T.accent : "transparent",
                color: mode === "signup" ? T.accentTxt : T.txt1
              }}
            >
              Sign Up
            </button>
          </div>

          <div className="mb-6 space-y-3">
            <button
              type="button"
              onClick={handleOAuth("google")}
              disabled={oauthBusy || loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-60"
              style={{
                borderColor: T.border,
                backgroundColor: T.bg0,
                color: T.txt0
              }}
            >
              <GoogleIcon />
              {oauthLoading === "google"
                ? "Connecting..."
                : mode === "signin"
                  ? "Continue with Google"
                  : "Sign up with Google"}
            </button>
            <button
              type="button"
              onClick={handleOAuth("github")}
              disabled={oauthBusy || loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-60"
              style={{
                backgroundColor: T.bg3,
                color: T.txt0,
                border: `1px solid ${T.border}`
              }}
            >
              <GitHubIcon />
              {oauthLoading === "github"
                ? "Connecting..."
                : mode === "signin"
                  ? "Continue with GitHub"
                  : "Sign up with GitHub"}
            </button>
          </div>

          <div className="relative mb-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden
            >
              <div
                className="w-full border-t"
                style={{ borderColor: T.border }}
              />
            </div>
            <div className="relative flex justify-center text-xs">
              <span
                className="px-3 font-medium"
                style={{ backgroundColor: T.bg1, color: T.txt1 }}
              >
                or with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label
                  className="mb-2 block text-sm font-medium"
                  style={{ color: T.txt0 }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-lg border px-4 py-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00C896]/40"
                  style={{
                    backgroundColor: T.bg0,
                    borderColor: error && !name ? T.danger : T.border,
                    color: T.txt0
                  }}
                />
              </div>
            )}

            <div>
              <label
                className="mb-2 block text-sm font-medium"
                style={{ color: T.txt0 }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute top-3.5 left-3"
                  style={{ color: T.txt1 }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border py-3 pr-4 pl-10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00C896]/40"
                  style={{
                    backgroundColor: T.bg0,
                    borderColor:
                      error && !validateEmail(email) && email
                        ? T.danger
                        : T.border,
                    color: T.txt0
                  }}
                />
              </div>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium"
                style={{ color: T.txt0 }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute top-3.5 left-3"
                  style={{ color: T.txt1 }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-lg border py-3 pr-10 pl-10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00C896]/40"
                  style={{
                    backgroundColor: T.bg0,
                    borderColor:
                      error && password.length < 8 && password
                        ? T.danger
                        : T.border,
                    color: T.txt0
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3.5 right-3"
                  style={{ color: T.txt1 }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {mode === "signup" && password && (
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className="h-1.5 flex-1 overflow-hidden rounded-full"
                    style={{ backgroundColor: T.border }}
                  >
                    <div
                      className="h-full transition-all duration-200"
                      style={{
                        width:
                          passwordStrength === "weak"
                            ? "25%"
                            : passwordStrength === "fair"
                              ? "50%"
                              : passwordStrength === "good"
                                ? "75%"
                                : "100%",
                        backgroundColor: strengthColors[passwordStrength]
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: strengthColors[passwordStrength] }}
                  >
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
              )}
            </div>

            {mode === "signup" && (
              <div>
                <label
                  className="mb-2 block text-sm font-medium"
                  style={{ color: T.txt0 }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute top-3.5 left-3"
                    style={{ color: T.txt1 }}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full rounded-lg border py-3 pr-10 pl-10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00C896]/40"
                    style={{
                      backgroundColor: T.bg0,
                      borderColor:
                        error &&
                        confirmPassword &&
                        password !== confirmPassword
                          ? T.danger
                          : confirmPassword && password === confirmPassword
                            ? T.success
                            : T.border,
                      color: T.txt0
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-3.5 right-3"
                    style={{ color: T.txt1 }}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                  {confirmPassword && password === confirmPassword && (
                    <Check
                      size={18}
                      className="pointer-events-none absolute top-3.5 right-10"
                      style={{ color: T.success }}
                    />
                  )}
                </div>
              </div>
            )}

            {displayError && (
              <div
                className="rounded-lg border px-4 py-3 text-sm"
                style={{
                  backgroundColor: T.dangerBg,
                  borderColor: T.danger,
                  color: T.danger
                }}
              >
                {displayError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || oauthBusy}
              className="flex w-full items-center justify-center gap-2 rounded-lg py-3 font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-70"
              style={{
                backgroundColor: T.accent,
                color: T.accentTxt
              }}
            >
              {loading ? (
                <div
                  className="h-5 w-5 animate-spin rounded-full border-2 border-current border-opacity-30"
                  style={{ borderTopColor: "currentColor" }}
                />
              ) : (
                <>
                  {mode === "signin" ? "Sign In" : "Create Account"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p
            className="mt-6 text-center text-xs"
            style={{ color: T.txt1 }}
          >
            {mode === "signin" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="font-medium hover:underline"
                  style={{ color: T.accent }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="font-medium hover:underline"
                  style={{ color: T.accent }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
