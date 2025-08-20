import { CircleArrowRight, Files, Settings } from "lucide-react";
import AboutImage1 from "/images/About1/About1.1.webp";
import AboutImage2 from "/images/About1/About1.2.webp";

const About1 = () => {
  return (
    <section className="py-32 bg-black text-white">
      <div className="container flex flex-col gap-28 px-4 sm:px-6 lg:px-0">
        <div className="flex flex-col gap-7">
          <h1 className="text-4xl font-semibold lg:text-5xl [text-wrap:balance]">
            Shows & Formate – klar geplant, stark gespielt
          </h1>
          <p className="max-w-2xl text-lg text-white/70">
            Von kurzem Show‑Highlight bis abendfüllendem Varieté: Wir liefern die passende Größe –
            inklusive Regie, Musik & Kostüm. Direkt buchbare Solo‑Acts oder individuell kuratierte Ensembles.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <img
            src={AboutImage1}
            alt="PepeShows Performance"
            className="size-full max-h-96 rounded-2xl object-cover"
          />
          <div className="flex flex-col justify-between gap-10 rounded-2xl bg-white/5 backdrop-blur-sm p-10">
            <p className="text-sm text-white/60 tracking-wide">UNSERE MISSION</p>
            <p className="text-lg font-medium text-white/90">
              Jede Veranstaltung ist einzigartig – und genau so gestalten wir auch unsere Konzepte. Unser Ziel: die passende Show zu Ihrem Anlass und ein magischer Augenblick, der in Erinnerung bleibt.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-6 md:gap-20">
          <div className="max-w-xl">
            <h2 className="mb-2.5 text-3xl font-semibold">
              So läuft’s mit Pepe – in 4 Schritten
            </h2>
            <p className="text-white/70">
              Transparent, schnell, professionell. Vom ersten Briefing bis zur Applaus‑Zugabe.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-4">
            <div className="flex flex-col">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-white/10">
                <span className="text-sm">1</span>
              </div>
              <h3 className="mt-2 mb-3 text-lg font-semibold">Briefing</h3>
              <p className="text-white/70">Booking‑Assistent (⏱️ ~5 Min). Anlass, Bühne, Budget – wir verstehen den Rahmen.</p>
            </div>
            <div className="flex flex-col">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-white/10">
                <span className="text-sm">2</span>
              </div>
              <h3 className="mt-2 mb-3 text-lg font-semibold">Kuratierung</h3>
              <p className="text-white/70">3 passende Vorschläge – oft in <span className="whitespace-nowrap">24 h</span>. Solo‑Act oder Ensemble.</p>
            </div>
            <div className="flex flex-col">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-white/10">
                <span className="text-sm">3</span>
              </div>
              <h3 className="mt-2 mb-3 text-lg font-semibold">Proben & Technik</h3>
              <p className="text-white/70">Ablauf, Musik, Kostüm. Optional: Licht, Ton, Bühne. Wir koordinieren Künstler & Venue.</p>
            </div>
            <div className="flex flex-col">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-white/10">
                <span className="text-sm">4</span>
              </div>
              <h3 className="mt-2 mb-3 text-lg font-semibold">Showtime</h3>
              <p className="text-white/70">Anreise, Aufbau, Soundcheck – alles im Plan. Sie genießen die Show, wir liefern die Magie.</p>
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">Solo‑Act</h3>
            <p className="text-white/70 mb-3">5–8 Min | 1 Artist</p>
            <ul className="text-white/70 space-y-1 list-disc list-inside">
              <li>Starkes Highlight für Galas & Preisverleihungen</li>
              <li>Schneller Aufbau, geringe Bühne nötig</li>
              <li>Direkt buchbar aus unserem Netzwerk</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">Showblock</h3>
            <p className="text-white/70 mb-3">15–25 Min | 3–5 Artists</p>
            <ul className="text-white/70 space-y-1 list-disc list-inside">
              <li>Kuratiertes Programm mit rotem Faden</li>
              <li>Ideal für Firmenfeiern & Messen</li>
              <li>Auf Wunsch Moderation & Übergänge</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white/5 p-6">
            <h3 className="text-xl font-semibold mb-2">Varieté‑Abend</h3>
            <p className="text-white/70 mb-3">60–90 Min | 6–12 Artists</p>
            <ul className="text-white/70 space-y-1 list-disc list-inside">
              <li>Abendfüllendes Programm mit Regie</li>
              <li>Individuelles Motto, Musik & Kostüm</li>
              <li>Technik & Stage‑Management optional</li>
            </ul>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white/5 p-4 text-white/80">
            <span className="block text-sm">Lead Time</span>
            <span className="text-lg font-semibold">ab 2–6 Wochen</span>
          </div>
          <div className="rounded-xl bg-white/5 p-4 text-white/80">
            <span className="block text-sm">Bühne</span>
            <span className="text-lg font-semibold">je nach Act – wir beraten</span>
          </div>
          <div className="rounded-xl bg-white/5 p-4 text-white/80">
            <span className="block text-sm">Technik</span>
            <span className="text-lg font-semibold">Licht/Ton optional zubuchbar</span>
          </div>
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="mb-10 text-sm font-medium text-white/60 tracking-wide">
              NÄCHSTER SCHRITT
            </p>
            <h2 className="mb-2.5 text-3xl font-semibold">
              Welches Format passt zu Ihrem Event?
            </h2>
          </div>
          <div>
            <img
              src={AboutImage2}
              alt="PepeShows Beratung"
              className="mb-6 max-h-36 w-full rounded-xl object-cover"
            />
            <p className="text-white/70 mb-4">
              Nutzen Sie den Booking‑Assistenten für eine schnelle, unverbindliche Anfrage –
              oder buchen Sie direkt einen kurzen Beratungscall. Wir empfehlen das passende Format.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/anfragen" className="inline-flex items-center px-4 py-2 rounded-md bg-white text-black hover:bg-gray-200">Booking‑Assistent starten</a>
              <a href="/kontakt" className="inline-flex items-center px-4 py-2 rounded-md border border-white/30 text-white hover:bg-white/10">Beratungstermin</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { About1 };
