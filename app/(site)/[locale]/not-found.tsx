import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="mx-auto max-w-2xl px-4 py-32 text-center md:px-6">
      <h1 className="text-4xl">{t("title")}</h1>
      <p className="mt-4 text-lg text-ink/80">{t("text")}</p>
      <Link href="/" className="btn-primary mt-8 inline-flex">
        {t("backHome")}
      </Link>
    </div>
  );
}
