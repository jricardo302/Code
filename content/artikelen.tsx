import Link from "next/link";
import type { ReactNode } from "react";

/**
 * De artikelen, als TSX in code in plaats van markdown met een parser ervoor.
 *
 * Het zijn er vijf, ze veranderen zelden, en zo controleert de compiler de
 * links en houdt de site één opmaakstijl. Worden het er ooit vijftig, dán is
 * het moment om MDX toe te voegen — niet nu voor vijf.
 *
 * Elk artikel mikt op één zoekterm uit docs/seo-plan.md en verwijst
 * uiteindelijk naar het spel, zonder dat het een advertentie wordt.
 */

export type Artikel = {
  slug: string;
  titel: string;
  /** De <title> mag afwijken van de H1: de één is voor Google, de ander voor de lezer. */
  metaTitel: string;
  beschrijving: string;
  datum: string; // ISO
  leestijd: string;
  onderwerp: string;
  zoekterm: string;
  inhoud: () => ReactNode;
};

/** Genummerde vragenlijst — het formaat dat in deze artikelen terugkomt. */
function Vragen({ items }: { items: [string, string][] }) {
  return (
    <ol className="not-prose my-8 space-y-6">
      {items.map(([vraag, uitleg], index) => (
        <li key={vraag} className="flex gap-5">
          <span className="w-8 shrink-0 font-merk text-lg font-black text-paars/60 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="font-merk font-black text-paars-diep">{vraag}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-inkt/75">
              {uitleg}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export const ARTIKELEN: Artikel[] = [
  // =========================================================================
  {
    slug: "25-intervisievragen-jeugdhulp",
    titel: "25 goede intervisievragen voor jeugdhulpprofessionals",
    metaTitel: "25 intervisievragen voor jeugdhulp — direct te gebruiken",
    beschrijving:
      "Vijfentwintig intervisievragen die je morgen kunt gebruiken, geordend van luchtig naar diep, met uitleg over wanneer je welke vraag stelt.",
    datum: "2026-08-07",
    leestijd: "7 minuten",
    onderwerp: "Intervisie",
    zoekterm: "intervisie vragen",
    inhoud: () => (
      <>
        <p>
          De meeste intervisies stranden niet op tijdgebrek of op onwil. Ze
          stranden op de vraag. Wie begint met &quot;wie heeft er een
          casus?&quot; krijgt een verhaal, en op een verhaal volgt bijna altijd
          een advies. Een goed geformuleerde vraag doet iets anders: die dwingt
          niemand tot een oplossing, maar zet wel iets in beweging.
        </p>
        <p>
          Hieronder vijfentwintig vragen, in drie oplopende lagen. Je hoeft ze
          niet op volgorde te gebruiken. Kies er één, en neem er de tijd voor.
        </p>

        <h2>Laag 1 — om te openen</h2>
        <p>
          Begin nooit koud met de moeilijkste vraag. Een groep die net binnen
          komt lopen heeft eerst een paar minuten nodig om van
          &quot;afspraak&quot; naar &quot;gesprek&quot; te schakelen. Deze
          vragen doen dat werk.
        </p>
        <Vragen
          items={[
            [
              "Waarom ben je ooit in dit vak terechtgekomen?",
              "Werkt bijna altijd, ook in een team dat elkaar al jaren kent. Mensen vertellen dingen die collega's nog nooit gehoord hadden.",
            ],
            [
              "Wat maakt een werkdag voor jou geslaagd?",
              "Legt bloot hoe verschillend mensen naar hetzelfde werk kijken. Voor de één is dat een afgeronde rapportage, voor de ander één goed gesprek.",
            ],
            [
              "Welke eigenschap helpt jou het meest in je werk?",
              "Positief geformuleerd, dus laagdrempelig — en het levert vaak meteen een aanknopingspunt op voor later in de sessie.",
            ],
            [
              "Wanneer heb je voor het laatst hard gelachen op je werk?",
              "Onderschat deze niet. Een groep die samen gelachen heeft, zegt daarna eerder iets moeilijks.",
            ],
            [
              "Van welke collega heb je het meeste geleerd?",
              "Bouwt aan het team zonder dat het een teambuildingoefening wordt.",
            ],
            [
              "Wat waardeer je in dit team dat je nooit hardop zegt?",
              "Kort, ongemakkelijk en verrassend effectief. Laat iedereen antwoorden.",
            ],
          ]}
        />

        <h2>Laag 2 — over de casus</h2>
        <p>
          Deze vragen werken het best als er een concrete, geanonimiseerde casus
          op tafel ligt. Ze verschuiven de aandacht van &quot;wat moet de cliënt
          anders doen&quot; naar &quot;wat zien wij eigenlijk&quot;.
        </p>
        <Vragen
          items={[
            [
              "Van wie is dit probleem eigenlijk?",
              "De kortste vraag met de meeste opbrengst. Vaak blijkt het probleem vooral van de professional of van de organisatie te zijn.",
            ],
            [
              "Wat zou de jongere zeggen dat het doel van deze hulp moet zijn?",
              "Stel deze vóór je naar het behandelplan kijkt. Het verschil tussen beide antwoorden is het gesprek.",
            ],
            [
              "Wat zou de ouder daarop antwoorden?",
              "En daarna: wat zegt het dat die twee antwoorden verschillen?",
            ],
            [
              "Welke aanname maak jij over dit gezin?",
              "Iedereen maakt aannames. De vraag is niet óf, maar welke — en of je ze getoetst hebt.",
            ],
            [
              "Wie wordt op dit moment onvoldoende gehoord?",
              "Systemisch kijken zonder dat je het woord systeem hoeft te gebruiken.",
            ],
            [
              "Wat gebeurt er als jij niets verandert aan je aanpak?",
              "Dwingt tot een voorspelling. Die voorspelling is vaak zelf al het antwoord.",
            ],
            [
              "Waar ben jij harder aan het werk dan het gezin?",
              "Een van de meest gestelde vragen in supervisie, en niet voor niets.",
            ],
            [
              "Welke informatie ontbreekt om een betere afweging te maken?",
              "Verplaatst het gesprek van meningen naar gaten in het beeld.",
            ],
            [
              "Wat is op dit moment goed genoeg?",
              "Tegengif tegen de neiging alles op te lossen. Vraag door op wat &apos;goed genoeg&apos; concreet betekent.",
            ],
            [
              "Welke kracht wordt hier nu onvoldoende gebruikt?",
              "Ombuiging naar wat er wél is, zonder dat het geforceerd positief wordt.",
            ],
            [
              "Wat zou je doen als je nog maar drie gesprekken had?",
              "Legt genadeloos bloot wat er echt toe doet in deze casus.",
            ],
            [
              "Welk doel zou je durven schrappen?",
              "Werkt goed in teams waar plannen historisch zijn gegroeid en niemand meer weet waarom.",
            ],
          ]}
        />

        <h2>Laag 3 — over jezelf</h2>
        <p>
          Dit is waar intervisie zich onderscheidt van casuïstiekbespreking. Twee
          voorwaarden: iedereen mag passen, en niemand geeft ongevraagd advies.
          Zonder die twee afspraken zou ik deze vragen niet stellen.
        </p>
        <Vragen
          items={[
            [
              "Wie roept iets in jou op dat meer over jou zegt dan over die ander?",
              "De kernvraag van tegenoverdracht, zonder het woord te gebruiken.",
            ],
            [
              "Wanneer voel jij de neiging om een gezin te redden?",
              "Bijna iedereen in dit vak herkent het. Weinig mensen benoemen het.",
            ],
            [
              "Bij welk type ouder merk je dat je sneller oordeelt?",
              "Stel deze pas als de veiligheid in de groep goed zit. Dan is hij goud waard.",
            ],
            [
              "Welke professionele fout heeft jou het meest geleerd?",
              "Laat een ervaren collega beginnen. Dat maakt het voor de rest mogelijk.",
            ],
            [
              "Wanneer voelde je je voor het laatst machteloos?",
              "Machteloosheid delen is geen zwakte tonen — het voorkomt dat mensen ermee blijven zitten.",
            ],
            [
              "Welke feedback over jouw manier van werken zou je het moeilijkst vinden om te horen?",
              "Confronterend, maar veilig: je zegt het zelf, niemand zegt het tegen je.",
            ],
            [
              "Wat houdt jou in dit vak, ook op de slechte dagen?",
              "Goede afsluiter. Laat iedereen antwoorden en stop daarna.",
            ],
          ]}
        />

        <h2>Hoe je ze inzet</h2>
        <p>
          Eén vraag per keer. Laat één persoon uitgebreid antwoorden en houd de
          rest even stil — dat is moeilijker dan het klinkt en het is precies wat
          het gesprek diep maakt. Pas als de inbrenger klaar is, stelt de groep
          verdiepende vragen. Advies alleen als er expliciet om gevraagd wordt.
        </p>
        <p>
          Sluit af met dezelfde vraag, elke keer:{" "}
          <em>wat zie je nu dat je aan het begin nog niet zag?</em> Twee minuten,
          iedereen één zin. Dat is het deel dat blijft hangen.
        </p>

        <h2>En de anderen?</h2>
        <p>
          Deze vijfentwintig komen uit{" "}
          <Link href="/intervisie">IK ZIE, IK ZIE… INTERVISIE</Link>, een set van
          honderd vraagkaarten in drie niveaus voor professionals in jeugdhulp,
          jeugd-GGZ en GGZ. Je hebt de kaarten niet nodig om deze vragen te
          stellen — maar het scheelt dat je niet elke keer hoeft te bedenken
          welke vraag er nu aan de beurt is.
        </p>
      </>
    ),
  },

  // =========================================================================
  {
    slug: "hoe-organiseer-je-goede-intervisie",
    titel: "Hoe organiseer je een goede intervisie?",
    metaTitel: "Goede intervisie organiseren: opzet, groep en structuur",
    beschrijving:
      "Van groepsgrootte tot gespreksleider, van frequentie tot afsluiting: hoe je intervisie opzet die niet als verplicht nummer voelt.",
    datum: "2026-08-07",
    leestijd: "8 minuten",
    onderwerp: "Intervisie",
    zoekterm: "intervisie organiseren",
    inhoud: () => (
      <>
        <p>
          Intervisie die werkt, ziet er saai uit van buiten. Een vaste groep, een
          vast moment, een vaste vorm. Geen bijzondere werkvormen, geen
          flip-overs. De energie zit in de gesprekken, niet in de organisatie
          eromheen — en dat is precies waarom de organisatie eromheen op orde
          moet zijn.
        </p>

        <h2>1. Houd de groep klein en vast</h2>
        <p>
          Drie tot zes deelnemers is het bereik waarin iedereen aan het woord
          komt zonder dat het gesprek uiteenvalt. Tot acht kan, daarboven wordt
          de wachttijd per persoon te lang en haken mensen af — niet omdat ze niet
          willen, maar omdat je na veertig minuten luisteren nu eenmaal minder
          scherp bent.
        </p>
        <p>
          Belangrijker nog: houd de groep <em>vast</em>. Een groep die elke keer
          anders is samengesteld begint elke keer opnieuw bij nul aan
          vertrouwen, en komt dus nooit voorbij de beleefde laag. Voor wie
          intervisie-uren wil laten meetellen voor herregistratie is een vaste
          kleine groep bovendien meestal een harde eis van het register — kijk
          altijd bij je eigen register wat er precies geldt.
        </p>

        <h2>2. Kies een vast moment en verzet het niet</h2>
        <p>
          Eén keer per maand anderhalf uur werkt beter dan &quot;als het
          uitkomt&quot;. Zet het in ieders agenda voor een heel jaar. De eerste
          keer dat je het verzet omdat het druk is, is de intervisie in de
          praktijk opgeheven — daarna is het namelijk altijd druk.
        </p>

        <h2>3. Spreek af hoe je het doet</h2>
        <p>
          Werk met één vaste structuur. Welke maakt minder uit dan dát je er één
          hebt. Bekende gestructureerde methoden zijn de incidentmethode, de
          vijfstappenmethode en de roddelmethode; registers die eisen stellen aan
          intervisie vragen doorgaans om zo&apos;n vaste methode. Een set
          vraagkaarten is geen methode, maar past er wel binnen: het levert de
          vragen, de methode levert de vorm.
        </p>

        <h2>4. Maak de afspraken hardop</h2>
        <p>
          Dit is het onderdeel dat het vaakst wordt overgeslagen en het meeste
          oplevert. Lees aan het begin van elke bijeenkomst de afspraken voor.
          Niet omdat mensen ze niet kennen, maar omdat het uitspreken ervan de
          ruimte maakt.
        </p>
        <ul>
          <li>Casuïstiek wordt geanonimiseerd besproken.</li>
          <li>Iedereen mag passen, zonder uitleg.</li>
          <li>We luisteren voordat we adviseren.</li>
          <li>We onderzoeken eerst, we lossen niet meteen op.</li>
          <li>Verschillende perspectieven mogen naast elkaar blijven staan.</li>
          <li>Wat hier gezegd wordt, blijft hier.</li>
          <li>
            Bij acute zorgen over veiligheid gelden de protocollen van de
            organisatie — altijd.
          </li>
        </ul>

        <h2>5. Wijs iemand aan die op de tijd let</h2>
        <p>
          Geen voorzitter met een agenda, wel iemand die zegt: we hebben nog tien
          minuten. Laat die rol rouleren. In een groep zonder tijdbewaker loopt de
          eerste casus uit en komt de tweede nooit aan bod — en dan zit er de
          volgende keer één iemand met minder zin.
        </p>

        <h2>6. Reserveer het laatste kwartier</h2>
        <p>
          Niet voor de rondvraag, maar voor de afsluiting. Eén vraag, iedereen
          één zin: <em>wat neem je mee?</em> Dit is waar de opbrengst zichtbaar
          wordt, ook voor mensen die die middag zelf geen casus inbrachten. Sla je
          dit over, dan voelt intervisie als iets wat je overkwam in plaats van
          iets waar je iets aan had.
        </p>

        <h2>7. Leg vast wat je meeneemt, niet wat er gezegd is</h2>
        <p>
          Geen notulen — dat is in strijd met de vertrouwelijkheid en niemand
          leest ze. Wel: laat iedereen voor zichzelf één zin opschrijven. Wie een
          leerverslag moet indienen voor herregistratie heeft daar aan het eind
          van het jaar meer aan dan aan twaalf verslagen van andermans casussen.
        </p>

        <h2>8. Evalueer twee keer per jaar, kort</h2>
        <p>
          Vijf minuten, twee vragen: waar hebben we het te weinig over gehad, en
          wat moeten we anders doen? Doe dit niet vaker — een groep die
          voortdurend over zichzelf praat, komt niet aan het werk toe.
        </p>

        <h2>Waar het meestal misgaat</h2>
        <p>
          Vier klassiekers: de groep wordt te groot, het moment wordt verzet, de
          afspraken worden verondersteld in plaats van uitgesproken, en er wordt
          geadviseerd waar onderzocht had moeten worden. Alle vier zijn ze
          oplosbaar met een agenda-afspraak en een voorgelezen kaartje.
        </p>
        <p>
          Zoek je concrete vragen om mee te beginnen? Er staan er{" "}
          <Link href="/blog/25-intervisievragen-jeugdhulp">
            vijfentwintig in dit artikel
          </Link>
          , en{" "}
          <Link href="/intervisie">IK ZIE, IK ZIE… INTERVISIE</Link> is de
          volledige set van honderd op kaart.
        </p>
      </>
    ),
  },

  // =========================================================================
  {
    slug: "van-advies-geven-naar-reflecteren",
    titel: "Intervisie in de jeugdhulp: van advies geven naar reflecteren",
    metaTitel: "Van advies geven naar reflecteren in de jeugdhulp",
    beschrijving:
      "Waarom de eerste reactie op een casus bijna altijd een advies is, wat dat kost, en hoe je het gesprek terugbrengt naar onderzoeken.",
    datum: "2026-08-07",
    leestijd: "6 minuten",
    onderwerp: "Reflectie",
    zoekterm: "intervisie jeugdhulp",
    inhoud: () => (
      <>
        <p>
          Let er eens op, de volgende keer. Iemand vertelt een casus. Er valt een
          stilte van ongeveer anderhalve seconde. En dan zegt iemand: &quot;heb
          je al geprobeerd om…&quot;
        </p>
        <p>
          Dat is geen slechte collega. Dat is een goede hulpverlener die doet
          waar hij op getraind is. Ons hele vak draait om vooruithelpen, en een
          vastgelopen verhaal roept in ons de behoefte op om iets te bieden.
          Alleen: in intervisie is dat precies de reflex die het gesprek
          afkapt.
        </p>

        <h2>Wat een advies doet met het gesprek</h2>
        <p>
          Zodra het eerste advies valt, verandert de rolverdeling. De inbrenger
          wordt iemand met een probleem, de rest wordt iemand met een oplossing.
          Vanaf dat moment gaat het gesprek over de vraag of het advies werkt —
          en niet meer over wat er in deze casus eigenlijk aan de hand is.
        </p>
        <p>Concreet levert dat drie dingen op:</p>
        <ul>
          <li>
            De inbrenger gaat verdedigen. &quot;Ja, dat hebben we geprobeerd,
            maar…&quot; Er ontstaat een lijstje van wat niet werkt in plaats van
            begrip van waarom het niet werkt.
          </li>
          <li>
            De stille collega&apos;s haken af. Wie de vierde is die iets wil
            zeggen, zwijgt — er liggen al drie oplossingen.
          </li>
          <li>
            De vraag achter de vraag komt nooit boven. En dat is meestal waar het
            om ging.
          </li>
        </ul>

        <h2>Reflecteren is niet zachter, het is preciezer</h2>
        <p>
          Er bestaat een misverstand dat reflectie de vriendelijke variant is van
          advies geven. Dat is het niet. &quot;Waar ben jij harder aan het werk
          dan het gezin?&quot; is een stuk ongemakkelijker dan &quot;probeer eens
          een netwerkberaad&quot;. Het verschil zit niet in de zachtheid maar in
          de richting: een advies gaat over wat de ander moet doen, een
          reflectievraag over wat jij ziet en niet ziet.
        </p>

        <h2>Drie verschuivingen die het gesprek veranderen</h2>

        <h3>Van de cliënt naar het systeem</h3>
        <p>
          &quot;Waarom werkt deze jongere niet mee?&quot; wordt &quot;wie wordt
          hier onvoldoende gehoord?&quot; De eerste vraag zoekt een verklaring in
          één persoon, de tweede kijkt naar wat er tussen mensen gebeurt. In een
          gezin waar zes instanties omheen staan is dat zelden dezelfde vraag.
        </p>

        <h3>Van het probleem naar de aanname</h3>
        <p>
          &quot;Wat is er mis?&quot; wordt &quot;welke aanname maak jij over dit
          gezin?&quot; Iedereen werkt met aannames — je kunt niet anders, je hebt
          nooit alle informatie. Maar een onbesproken aanname stuurt wel je hele
          plan.
        </p>

        <h3>Van de ander naar jezelf</h3>
        <p>
          &quot;Wat moet er gebeuren?&quot; wordt &quot;wat doet deze casus met
          jou?&quot; Dit is de moeilijkste verschuiving, en de enige die
          intervisie onderscheidt van een werkoverleg. Irritatie over een ouder,
          de neiging om te redden, de stille twijfel of je het wel goed doet —
          dat zit in de casus verwerkt, of je het erover hebt of niet.
        </p>

        <h2>Hoe je het praktisch afdwingt</h2>
        <p>
          Goede bedoelingen zijn niet genoeg; de reflex is sterker. Wat wel
          werkt:
        </p>
        <ul>
          <li>
            <strong>Spreek af dat advies op verzoek is.</strong> Niet: geen
            advies. Wel: alleen als de inbrenger erom vraagt. Dat is makkelijker
            vol te houden dan een verbod.
          </li>
          <li>
            <strong>Zet er een ronde tussen.</strong> Na het verhaal eerst één
            ronde waarin alleen open vragen gesteld mogen worden. Dat voelt de
            eerste keer onnatuurlijk en levert vanaf de tweede keer meer op dan
            de rest van het uur.
          </li>
          <li>
            <strong>Werk met een vraag die er al ligt.</strong> Een kaart of een
            lijstje neemt de druk weg om zelf de goede vraag te bedenken — en het
            is minder confronterend als de vraag van het kaartje komt dan van je
            collega.
          </li>
          <li>
            <strong>Laat de inbrenger zelf de stap formuleren.</strong> Niet de
            groep. Wie zijn eigen volgende stap bedenkt, doet die ook.
          </li>
        </ul>

        <h2>Wat het oplevert</h2>
        <p>
          Minder oplossingen per uur, en meer die daadwerkelijk worden
          uitgevoerd. Collega&apos;s die iets zeggen wat ze anders inslikken. En
          af en toe het moment waar het allemaal om draait: iemand die halverwege
          zijn eigen verhaal stopt en zegt dat hij het ineens anders ziet.
        </p>
        <p>
          <Link href="/intervisie">IK ZIE, IK ZIE… INTERVISIE</Link> is gebouwd
          rond precies die verschuiving: honderd vragen, in drie niveaus, van een
          luchtige opening tot de vraag die je liever overslaat.
        </p>
      </>
    ),
  },

  // =========================================================================
  {
    slug: "10-reflectievragen-vastgelopen-casus",
    titel: "10 reflectievragen voor een vastgelopen casus",
    metaTitel: "10 reflectievragen als een casus vastloopt",
    beschrijving:
      "Tien vragen die een vastgelopen casus weer in beweging brengen: via het systeem, de aannames en je eigen aandeel.",
    datum: "2026-08-07",
    leestijd: "5 minuten",
    onderwerp: "Casuïstiek",
    zoekterm: "reflectievragen zorg",
    inhoud: () => (
      <>
        <p>
          Een vastgelopen casus voelt van binnenuit als een gebrek aan opties. Van
          buitenaf is het meestal iets anders: het beeld van de situatie is
          vastgelopen, niet de situatie zelf. Deze tien vragen zijn bedoeld om dat
          beeld los te wrikken. Neem er één, niet alle tien.
        </p>

        <Vragen
          items={[
            [
              "Van wie is dit probleem eigenlijk?",
              "Begin hier. In vastgelopen casussen blijkt het probleem verrassend vaak vooral van de professional of de organisatie te zijn, en niet van het gezin.",
            ],
            [
              "Wat gebeurt er als jij niets verandert aan je aanpak?",
              "Dwingt tot een concrete voorspelling. Als het antwoord is dat het dan hetzelfde blijft, is dat op zichzelf informatie.",
            ],
            [
              "Waar ben jij harder aan het werk dan het gezin?",
              "Vastlopen en te hard trekken hangen bijna altijd samen. Wie harder gaat lopen dan de ander, sleept.",
            ],
            [
              "Welke aanname maak jij hier, en heb je die getoetst?",
              "Noem er hardop drie. Bij minstens één is het antwoord op het tweede deel nee.",
            ],
            [
              "Wie wordt op dit moment onvoldoende gehoord?",
              "Denk ook aan wie er niet in de vergadering zit: een broer of zus, een vader op afstand, een leerkracht.",
            ],
            [
              "Welke afwezige persoon speelt hier toch een grote rol?",
              "De sterkste systemische vraag die er is. In vastgelopen casussen zit het antwoord er bijna altijd.",
            ],
            [
              "Wat is hier al eerder geprobeerd, en wat leverde dat op?",
              "Niet: wat is er geprobeerd. Wél: wat leverde het op. Dat tweede deel is meestal nooit uitgevraagd.",
            ],
            [
              "Wat is op dit moment goed genoeg?",
              "Soms is de casus niet vastgelopen maar het doel te groot. Vraag door tot 'goed genoeg' een concrete beschrijving is.",
            ],
            [
              "Welke informatie ontbreekt om een betere afweging te maken?",
              "Verplaatst het gesprek van meningen naar gaten. Een gat kun je vullen; een mening niet.",
            ],
            [
              "Wat roept deze casus bij jou op?",
              "Stel deze als laatste, en alleen in een groep waar dat kan. Bij langdurig vastgelopen casussen is het antwoord vaak machteloosheid, irritatie of schaamte — en zolang dat onbesproken blijft, stuurt het je keuzes wel.",
            ],
          ]}
        />

        <h2>Hoe je ze gebruikt</h2>
        <p>
          Kies er één en blijf er tien minuten bij. De verleiding is groot om ze
          af te vinken, maar tien vragen oppervlakkig beantwoorden levert minder
          op dan één vraag die je echt uitdiept. Laat de inbrenger antwoorden en
          houd de rest van de groep bij open vragen — geen adviezen, tenzij erom
          gevraagd wordt.
        </p>
        <p>
          Sluit af met de vraag waar het om gaat:{" "}
          <em>wat zie je nu dat je aan het begin nog niet zag?</em> Als het
          antwoord &quot;niets&quot; is, is dat ook goed. Dan is het beeld niet
          vastgelopen en de situatie wel — en dat is een ander gesprek, dat
          waarschijnlijk niet in de intervisie thuishoort.
        </p>
        <p>
          Meer vragen van dit soort staan op de kaarten van{" "}
          <Link href="/intervisie">IK ZIE, IK ZIE… INTERVISIE</Link>, verdeeld
          over drie niveaus.
        </p>
      </>
    ),
  },

  // =========================================================================
  {
    slug: "casuistiek-bespreken-zonder-privacy-te-schenden",
    titel: "Hoe bespreek je casuïstiek zonder cliëntprivacy te schenden?",
    metaTitel:
      "Casuïstiek bespreken zonder de privacy van je cliënt te schenden",
    beschrijving:
      "Praktische regels voor anonimiseren in intervisie: wat je weglaat, wat je mag houden, en waarom een detail dat jij onschuldig vindt dat vaak niet is.",
    datum: "2026-08-07",
    leestijd: "7 minuten",
    onderwerp: "Zorgvuldig werken",
    zoekterm: "casuïstiek bespreken",
    inhoud: () => (
      <>
        <p>
          Iedereen weet dat je in intervisie geen namen noemt. En toch zit
          bijna iedereen wel eens in een bespreking waarin een collega denkt:
          hé, dat is die jongen van dat plein. Dat komt niet door de naam. Dat
          komt door de details.
        </p>

        <div className="not-prose my-8 rounded-2xl border-2 border-paars/30 bg-lila-bleek/50 p-6 text-sm leading-relaxed text-inkt/85">
          <strong className="font-semibold text-paars-diep">
            Vooraf, eerlijk:
          </strong>{" "}
          dit artikel is praktische hulp, geen juridisch advies. Het beleid, de
          verwerkersafspraken en de geheimhoudingsplicht van jouw organisatie
          gaan altijd voor. Twijfel je? Vraag het je functionaris
          gegevensbescherming.
        </div>

        <h2>Anonimiseren gaat niet over namen</h2>
        <p>
          Een gegeven is niet anoniem als je het niet kunt herleiden. Het is
          anoniem als <em>niemand</em> het kan herleiden — ook niet de collega
          die vorig jaar in dezelfde wijk werkte, en ook niet door twee
          onschuldige details te combineren.
        </p>
        <p>
          Dat laatste is de klassieke fout. Leeftijd is niet herleidbaar. Wijk is
          niet herleidbaar. Type school is niet herleidbaar. Maar &quot;een
          jongen van vijftien, praktijkonderwijs, uit die wijk, broer zit
          vast&quot; is dat wel, in een team dat in die regio werkt.
        </p>

        <h2>Wat je weglaat</h2>
        <ul>
          <li>
            Namen — van de cliënt, van gezinsleden, van de school, van de
            huisarts, van het gezinshuis.
          </li>
          <li>Geboortedata en exacte leeftijden. Zeg &quot;puber&quot;.</li>
          <li>Adressen, straten, wijken en dorpsnamen.</li>
          <li>Data van incidenten. Zeg &quot;afgelopen voorjaar&quot;.</li>
          <li>Dossiernummers, cliëntnummers en beschikkingsnummers.</li>
          <li>Nationaliteit, geloof of herkomst — tenzij het echt ter zake doet.</li>
          <li>
            Zeldzame kenmerken: een specifieke aandoening, een bijzondere
            gezinssamenstelling, een beroep waarvan er in de regio drie zijn.
          </li>
          <li>
            Alles wat in de krant heeft gestaan. Precies dat maakt een casus in
            één zin herkenbaar.
          </li>
        </ul>

        <h2>Wat je juist wél houdt</h2>
        <p>
          Overdrijven kan ook. Een casus die zo is uitgekleed dat er niets meer
          van over is, valt niet meer te bespreken — en dan is de intervisie
          alsnog zinloos. Deze dingen kunnen doorgaans blijven:
        </p>
        <ul>
          <li>De aard van de problematiek, in algemene termen.</li>
          <li>Wie er in het systeem betrokken zijn, in rollen: moeder, oom, mentor.</li>
          <li>Hoe lang de hulp al loopt, bij benadering.</li>
          <li>Welke instanties betrokken zijn, in soorten.</li>
          <li>Wat je hebt geprobeerd en wat dat opleverde.</li>
          <li>
            En het belangrijkste: <strong>wat het met jou doet</strong>. Dat is
            jouw informatie, niet die van de cliënt.
          </li>
        </ul>

        <h2>Vier praktische regels</h2>

        <h3>1. Bedenk vooraf wat je gaat vertellen</h3>
        <p>
          De meeste privacylekken in intervisie zijn improvisatiefouten: je bent
          aan het vertellen, iemand vraagt door, en voor je het weet noem je de
          school. Neem twee minuten om je casus in drie zinnen op te schrijven
          zonder herleidbare details. Wat je opgeschreven hebt, zeg je.
        </p>

        <h3>2. Schrijf niets mee</h3>
        <p>
          Geen notulen, geen aantekeningen met casusgegevens, geen foto van de
          flip-over in de groepsapp. Wat je wel opschrijft is wat jíj meeneemt —
          en dat gaat over jou, niet over de cliënt.
        </p>

        <h3>3. Kies de plek</h3>
        <p>
          Geen intervisie in een open kantoortuin, niet in de kantine, niet in de
          auto met de handsfree aan. Vanzelfsprekend, en toch gebeurt het.
        </p>

        <h3>4. Stel vragen die geen details nodig hebben</h3>
        <p>
          Dit is de elegantste oplossing. Vragen als{" "}
          <em>waar ben jij harder aan het werk dan het gezin</em>, of{" "}
          <em>welke aanname maak jij hier</em>, gaan over de professional en niet
          over de cliënt. Ze leveren een volwaardige intervisie op waarbij het
          overgrote deel van de casusdetails helemaal niet ter tafel hoeft te
          komen.
        </p>

        <h2>De grondslag: mag het eigenlijk?</h2>
        <p>
          Intercollegiale toetsing en intervisie horen bij verantwoorde
          beroepsuitoefening, en de norm van de verantwoorde werktoedeling gaat
          er expliciet van uit dat professionals volgens hun professionele
          standaard kunnen werken — reflectie hoort daarbij. Dat is geen vrijbrief
          om dossiergegevens rond te delen. De praktische lijn: hoe minder
          persoonsgegevens er nodig zijn om de vraag te bespreken, hoe beter. Wat
          je niet noemt, kan ook niet uitlekken.
        </p>

        <h2>Als het toch misgaat</h2>
        <p>
          Wordt een casus alsnog herkend, benoem dat dan meteen in de groep. Maak
          een afspraak over wat ermee gebeurt: niets, en niemand praat erover
          buiten deze ruimte. Gaat het verder dan dat — is er informatie bij
          iemand terechtgekomen die die niet mocht hebben — dan is dat een
          mogelijk datalek en volg je de meldprocedure van je organisatie.
        </p>
        <p>
          De veiligheidskaart van{" "}
          <Link href="/intervisie">IK ZIE, IK ZIE… INTERVISIE</Link> zit in de
          doos om precies deze afspraken aan het begin van elke sessie hardop te
          maken. Het kost dertig seconden en scheelt de rest van het uur veel
          gedoe.
        </p>
      </>
    ),
  },
];

export function artikelBijSlug(slug: string): Artikel | undefined {
  return ARTIKELEN.find((artikel) => artikel.slug === slug);
}
