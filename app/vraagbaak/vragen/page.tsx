import type { Metadata } from "next";

import { Begrippenlijst } from "@/components/vraagbaak/Begrippenlijst";
import { Vragenlijst } from "@/components/vraagbaak/Vragenlijst";
import { LetOp, PaginaKop, Sectie, VerderLink } from "@/components/vraagbaak/ui";
import { VRAAG_ONTBREEKT } from "@/lib/vraagbaak/vragen";

export const metadata: Metadata = {
  title: "Vragen en begrippen",
  description:
    "De veelgestelde vragen van Ricardo Jeugdhulp en de volledige begrippenlijst, doorzoekbaar.",
};

export default function Vragen() {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-10 pb-4 sm:pt-14">
      <PaginaKop
        bovenkop="08 · Vraagbaak"
        titel="Vragen en begrippen"
        intro="De vragen die het vaakst gesteld worden, en alle afkortingen die je in dit werk tegenkomt."
      />

      <Sectie id="vragen" titel="Veelgestelde vragen">
        <Vragenlijst />
        <div className="mt-5">
          <LetOp>{VRAAG_ONTBREEKT}</LetOp>
        </div>
      </Sectie>

      <Sectie
        id="begrippen"
        titel="Begrippenlijst"
        intro="Een groen bolletje betekent: dit kom je in je eerste week al tegen."
      >
        <Begrippenlijst />
      </Sectie>

      <p className="py-6">
        <VerderLink href="/vraagbaak/quiz">
          Weet je het zeker? Doe de quiz
        </VerderLink>
      </p>
    </div>
  );
}
