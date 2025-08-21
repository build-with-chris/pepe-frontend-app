

import { Fragment } from "react";

/**
 * Technical Rider – Pepe Shows
 * Stil: dunkler Hintergrund (Pepe-Style), klare Cards, responsives Grid
 */

type Detail = { label: string; value: string };

type Disziplin = {
  name: string;
  details: Detail[];
};

const RAW_DISZIPLINEN: Disziplin[] = [
  {
    name: "Akrobatik",
    details: [
      { label: "Fläche", value: "2 × 4,5 × 7 m (L/T/H); Bühne eben & trocken" },
      { label: "Dauer", value: "Probe: ca. 30 min · Show: ca. 7 min" },
      { label: "Musik", value: "Musikanlage erforderlich (MP3, Audio, USB)" },
      { label: "Sonstiges", value: "Je nach Wunsch" },
    ],
  },
  {
    name: "Chinesische Pole",
    details: [
      { label: "Fläche", value: "Bühne 5 × 7 × 6 m (B/L/H) oder rund Ø 8 m; Boden eben" },
      { label: "Rigging", value: "4 Ankerpunkte à 400 kg ODER 3 à 500 kg (guter Winkel)" },
      { label: "Aufbau", value: "3 Stagehands · 10 min Probe für Aufbau/Abbau · 5 min Aufbau · 5 min Abbau" },
      { label: "Sonstiges", value: "Aufhängepunkte & Sicherheitsmatte nach Bedarf" },
    ],
  },
  {
    name: "Cyr-Wheel",
    details: [
      { label: "Fläche", value: "6 × 6 × 3 m (L/T/H); eben & trocken; Boden darf nicht stark reiben (manche Teppiche ok)" },
      { label: "Dauer", value: "Probe: ca. 15 min · Show: ca. 7 min" },
      { label: "Musik", value: "Musikanlage erforderlich (MP3, Audio, USB)" },
    ],
  },
  {
    name: "Feuershow",
    details: [
      { label: "Fläche", value: "Outdoor; mind. 2 × 4,5 × 7 m (L/T/H)" },
      { label: "Dauer", value: "Vorbereitung: ca. 30 min · Show: ca. 7–45 min (programmabhängig)" },
      { label: "Musik", value: "Musikanlage erforderlich (MP3, Audio, USB)" },
    ],
  },
  {
    name: "Jonglage",
    details: [
      { label: "Fläche", value: "2 × 4,5 × 7 m (L/T/H); Bühne eben & trocken" },
      { label: "Dauer", value: "Probe: ca. 30 min · Show: ca. 7 min" },
      { label: "Musik", value: "Musikanlage erforderlich (MP3, Audio, USB)" },
    ],
  },
  {
    name: "Luftakrobatik",
    details: [
      { label: "Fläche", value: "2 × 4,5 × 7 m (L/T/H); Bühne eben & trocken" },
      { label: "Dauer", value: "Probe: ca. 30 min · Show: ca. 7 min" },
      { label: "Musik", value: "Musikanlage erforderlich (MP3, Audio, USB)" },
      { label: "Rigging", value: "2 Aufhängepunkte (Abstand 1,80 m, je ≥ 250 kg), 1 Punkt für Klettertuch ODER 1 Helfer vor Ort, 1 Sicherheitsmatte" },
      { label: "Outdoor-Option", value: "Eigene Vorrichtung für Außenbereich verfügbar (mobil, auf Bedürfnisse der Artisten abgestimmt)" },
    ],
  },
  {
    name: "Walking Act",
    details: [
      { label: "Fläche", value: "Keine spezifischen Anforderungen" },
      { label: "Dauer", value: "Individuell nach Absprache" },
      { label: "Musik", value: "Nach Bedarf; siehe Allgemeine Hinweise" },
    ],
  },
  {
    name: "Zauberei",
    details: [
      { label: "Fläche", value: "Bühne: Sichtschutz an den Seiten & hinten; Walking Act: keine" },
      { label: "Dauer", value: "Probe: ca. 30 min · Show: flexibel (Bühne oder direkt im Publikum)" },
      { label: "Musik", value: "Musikanlage erforderlich (MP3, Audio, USB)" },
      { label: "Licht", value: "Bitte vorab mit der Technik abstimmen" },
    ],
  },
];

// Alphabetisch sortiert, falls später erweitert wird
const DISZIPLINEN = [...RAW_DISZIPLINEN].sort((a, b) => a.name.localeCompare(b.name, "de"));

export default function TechnicalRider() {
  return (
    <Fragment>
      {/* Hero */}
      <section className="bg-black py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-gray-800 inline-flex items-center gap-2 rounded-md py-2 pl-4 pr-3">
              <span className="text-white text-lg font-bold">Technical Rider</span>
            </div>
            <h1 className="text-white mt-6 text-5xl font-semibold leading-tight md:text-6xl">
              Anforderungen & Bühnenhinweise
            </h1>
            <p className="text-gray-300 mt-4 text-lg md:text-xl">
              Sofern keine Musikanlage dazugebucht wird, setzen wir eine vor Ort voraus. Die Musik wird eine Woche
              vorher als <strong>MP3</strong> versendet und zur Sicherheit zusätzlich auf einem <strong>USB‑Stick</strong>
              mitgebracht. Die angegebenen Dauern beziehen sich auf <strong>Solo‑Acts</strong> und können bei mehreren
              Artisten variieren.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-black pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DISZIPLINEN.map((d) => (
              <article key={d.name} className="rounded-2xl border border-gray-800 bg-[#0b0b0b] p-6">
                <h3 className="text-white text-2xl font-semibold mb-4">{d.name}</h3>
                <dl className="space-y-3">
                  {d.details.map((detail, idx) => (
                    <div key={idx}>
                      <dt className="text-gray-400 text-sm font-medium uppercase tracking-wide">{detail.label}</dt>
                      <dd className="text-gray-200 text-base">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Fragment>
  );
}