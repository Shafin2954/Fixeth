import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_KEY } from "@/lib/supabase/config";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const next = searchParams.get("next") ?? "/dashboard";

  if (oauthError) {
    const login = new URL("/login", origin);
    login.searchParams.set("error", oauthError);
    return NextResponse.redirect(login);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const cookieStore = await cookies();
  const pendingCookies: {
    name: string;
    value: string;
    options?: Parameters<typeof NextResponse.prototype.cookies.set>[2];
  }[] = [];

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // Route handlers cannot always mutate cookieStore; copy to response below.
            }
            pendingCookies.push({ name, value, options });
          });
        }
      }
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[auth/callback] exchangeCodeForSession:", error.message);
    return NextResponse.redirect(`${origin}/login?error=exchange_failed`);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  let destination = next.startsWith("/") ? next : "/dashboard";
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("onboarding_complete")
      .eq("id", user.id)
      .maybeSingle();
    destination = profile?.onboarding_complete ? destination : "/onboarding";
  } else {
    destination = "/onboarding";
  }

  const response = NextResponse.redirect(`${origin}${destination}`);
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
