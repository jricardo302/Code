import { isAangemeld } from "@/lib/beheer-auth";
import { csvBestandsnaam, naarCsv } from "@/lib/csv";
import { store } from "@/lib/store";

export async function GET() {
  if (!(await isAangemeld())) {
    return new Response("Niet ingelogd.", { status: 401 });
  }

  const aanvragen = await (await store()).lijst();

  return new Response(naarCsv(aanvragen), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${csvBestandsnaam()}"`,
      "Cache-Control": "no-store",
    },
  });
}
