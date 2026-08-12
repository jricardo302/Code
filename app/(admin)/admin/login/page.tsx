import { redirect } from "next/navigation";
import { currentAdmin, signInAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ fout?: string }>;
}) {
  if (await currentAdmin()) redirect("/admin");
  const { fout } = await searchParams;

  async function login(formData: FormData): Promise<void> {
    "use server";
    const result = await signInAdmin(
      String(formData.get("email") ?? ""),
      String(formData.get("password") ?? ""),
    );
    redirect(result.ok ? "/admin" : "/admin/login?fout=1");
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-sm flex-col justify-center px-4">
      <h1 className="text-3xl">Beheer</h1>
      <p className="mt-2 text-sm text-ink/70">Lighthouse Curaçao — alleen voor de eigenaar.</p>
      <form action={login} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-navy">E-mailadres</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            className="mt-1 w-full rounded-md border border-navy/20 bg-white px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-navy">Wachtwoord</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-md border border-navy/20 bg-white px-3 py-2"
          />
        </label>
        {fout ? (
          <p role="alert" className="text-sm text-terracotta">
            Onjuiste inloggegevens.
          </p>
        ) : null}
        <button type="submit" className="btn-primary w-full">
          Inloggen
        </button>
      </form>
    </main>
  );
}
