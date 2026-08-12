"use server";

import { revalidatePath } from "next/cache";

import { beheerIsIngesteld, meldAan, meldAf } from "@/lib/beheer-auth";

export type LoginStatus = { fout?: string };

export async function logIn(
  _vorige: LoginStatus,
  formData: FormData,
): Promise<LoginStatus> {
  if (!beheerIsIngesteld()) {
    return {
      fout:
        "Er is nog geen BEHEER_WACHTWOORD ingesteld. Zet die env-variabele en start opnieuw op.",
    };
  }

  const ingevoerd = formData.get("wachtwoord");
  if (typeof ingevoerd !== "string" || ingevoerd.length === 0) {
    return { fout: "Vul het wachtwoord in." };
  }

  // Kleine vertraging: maakt blind proberen een stuk minder aantrekkelijk.
  await new Promise((klaar) => setTimeout(klaar, 400));

  if (!(await meldAan(ingevoerd))) {
    return { fout: "Dat wachtwoord klopt niet." };
  }

  revalidatePath("/beheer");
  return {};
}

export async function logUit(): Promise<void> {
  await meldAf();
  revalidatePath("/beheer");
}
