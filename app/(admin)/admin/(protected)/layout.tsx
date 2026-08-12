import Link from "next/link";
import { redirect } from "next/navigation";
import { currentAdmin, signOutAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Kalender" },
  { href: "/admin/boekingen", label: "Boekingen" },
  { href: "/admin/seizoenen", label: "Seizoenen" },
  { href: "/admin/blokkades", label: "Blokkades" },
  { href: "/admin/feeds", label: "iCal-feeds" },
] as const;

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  async function logout(): Promise<void> {
    "use server";
    await signOutAdmin();
    redirect("/admin/login");
  }

  return (
    <div className="min-h-svh">
      <header className="border-b border-navy/10 bg-navy text-sand">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <span className="font-[family-name:var(--font-display)] font-semibold">
            Lighthouse — beheer
          </span>
          <nav className="flex flex-wrap gap-4 text-sm">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} className="text-sand/85 hover:text-turquoise">
                {label}
              </Link>
            ))}
            <a href="/admin/export/boekingen.csv" className="text-sand/85 hover:text-turquoise">
              CSV-export
            </a>
          </nav>
          <form action={logout}>
            <button type="submit" className="text-sm text-sand/60 hover:text-terracotta">
              Uitloggen ({admin})
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
