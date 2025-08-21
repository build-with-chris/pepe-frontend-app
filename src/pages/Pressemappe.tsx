import { Fragment, useState } from "react";
import { BadgeCheck, Calendar, Copy, Star, Building2, Mail, Phone, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Pressemappe – PepeShows
 * Stil: dunkler Pepe‑Look, klare Blöcke, flexibel kopierbare Textbausteine
 * Hinweis: Schrift bevorzugt Futura; Fallback Nunito Sans.
 */

const wrapperStyle: React.CSSProperties = {
  fontFamily: 'Futura, "Nunito Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
};

function Section({ title, children, subtitle }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="bg-black py-12 md:py-16">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-white">
            <Sparkles className="h-5 w-5" />
            <span className="text-lg font-bold">{title}</span>
          </div>
          {subtitle ? <p className="mx-auto max-w-3xl text-gray-300">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-gray-800 bg-[#0b0b0b] p-6">{children}</div>;
}

function Block({
  headline,
  text,
  collapsible = false,
  previewChars = 300,
}: {
  headline: string;
  text: string;
  collapsible?: boolean;
  previewChars?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const needsClamp = collapsible && text.length > previewChars;
  const displayText = expanded || !needsClamp ? text : (text.slice(0, previewChars).trimEnd() + "…");

  return (
    <Card>
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-white text-2xl font-semibold">{headline}</h3>
      </div>
      <p className="text-gray-200 whitespace-pre-line">{displayText}</p>
      {needsClamp && (
        <div className="mt-3">
          <Button size="sm" className="rounded-full" variant="secondary" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Weniger lesen" : "Mehr lesen"}
          </Button>
        </div>
      )}
    </Card>
  );
}

export default function Pressemappe() {
  return (
    <Fragment>
      {/* Hero */}
      <section className="bg-black py-16 md:py-24" style={wrapperStyle}>
        <div className="container mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-gray-800 inline-flex items-center gap-2 rounded-md py-2 pl-4 pr-3">
              <BadgeCheck className="h-6 w-6 stroke-white" />
              <span className="text-white text-lg font-bold">Pressemappe</span>
            </div>
            <h1 className="text-white mt-6 text-5xl font-semibold leading-tight md:text-6xl">PepeShows – Pressetexte &amp; Infos</h1>
            <p className="text-gray-300 mt-4 text-lg md:text-xl">
              Artistik auf Weltklasse‑Niveau – modern, energetisch und perfekt organisiert. Wir verwandeln Events in magische Erlebnisse.
              Alle Texte unten sind als Bausteine gedacht und können frei kombiniert werden.
            </p>
          </div>
        </div>
      </section>

      {/* Teaser / Elevator / About */}
      <Section
        title="Texte – kurz, mittel, ausführlich"
        subtitle="Flexibel einsetzbar für Website, Bookings, Programmhefte & Presse."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Block
            headline="Teaser"
            text={`PepeShows steht für Artistik auf Weltklasse‑Niveau – modern, energetisch und perfekt organisiert. Ob Gala, Corporate Event oder Festival: Unsere Shows verwandeln Räume in magische Erlebnisse. Von Weltmeistern bis hin zu preisgekrönten Talenten – das Pepe Collective vereint die Besten. Kunst wird zu Magie, und für einen Moment verschwindet der Alltag.`}
          />
          <Block
            headline="Elevator Pitch"
            text={`Seit 2006 steht das Pepe Collective für Artistik, die begeistert. Mit PepeShows haben sich zwei Freunde zusammengetan, um ihr Können auf die Bühne von Unternehmen zu bringen – professionell, unkompliziert und überragend.\n\nUnsere Künstler gehören zur Weltspitze: Cyr‑Wheel‑Weltmeisterin, siebenfacher Jonglage‑Weltmeister, BC One Champion im Breakdance und viele weitere Ausnahmetalente. Gemeinsam schaffen wir Shows, die Emotion und Präzision verbinden.\n\nOb Solo‑Highlight nach dem Dinner, 45‑minütige Duo‑Show oder ein abendfüllendes Varieté wie zuletzt in Gütersloh: Wir inszenieren Events, die bleiben. Für Marken wie Porsche, Google, McDonald’s, AstraZeneca und Festivals wie Tollwood haben wir bereits Magie auf die Bühne gebracht.\n\nPepeShows macht Artistik greifbar – und lässt das Publikum gleichzeitig träumen.`}
            collapsible
            previewChars={420}
          />
          <Block
            headline="About"
            text={`PepeShows – wo Artistik zu Magie wird.\n\nDas Pepe Collective ist seit 2006 ein Synonym für artistische Spitzenklasse. Mit PepeShows bündeln Christoph Hermann und sein Team ihre jahrzehntelange Erfahrung, um maßgeschneiderte Show‑Konzepte für Unternehmen und Events jeder Größenordnung zu entwickeln.\n\nUnsere Philosophie: professionell, unkompliziert, überragend. Wir glauben daran, dass Artistik mehr ist als Akrobatik. Sie berührt, inspiriert und eröffnet einen Blick in eine andere Welt. Für einen Moment verschwindet das Alltägliche, und Kunst wird zu Magie.\n\nHinter PepeShows stehen Weltmeister und preisgekrönte Performer: eine Cyr‑Wheel‑Weltmeisterin, ein siebenfacher Jonglage‑Weltmeister, ein BC One Champion im Breakdance – sowie zahlreiche weitere internationale Künstler. Gemeinsam gestalten wir einzigartige Shows, die Energie, Eleganz und Präzision vereinen.\n\nUnser Repertoire reicht von kurzen Solo‑Acts über dynamische 45‑minütige Duo‑Shows bis hin zu abendfüllenden Varietéprogrammen (u. a. 5‑stündiges Varieté für die Stadt Gütersloh). Dabei ist alles möglich – vom Dinner‑Highlight bis zum Festivalauftritt, mit klarer Spezialisierung auf Corporate‑Events.\n\nFür Veranstalter halten wir Technik‑Pakete bereit – Sound, Licht und Rider sind flexibel: Der vollständige Technical Rider sowie Logos, Headerbilder, Pressefotos und Trailer finden sich im Mediamaterial. PepeShows macht Artistik greifbar – und lässt das Publikum gleichzeitig träumen.`}
            collapsible
            previewChars={420}
          />
        </div>
      </Section>

      {/* Angebote & Formate */}
      <Section
        title="Formate & Kombinationen"
        subtitle="Beispiele – flexibel kombinierbar und auf Corporate‑Events spezialisiert."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-white text-xl font-semibold mb-2">Solo‑Highlights</h3>
            <p className="text-gray-300">7–10 Minuten, ideal als prägnanter Programmpunkt – z. B. nach dem Dinner.</p>
          </Card>
          <Card>
            <h3 className="text-white text-xl font-semibold mb-2">Duo‑Show (45 Minuten)</h3>
            <p className="text-gray-300">Energiegeladenes Varieté mit rotem Faden – perfekt für Gala & Bühne.</p>
          </Card>
          <Card>
            <h3 className="text-white text-xl font-semibold mb-2">Abendfüllend</h3>
            <p className="text-gray-300">Modular und abwechslungsreiche Unterhaltung für 2 Stunden.</p>
          </Card>
        </div>
        <div className="mt-6 rounded-2xl border border-gray-800 bg-[#0b0b0b] p-6">
          <p className="text-gray-200">
            Disziplinen (Auswahl): Cyr‑Wheel, Jonglage, Luftakrobatik, Akrobatik, Feuershow, Chinesische Pole, Zauberei, Walking Acts – jeweils mit
            ausgewiesenen Profis (u. a. Weltmeister:innen und internationale Champions).
          </p>
        </div>
      </Section>

      {/* Zielgruppen & Referenzen */}
      <Section title="Zielgruppen & Referenzen" subtitle="B2B‑Fokus – Corporate, Gala, Messe; zugleich publikumsstark für Festivals & Theater.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-white text-xl font-semibold mb-3 flex items-center gap-2"><Building2 className="h-5 w-5" /> Zielgruppen</h3>
            <ul className="text-gray-200 list-disc pl-5 space-y-2">
              <li>B2B/Coporate (Schwerpunkt), Gala, Messe, Eröffnungen</li>
              <li>Stadtfeste/Streetshows, Festivals, Theater</li>
              <li>Publikum: für alle Altersgruppen geeignet</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-white text-xl font-semibold mb-3 flex items-center gap-2"><Star className="h-5 w-5" /> Referenzen (Auswahl)</h3>
            <ul className="text-gray-200 list-disc pl-5 space-y-2">
              <li>Porsche, Google, McDonald’s, AstraZeneca</li>
              <li>Tollwood Festival</li>
              <li>Stadt Gütersloh (abendfüllendes Varieté)</li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* Technik & Logistik */}
      <Section title="Technik & Logistik" subtitle="Kurzfassung – vollständige Details im Mediamaterial/Technical Rider.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-white text-xl font-semibold mb-2">Rider & Ausstattung</h3>
            <ul className="text-gray-200 list-disc pl-5 space-y-2">
              <li>Technical Rider im Mediamaterial verfügbar</li>
              <li>Sound &amp; Licht optional zubuchbar – nutzen auf Wunsch auch die Technik vor Ort</li>
              <li>Musiklieferung 1 Woche vorab als MP3, zusätzlich auf USB‑Stick vor Ort</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-white text-xl font-semibold mb-2">Flexibilität</h3>
            <ul className="text-gray-200 list-disc pl-5 space-y-2">
              <li>Corporate‑Spezialisierung, individuelle Inszenierungen</li>
              <li>Kombination mehrerer Disziplinen und Showmodule möglich</li>
              {/* <li>Preisrange über Booking‑Assistent ermittelbar</li> */}
            </ul>
          </Card>
        </div>
      </Section>

      {/* Kontakt */}
      <Section title="Kontakt & Buchung">
        <div className="mx-auto max-w-xl">
          <Card>
            <div className="space-y-2 text-gray-200">
              <p className="text-white text-2xl font-semibold mb-2">PepeShows – Christoph Hermann</p>
              <p className="flex items-center gap-2"><Mail className="h-5 w-5" /> chris@pepearts.de</p>
              <p className="flex items-center gap-2"><Phone className="h-5 w-5" /> +49 159 04891419</p>
              <p className="flex items-center gap-2"><Globe className="h-5 w-5" /> pepeshows.de</p>
            </div>
          </Card>
        </div>
      </Section>

      {/* Hinweis Sprache/Region */}
      <section className="bg-black pb-20" style={wrapperStyle}>
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-2xl border border-gray-800 bg-[#0b0b0b] p-6 text-center text-gray-300">
            Pressemappe verfügbar in <strong>Deutsch &amp; Englisch</strong>. Einsatzgebiet: flexibel (Künstler europaweit verteilt).
            Preise &amp; Verfügbarkeiten: einfach über den Booking‑Assistenten anfragen.
          </div>
        </div>
      </section>
    </Fragment>
  );
}
