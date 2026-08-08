# Veelgestelde vragen

**De vragen en antwoorden staan in `lib/faq.ts`, niet hier.**

Dat is bewust. Die lijst voedt drie dingen tegelijk:

1. de pagina `/veelgestelde-vragen`;
2. de verkorte FAQ op de homepage;
3. de `FAQPage`-structured data die Google uitleest.

Zou de tekst hier óók staan, dan lopen de twee versies binnen een maand uit
elkaar — en dan staat er in de zoekresultaten iets anders dan op de site. Dat is
precies het soort fout dat Google wél ziet en jij niet.

## Wijzigen

Open `lib/faq.ts` en pas het `FAQ`-array aan. Elk item heeft drie velden:

```ts
{
  groep: "Bestellen en levering",   // wordt de tussenkop op de pagina
  vraag: "Kan ik retourneren?",
  antwoord: "Ja. Als consument heb je 14 dagen…",  // platte tekst
}
```

Het antwoord is **platte tekst zonder opmaak**. Dat is wat schema.org verwacht
en het houdt de twee weergaven identiek. Wil je ergens een link in, zet die dan
in de zichtbare pagina naast het antwoord — niet in het antwoordveld.

Een nieuwe `groep` toevoegen kan gewoon: `FAQ_GROEPEN` wordt afgeleid uit de
lijst, in volgorde van eerste voorkomen.

## De groepen op dit moment

| Groep | Aantal |
| --- | --- |
| Het spel | 6 |
| Zorgvuldig gebruik | 3 |
| Erkenning en registratie | 3 |
| Bestellen en levering | 6 |

## Waar de eerlijke nee's staan

Drie antwoorden in de groep *Erkenning en registratie* zijn het belangrijkst van
de hele site, en de verleiding om ze te verzachten is groot. Laat ze staan zoals
ze staan:

- **Is het SKJ-geaccrediteerd?** Nee. Er is geen accreditatie aangevraagd of
  verleend. Of jouw intervisie meetelt bepaalt SKJ.
- **Is het een officiële intervisiemethode?** Nee. Geen geregistreerde of
  erkende methodiek.
- **Is de werking wetenschappelijk aangetoond?** Nee, en dat beweren we ook niet.

Er staat nergens een getal over SKJ-eisen op de site. Die eisen worden
periodiek bijgesteld, en een getal dat volgend jaar verandert is een pagina die
dan fout staat. Zie `docs/research-intervisie.md` §3.
