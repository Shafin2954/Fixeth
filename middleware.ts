import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const supabaseKey = () =>
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAuthRoute = path === "/login" || path === "/signup";
  const isAuthCallback = path.startsWith("/auth/callback");
  const isPublicRoute =
    path.startsWith("/profile/") || path.startsWith("/verify/");
  const isOnboarding = path === "/onboarding";
  // App routes that require auth — excludes /onboarding (handled separately)
  const isProtectedApp =
    !isAuthRoute &&
    !isAuthCallback &&
    !isPublicRoute &&
    !isOnboarding &&
    path !== "/" &&
    !path.startsWith("/_next");

  if (!user && (isProtectedApp || isOnboarding)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && (isAuthRoute || isProtectedApp || isOnboarding)) {
    const { data: profile } = await supabase
      .from("users")
      .select("onboarding_complete")
      .eq("id", user.id)
      .maybeSingle();

    const onboardingComplete = profile?.onboarding_complete === true;

    if (user && isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = onboardingComplete ? "/dashboard" : "/onboarding";
      return NextResponse.redirect(url);
    }

    if (!onboardingComplete && isProtectedApp) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }

    if (onboardingComplete && isOnboarding) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
