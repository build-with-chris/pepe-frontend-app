import { Fragment } from "react";
import { Download, ExternalLink, Image as ImageIcon, FileText, Palette, Type as TypeIcon, Camera, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

/**
 * Brandguide – Pepe Shows
 * Dunkler Pepe‑Look, klare Sektionen, Downloads & Beispiele
 */

export default function Brandguide() {
  return (
    <Fragment>
      {/* Hero */}
      <section className="bg-black py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="bg-gray-800 inline-flex items-center gap-2 rounded-md py-2 pl-4 pr-3">
              <ImageIcon className="h-6 w-6 stroke-white" />
              <span className="text-white text-lg font-bold">Brand Guide</span>
            </div>
            <h1 className="text-white mt-6 text-5xl font-semibold leading-tight md:text-6xl">Pepe – Markenrichtlinien</h1>
            <p className="text-gray-300 mt-4 text-lg md:text-xl">
              Dieser Guide hilft Veranstaltern, Partnern und der Presse, Pepe konsistent und professionell darzustellen.
              Logos, Farben, Schriften – plus Beispiele und schnelle Downloads.
            </p>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="bg-black py-12 md:py-16">
        <div className="container mx-auto max-w-6xl">
          <Header title="Logos" subtitle="Hauptlogo in Farbe, Schwarz, Weiß & invertiert. Immer mit genügend Freiraum verwenden, nicht verzerren oder drehen." icon={<ImageIcon className="h-6 w-6" />} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <AspectRatio ratio={16 / 9}>
                <img src="/src/assets/Logos/Logo PepeShows schwarz.png" alt="Pepe Logo Vorschau" className="h-full w-full object-contain bg-white" />
              </AspectRatio>
              <CardTitle>Hauptlogo</CardTitle>
              <CardText>SVG für digital & Druck, PNG (transparent) für Office/Präsentation.</CardText>
              <CardActions>
                <Button asChild size="sm" className="rounded-full"><a href="/src/assets/Logos/PepeShowsLogo schwarz.svg" download><Download className="mr-2 h-4 w-4" />SVG</a></Button>
                <Button asChild size="sm" className="rounded-full"><a href="/src/assets/Logos/Logo PepeShows schwarz.png" download><Download className="mr-2 h-4 w-4" />PNG</a></Button>
              </CardActions>
            </Card>

            <Card>
              <AspectRatio ratio={16 / 9}>
                <div className="flex h-full w-full items-center justify-center bg-black">
                  <img src="/src/assets/Logos/Logo PepeShows weiß.png" alt="Pepe Logo invertiert" className="h-16 w-auto" />
                </div>
              </AspectRatio>
              <CardTitle>Invertiert</CardTitle>
              <CardText>Für dunkle Hintergründe. Bitte nicht auf unruhigen Fotos platzieren.</CardText>
              <CardActions>
                <Button asChild size="sm" className="rounded-full"><a href="/src/assets/Logos/PepeShows weiß.svg" download><Download className="mr-2 h-4 w-4" />SVG</a></Button>
                <Button asChild size="sm" className="rounded-full"><a href="/src/assets/Logos/Logo PepeShows weiß.png" download><Download className="mr-2 h-4 w-4" />PNG</a></Button>
              </CardActions>
            </Card>

            <Card>
              <AspectRatio ratio={16 / 9}>
                <div className="flex h-full w-full items-center justify-center bg-white">
                  <img src="/src/assets/Logos/Logo PepeShows schwarz.png" alt="Pepe Logo schwarz" className="h-16 w-auto" />
                </div>
              </AspectRatio>
              <CardTitle>Monochrom</CardTitle>
              <CardText>Schwarz/Weiß‑Variante für reduzierte Anwendungen.</CardText>
              <CardActions>
                <Button asChild size="sm" className="rounded-full"><a href="/src/assets/Logos/PepeShowsLogo schwarz.svg" download><Download className="mr-2 h-4 w-4" />SVG</a></Button>
                <Button asChild size="sm" className="rounded-full"><a href="/src/assets/Logos/Logo PepeShows schwarz.png" download><Download className="mr-2 h-4 w-4" />PNG</a></Button>
              </CardActions>
            </Card>
          </div>
        </div>
      </section>

      {/* Farben */}
      <section className="bg-black py-12 md:py-16">
        <div className="container mx-auto max-w-6xl">
          <Header title="Farben" subtitle="Primärfarben, Sekundärfarben und Neutrals – mit Werten für HEX, RGB & CMYK." icon={<Palette className="h-6 w-6" />} />

          <div className="mx-auto grid max-w-3xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            <ColorSwatch name="Pepe Dunkelblau" hex="#1D3557" rgb="29, 53, 87" cmyk="100, 75, 25, 40" />
            <ColorSwatch name="Weiß" hex="#FFFFFF" rgb="255, 255, 255" cmyk="0, 0, 0, 0" border />
            <ColorSwatch name="Schwarz" hex="#000000" rgb="0, 0, 0" cmyk="0, 0, 0, 100" />
          </div>
        </div>
      </section>

      {/* Typografie */}
      <section className="bg-black py-12 md:py-16">
        <div className="container mx-auto max-w-6xl">
          <Header title="Typografie" subtitle="Headlines und Fließtext – konsistent für Web & Print." icon={<TypeIcon className="h-6 w-6" />} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardTitle>Headlines</CardTitle>
              <CardText>
                Futura Bold. Alternativ: Nunito Sans Bold. Bitte großzügige Zeilenhöhe und negativen Tracking vermeiden.
              </CardText>
              <CardActions>
                <Button asChild size="sm" variant="secondary" className="rounded-full"><a href="https://fonts.google.com/specimen/Nunito+Sans" target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4" />Google Fonts</a></Button>
              </CardActions>
            </Card>

            <Card>
              <CardTitle>Fließtext</CardTitle>
              <CardText>Futura Regular. Alternativ: Nunito Sans Regular. Für bessere Lesbarkeit ausreichend Kontrast.</CardText>
              <CardActions>
                <Button asChild size="sm" variant="secondary" className="rounded-full"><a href="https://fonts.google.com/specimen/Nunito+Sans" target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4" />Google Fonts</a></Button>
              </CardActions>
            </Card>
          </div>
        </div>
      </section>

      {/* Bildsprache */}
      <section className="bg-black py-12 md:py-16">
        <div className="container mx-auto max-w-6xl">
          <Header title="Bildsprache" subtitle="Dynamisch, energiegeladen, modern – Action, Bewegung und Emotion." icon={<Camera className="h-6 w-6" />} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <AspectRatio ratio={4 / 5}>
            <img
                src="/images/eventTypes/Streetshow.webp"
                alt="Streetshow Beispiel"
                className="h-full w-full rounded-xl object-cover"
            />
            </AspectRatio>

            <AspectRatio ratio={4 / 5}>
            <img
                src="/images/teamSizes/Solo.webp"
                alt="Solo Beispiel"
                className="h-full w-full rounded-xl object-cover"
            />
            </AspectRatio>

            <AspectRatio ratio={4 / 5}>
            <img
                src="/images/disciplines/Luftakrobatik.webp"
                alt="Luftakrobatik Beispiel"
                className="h-full w-full rounded-xl object-cover"
            />
            </AspectRatio>
          </div>
        </div>
      </section>

      {/* Tonalität */}
      <section className="bg-black py-12 md:py-16">
        <div className="container mx-auto max-w-6xl">
          <Header title="Sprache & Tonalität" subtitle="Locker, direkt, einladend – aktivierende Formulierungen, kein Fachjargon." icon={<MessageSquare className="h-6 w-6" />} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardTitle>Do</CardTitle>
              <ul className="text-gray-200 text-sm space-y-2 list-disc pl-5">
                <li>„Erlebt Pepe live“ – aktivierend & kurz.</li>
                <li>Konzise Infos, klare Handlungsaufforderungen.</li>
                <li>Kontraststarke Hintergründe für das Logo.</li>
              </ul>
            </Card>
            <Card>
              <CardTitle>Don't</CardTitle>
              <ul className="text-gray-200 text-sm space-y-2 list-disc pl-5">
                <li>Logo verzerren, drehen oder mit Effekten versehen.</li>
                <li>Logo auf unruhigen Fotos ohne Fläche platzieren.</li>
                <li>Zu formelle Sprache oder Fachbegriffe.</li>
              </ul>
            </Card>
            <Card>
              <CardTitle>Kontakt</CardTitle>
              <p className="text-gray-300 text-sm">Fragen zur Verwendung? Wir helfen gern weiter.</p>
              <p className="text-gray-200 text-sm">E-Mail: info@pepeshows.de</p>
              <p className="text-gray-200 text-sm">Web: www.pepeshows.de</p>
            </Card>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

// ——— Hilfs-Komponenten ———

function Header({ title, subtitle, icon }: { title: string; subtitle: string; icon?: React.ReactNode }) {
  return (
    <div className="mb-6 text-center">
      <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-white">
        {icon}
        <span className="text-lg font-bold">{title}</span>
      </div>
      <p className="mx-auto max-w-3xl text-gray-300">{subtitle}</p>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-gray-800 bg-[#0b0b0b] p-6">{children}</div>;
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 text-2xl font-semibold text-white">{children}</h3>;
}

function CardText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-300">{children}</p>;
}

function CardActions({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex flex-wrap gap-2">{children}</div>;
}

function ColorSwatch({ name, hex, rgb, cmyk, border }: { name: string; hex: string; rgb: string; cmyk: string; border?: boolean }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#0b0b0b] p-6">
      <div className={`mb-4 h-24 w-full rounded-xl ${border ? "border border-gray-200" : ""}`} style={{ backgroundColor: hex }} />
      <h4 className="text-lg font-semibold text-white">{name}</h4>
      <p className="text-sm text-gray-300">HEX {hex}</p>
      <p className="text-sm text-gray-300">RGB {rgb}</p>
      <p className="text-sm text-gray-300">CMYK {cmyk}</p>
    </div>
  );
}
