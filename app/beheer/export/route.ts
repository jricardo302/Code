import { isAangemeld } from "@/lib/beheer-auth";
import { csvBestandsnaam, naarCsv } from "@/lib/csv";
import { SOORTEN, store, type Soort } from "@/lib/store";

/** Export van één soort inzending, of van alles. `?soort=offerte` bijvoorbeeld. */
export async function GET(request: Request) {
  if (!(await isAangemeld())) {
    return new Response("Niet ingelogd.", { status: 401 });
  }

  const gevraagd = new URL(request.url).searchParams.get("soort");
  const soort = SOORTEN.includes(gevraagd as Soort)
    ? (gevraagd as Soort)
    : undefined;

  const inzendingen = await (await store()).lijst(soort);

  return new Response(naarCsv(inzendingen), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${csvBestandsnaam(soort ?? "alles")}"`,
      "Cache-Control": "no-store",
    },
  });
}
