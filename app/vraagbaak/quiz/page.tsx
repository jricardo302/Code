import type { Metadata } from "next";

import { Quiz } from "@/components/vraagbaak/Quiz";
import { PaginaKop } from "@/components/vraagbaak/ui";

export const metadata: Metadata = {
  title: "Ken jij de vraagbaak?",
  description:
    "Tien vragen over de dingen waar je in de praktijk over struikelt: uren, verlengingstermijnen, datalekken en noodnummers.",
};

export default function QuizPagina() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-10 pb-4 sm:pt-14">
      <PaginaKop
        bovenkop="Even checken"
        titel="Ken jij de vraagbaak?"
        intro="Tien vragen over de dingen waar mensen in de praktijk over struikelen. Geen cijfer, geen registratie — bij elk antwoord staat waar het in de kennisbank staat."
      />
      <Quiz />
    </div>
  );
}
