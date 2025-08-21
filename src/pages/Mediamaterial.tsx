import { Fragment } from "react";
import { Download, FileText, Image as ImageIcon, Video, FolderDown, Link as LinkIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

// Pepe Mediamaterial – Seite für Veranstalter
// Hinweis: Lege deine Dateien in /public/media/... ab (siehe Pfade unten).
// Passe die Links/Dateinamen unten an deine echten Assets an.

export default function Mediamaterial() {
  return (
    <Fragment>
      {/* Header / Hero */}
      <section className="bg-black py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center flex flex-col items-center">
            <div className="bg-gray-800 inline-flex items-center gap-2 rounded-md py-2 pl-4 pr-3">
              <ImageIcon className="h-6 w-6 stroke-white" />
              <span className="text-white text-lg font-bold">Mediamaterial</span>
            </div>
            <h1 className="text-white mt-6 text-5xl font-semibold leading-tight md:text-6xl">
              Alles für eure Promo – an einem Ort
            </h1>
            <p className="text-gray-300 mt-4 text-xl md:text-2xl">
              Logos, Titelbilder, Pressetexte und Trailer. Dazu optional Pakete je Disziplin, damit ihr genau das bewerben könnt, was ihr gebucht habt.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild className="rounded-full">
                <a href="/media/pepe_media_kit.zip" download>
                  <FolderDown className="mr-2 h-5 w-5" />
                  Komplettes Media‑Kit (ZIP)
                </a>
              </Button>
              <Button asChild variant="secondary" className="rounded-full">
                <a href="https://www.youtube.com/watch?v=dXHLaIkezTM" target="_blank" rel="noreferrer">
                  <Video className="mr-2 h-5 w-5" />
                  YouTube‑Trailer
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Allgemeines Material */}
      <section className="bg-black py-12 md:py-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-white mb-6 text-3xl font-semibold md:text-4xl text-center">Allgemeines Mediamaterial</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto justify-items-center">
            {/* Logos */}
            <MediaCard
              title="Logos (SVG/PNG)"
              description="Farbig, Schwarz, Weiß – mit/ohne Hintergrund."
              preview="/media/general/logo-preview.png"
              downloads={[
                { label: "Logo‑Pack (ZIP)", href: "/media/general/logos/pepe-logos.zip" },
                { label: "Brand‑Guide (PDF)", href: "/media/general/brand-guide.pdf" },
              ]}
            />

            {/* Titelbild */}
            <MediaCard
              title="Titel- / Headerbild"
              description="High‑Res Header für Plakate, Websites & Social."
              preview="/media/general/title-image.jpg"
              downloads={[
                { label: "Header 16:9 (JPG)", href: "/media/general/header-16x9.jpg" },
                { label: "Header 4:5 (JPG)", href: "/media/general/header-4x5.jpg" },
              ]}
            />

            {/* Pressemappe */}
            <MediaCard
              title="Pressemappe / Fact Sheet"
              description="Kurzvorstellung, USP, Kontakt & Rider."
              icon="file"
              downloads={[
                { label: "Pressemappe (PDF)", href: "/media/general/pressemappe.pdf" },
                { label: "Technik‑Rider (PDF)", href: "/media/general/technik-rider.pdf" },
              ]}
            />

            {/* Social Templates */}
            <MediaCard
              title="Social‑Media Vorlagen"
              description="Feed & Story‑Templates als editierbare Dateien."
              preview="/media/general/social-templates-preview.jpg"
              downloads={[
                { label: "Instagram Story (PSD)", href: "/media/general/ig-story.psd" },
                { label: "Instagram Feed (PSD)", href: "/media/general/ig-feed.psd" },
                { label: "Canva‑Vorlagen (Link)", href: "https://www.canva.com/", external: true },
              ]}
            />

            {/* Trailer (Kurzclip) */}
            <MediaCard
              title="Trailer (Kurzclip)"
              description="Kurzvorschau für eure Kanäle."
              video="/videos/Vorschauloop.webm"
              downloads={[
                { label: "Download (WEBM)", href: "/videos/Vorschauloop.webm" },
                { label: "YouTube‑Trailer", href: "https://www.youtube.com/watch?v=dXHLaIkezTM", external: true },
              ]}
            />

            {/* QR-Code */}
            <MediaCard
              title="QR‑Code zum Trailer"
              description="Für Flyer, Plakate & Programme."
              preview="/media/general/qr-trailer.png"
              downloads={[
                { label: "QR‑Code (PNG)", href: "/media/general/qr-trailer.png" },
                { label: "QR‑Code (SVG)", href: "/media/general/qr-trailer.svg" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Disziplinen */}
      <section className="bg-black pb-20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-white mb-6 text-3xl font-semibold md:text-4xl text-center">Disziplinen – Materialpakete</h2>
          <p className="text-gray-300 mb-8 max-w-3xl text-lg text-center mx-auto">
            Für gezielte Promo: pro Disziplin 2–3 Fotos, kurzer Textbaustein und ggf. ein Poster‑Template.
          </p>

          <div className="space-y-4 max-w-5xl mx-auto">
            <Disziplin
              name="Cyr‑Wheel"
              slug="cyr"
              teaser="Atemberaubende Artistik im rotierenden Rad."
              images={["/media/disciplines/cyr/cyr-1.jpg", "/media/disciplines/cyr/cyr-2.jpg", "/media/disciplines/cyr/cyr-3.jpg"]}
              downloads={[
                { label: "Foto‑Pack (ZIP)", href: "/media/disciplines/cyr/cyr-photos.zip" },
                { label: "Textbausteine (TXT)", href: "/media/disciplines/cyr/cyr-copy.txt" },
                { label: "Poster A3 (PDF)", href: "/media/disciplines/cyr/cyr-poster-a3.pdf" },
              ]}
            />

            <Disziplin
              name="Jonglage"
              slug="jonglage"
              teaser="Präzision, Rhythmus und Humor – modern inszeniert."
              images={["/media/disciplines/jonglage/j-1.jpg", "/media/disciplines/jonglage/j-2.jpg"]}
              downloads={[
                { label: "Foto‑Pack (ZIP)", href: "/media/disciplines/jonglage/j-photos.zip" },
                { label: "Textbausteine (TXT)", href: "/media/disciplines/jonglage/j-copy.txt" },
              ]}
            />

            <Disziplin
              name="Akrobatik"
              slug="akrobatik"
              teaser="Dynamische Hebefiguren und kraftvolle Soli."
              images={["/media/disciplines/akrobatik/a-1.jpg", "/media/disciplines/akrobatik/a-2.jpg", "/media/disciplines/akrobatik/a-3.jpg"]}
              downloads={[
                { label: "Foto‑Pack (ZIP)", href: "/media/disciplines/akrobatik/a-photos.zip" },
                { label: "Textbausteine (TXT)", href: "/media/disciplines/akrobatik/a-copy.txt" },
                { label: "Poster A3 (PDF)", href: "/media/disciplines/akrobatik/a-poster-a3.pdf" },
              ]}
            />
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild className="rounded-full">
              <a href="/media/disciplines/all_disciplines.zip" download>
                <FolderDown className="mr-2 h-5 w-5" />
                Alle Disziplin‑Pakete (ZIP)
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

// ——— Hilfs-Komponenten ———

type DownloadLink = { label: string; href: string; external?: boolean };

function MediaCard(props: {
  title: string;
  description: string;
  preview?: string; // Bild-Pfad
  video?: string; // Video-Pfad
  icon?: "file";
  downloads: DownloadLink[];
}) {
  const { title, description, preview, video, icon, downloads } = props;

  return (
    <div className="rounded-2xl border border-gray-800 bg-[#0b0b0b] p-5 w-full text-center">
      <div className="mb-4 overflow-hidden rounded-xl">
        {preview ? (
          <AspectRatio ratio={16 / 9}>
            <img
              src={preview}
              alt={`${title} Vorschau`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </AspectRatio>
        ) : video ? (
          <AspectRatio ratio={16 / 9}>
            <video
              src={video}
              muted
              autoPlay
              loop
              playsInline
              aria-label={`${title} Vorschauvideo`}
              className="h-full w-full object-cover"
            />
          </AspectRatio>
        ) : (
          <div className="flex h-40 items-center justify-center bg-gray-900">
            {icon === "file" ? <FileText className="h-8 w-8 text-gray-500" /> : <ImageIcon className="h-8 w-8 text-gray-500" />}
          </div>
        )}
      </div>
      <h3 className="text-white text-xl font-semibold text-center">{title}</h3>
      <p className="text-gray-300 mt-1 text-sm text-center">{description}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {downloads.map((d, i) =>
          d.external ? (
            <Button key={i} asChild size="sm" variant="secondary" className="rounded-full">
              <a href={d.href} target="_blank" rel="noreferrer">
                <LinkIcon className="mr-2 h-4 w-4" />
                {d.label}
              </a>
            </Button>
          ) : (
            <Button key={i} asChild size="sm" className="rounded-full">
              <a href={d.href} download>
                <Download className="mr-2 h-4 w-4" />
                {d.label}
              </a>
            </Button>
          )
        )}
      </div>
    </div>
  );
}

function Disziplin(props: {
  name: string;
  slug: string;
  teaser: string;
  images: string[];
  downloads: DownloadLink[];
}) {
  const { name, teaser, images, downloads } = props;

  return (
    <details className="group rounded-2xl border border-gray-800 bg-[#0b0b0b] p-5 open:bg-[#0f0f0f]">
      <summary className="flex cursor-pointer list-none flex-col items-center gap-2">
        <div>
          <h3 className="text-white text-2xl font-semibold text-center">{name}</h3>
          <p className="text-gray-400 mt-1 text-sm text-center">{teaser}</p>
        </div>
        <span className="text-gray-400 text-sm group-open:hidden">aufklappen</span>
        <span className="text-gray-400 text-sm hidden group-open:inline">zuklappen</span>
      </summary>

      <div className="mt-5 grid gap-3 sm:grid-cols-3 justify-center justify-items-center">
        {images.map((src, i) => (
          <AspectRatio key={i} ratio={4 / 5}>
            <img
              src={src}
              alt={`${name} Beispielbild ${i + 1}`}
              className="h-full w-full rounded-lg object-cover"
              loading="lazy"
            />
          </AspectRatio>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {downloads.map((d, i) => (
          <Button key={i} asChild size="sm" className="rounded-full">
            <a href={d.href} download>
              <Download className="mr-2 h-4 w-4" />
              {d.label}
            </a>
          </Button>
        ))}
      </div>
    </details>
  );
}
