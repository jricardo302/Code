/**
 * Admin authentication: Supabase Auth, single admin user.
 *
 * The session lives in Supabase's cookies (@supabase/ssr). A user counts as
 * the admin only when their e-mail equals ADMIN_EMAIL — a stray sign-up on
 * the same Supabase project gets a session but not this admin.
 *
 * Dev fallback: without Supabase configured (local hacking), a signed
 * cookie backed by ADMIN_DEV_PASSWORD takes over. It refuses to exist in
 * production builds.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const DEV_COOKIE = "lighthouse_admin_dev";

function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function devPassword(): string | null {
  if (process.env.NODE_ENV === "production") return null;
  return process.env.ADMIN_DEV_PASSWORD ?? null;
}

function devToken(password: string): string {
  return createHmac("sha256", password).update("lighthouse-admin").digest("hex");
}

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Components may not set cookies; the proxy refresh path does.
          }
        },
      },
    },
  );
}

/** The signed-in admin's e-mail, or null. */
export async function currentAdmin(): Promise<string | null> {
  if (supabaseConfigured()) {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const email = data.user?.email?.toLowerCase() ?? null;
    const admin = process.env.ADMIN_EMAIL?.toLowerCase();
    return email && admin && email === admin ? email : null;
  }

  const password = devPassword();
  if (!password) return null;
  const cookieStore = await cookies();
  const cookie = cookieStore.get(DEV_COOKIE)?.value;
  if (!cookie) return null;
  const expected = devToken(password);
  if (cookie.length !== expected.length) return null;
  return timingSafeEqual(Buffer.from(cookie), Buffer.from(expected))
    ? "dev-admin@localhost"
    : null;
}

export interface SignInResult {
  ok: boolean;
  error?: string;
}

export async function signInAdmin(email: string, password: string): Promise<SignInResult> {
  if (supabaseConfigured()) {
    const admin = process.env.ADMIN_EMAIL?.toLowerCase();
    if (!admin || email.toLowerCase() !== admin) {
      return { ok: false, error: "invalid credentials" };
    }
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { ok: false, error: "invalid credentials" } : { ok: true };
  }

  const expected = devPassword();
  if (!expected) return { ok: false, error: "auth not configured" };
  if (
    password.length !== expected.length ||
    !timingSafeEqual(Buffer.from(password), Buffer.from(expected))
  ) {
    return { ok: false, error: "invalid credentials" };
  }
  const cookieStore = await cookies();
  cookieStore.set(DEV_COOKIE, devToken(expected), {
    httpOnly: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });
  return { ok: true };
}

export async function signOutAdmin(): Promise<void> {
  if (supabaseConfigured()) {
    const supabase = await getSupabaseServerClient();
    await supabase.auth.signOut();
    return;
  }
  const cookieStore = await cookies();
  cookieStore.delete(DEV_COOKIE);
}
