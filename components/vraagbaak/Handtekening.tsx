"use client";

import { useId, useState } from "react";

import { HANDTEKENING_VELDEN } from "@/lib/vraagbaak/huisstijl";

/**
 * Bouwt de vaste e-mailhandtekening op uit je naam en functie, zodat niemand
 * hem meer uit een oude mail hoeft over te tikken.
 */
export function Handtekening() {
  const [naam, zetNaam] = useState("");
  const [functie, zetFunctie] = useState("");
  const [mail, zetMail] = useState("");
  const [gekopieerd, zetGekopieerd] = useState(false);
  const idNaam = useId();
  const idFunctie = useId();
  const idMail = useId();

  const regels = [
    naam || "Voornaam Achternaam",
    functie || "Functie",
    HANDTEKENING_VELDEN.organisatie,
    HANDTEKENING_VELDEN.adres,
    HANDTEKENING_VELDEN.telefoon,
    `${mail || "naam@ricardojeugdhulp.nl"} · ${HANDTEKENING_VELDEN.website}`,
  ];

  async function kopieer() {
    try {
      await navigator.clipboard.writeText(regels.join("\n"));
      zetGekopieerd(true);
      window.setTimeout(() => zetGekopieerd(false), 2500);
    } catch {
      // Clipboard geweigerd (oudere browser of geen https): dan selecteer je
      // de tekst hiernaast met de hand.
      zetGekopieerd(false);
    }
  }

  const invoerKlassen =
    "mt-1.5 w-full rounded-xl border-2 border-rj-lijn bg-white px-4 py-2.5 text-rj-blauw outline-none transition-colors placeholder:text-rj-grijs/50 focus:border-rj-groen";
  const labelKlassen =
    "block text-sm font-extrabold tracking-wide text-rj-grijs uppercase";

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-4">
        <div>
          <label htmlFor={idNaam} className={labelKlassen}>
            Je naam
          </label>
          <input
            id={idNaam}
            value={naam}
            onChange={(e) => zetNaam(e.target.value)}
            placeholder="Voornaam Achternaam"
            className={invoerKlassen}
          />
        </div>
        <div>
          <label htmlFor={idFunctie} className={labelKlassen}>
            Je functie
          </label>
          <input
            id={idFunctie}
            value={functie}
            onChange={(e) => zetFunctie(e.target.value)}
            placeholder="Ambulant begeleider"
            className={invoerKlassen}
          />
        </div>
        <div>
          <label htmlFor={idMail} className={labelKlassen}>
            Je mailadres
          </label>
          <input
            id={idMail}
            value={mail}
            onChange={(e) => zetMail(e.target.value)}
            type="email"
            inputMode="email"
            placeholder="naam@ricardojeugdhulp.nl"
            className={invoerKlassen}
          />
        </div>
      </div>

      <div className="flex flex-col rounded-2xl border border-rj-lijn bg-white p-5">
        <p className="text-xs font-extrabold tracking-wide text-rj-grijs uppercase">
          Zo komt hij eruit te zien
        </p>
        <div className="mt-4 flex-1 border-l-4 border-rj-groen pl-4">
          <p className="font-extrabold text-rj-blauw">{regels[0]}</p>
          <p className="text-rj-grijs">{regels[1]}</p>
          <p className="mt-2 font-semibold text-rj-blauw">{regels[2]}</p>
          <p className="text-sm text-rj-grijs">{regels[3]}</p>
          <p className="text-sm text-rj-grijs">{regels[4]}</p>
          <p className="text-sm break-words text-rj-grijs">{regels[5]}</p>
        </div>
        <button
          type="button"
          onClick={kopieer}
          className="mt-5 rounded-full bg-rj-blauw px-4 py-2.5 text-sm font-extrabold text-white transition-colors hover:bg-rj-blauw/85"
        >
          {gekopieerd ? "Gekopieerd ✓" : "Kopieer de handtekening"}
        </button>
      </div>
    </div>
  );
}
