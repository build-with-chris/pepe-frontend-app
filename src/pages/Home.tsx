import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import PepesParticles from "@/components/InteractivePepeParticles";
import hero from "../assets/PepeHero.webp"
import pepeMobile from "../assets/PEPE.png";
import { useEffect, useState, useMemo, useRef } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle, AnimatedArrow } from "@/components/ui/resizable";
import type { ImperativePanelGroupHandle } from "react-resizable-panels";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Gallery23 } from "@/components/gallery23";
import { Hero27 } from "@/components/hero27";
import { Cta10 } from "@/components/cta10";
import { useTranslation } from "react-i18next";
import { Bento1 } from "@/components/bento1";

const THRESHOLD = 45; // %

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function rotateArray<T>(arr: T[], startIndex: number): T[] {
  if (!arr.length) return arr;
  const i = ((startIndex % arr.length) + arr.length) % arr.length;
  return [...arr.slice(i), ...arr.slice(0, i)];
}

export default function Home() {
  const { t } = useTranslation();

  const groupRef = useRef<ImperativePanelGroupHandle | null>(null);

  const handleJump = (target: number) => {
    const handle = groupRef.current;
    if (!handle) return;
    const clamped = Math.max(0, Math.min(100, target));
    // Layout order corresponds to [leftPanel, rightPanel]
    handle.setLayout([100 - clamped, clamped]);
  };

  const [offset, setOffset] = useState(0);
  const [rightSize, setRightSize] = useState(20); // sync with right panel defaultSize
  const startOffset = -90; // start lower on the page

  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const artistImagesSmall = [
    { src: "/images/Slider/Artist1.webp", name: "Carmen" },
    { src: "/images/Slider/Artist2.webp", name: "Jonas" },
    { src: "/images/Slider/Artist3.webp", name: "Sophie" },
    { src: "/images/Slider/Artist4.webp", name: "Dani" },
    { src: "/images/Slider/Artist5.webp", name: "Jakob" },
    { src: "/images/Slider/Artist6.webp", name: "Jaward" },
    { src: "/images/Slider/Artist7.webp", name: "Michi" },
  ];

  const spotlights = [
    {
      mediaType: "video" as const,
      mediaSrc: "/videos/Short%20Clips/Pantomime.webm",
      kicker: "Walking Act / Pantomime",
      title: "Stille, die spricht.",
      subtitle: "Interaktive Figuren, die Gäste zum Staunen bringen.",
      tags: ["Live", "Mobil", "Publikumsnähe"],
    },
    {
      mediaType: "video" as const,
      mediaSrc: "/videos/Short%20Clips/Pantomime%202.webm",
      kicker: "Walking Act / Pantomime",
      title: "Gesten statt Worte.",
      subtitle: "Humorvoll, charmant und immer im Moment.",
      tags: ["Interaktiv", "< 10 Sek.", "Welcome"],
    },
    {
      mediaType: "video" as const,
      mediaSrc: "/videos/Short%20Clips/Cyr%205.webm",
      kicker: "Cyr-Wheel",
      title: "360° Eleganz.",
      subtitle: "Dynamik und Präzision im rollenden Kreis.",
      tags: ["Bühne", "Dynamisch", "Wow"],
    },
    {
      mediaType: "video" as const,
      mediaSrc: "/videos/Short%20Clips/LED%20CYR%20Blackbox.webm",
      kicker: "Cyr-Wheel (LED)",
      title: "Licht im perfekten Kreis.",
      subtitle: "LED-Inszenierung für dunkle Bühnen.",
      tags: ["LED", "Dark Stage", "Effekt"],
    },
    {
      mediaType: "video" as const,
      mediaSrc: "/videos/Short%20Clips/Chienise%20Pole.webm",
      kicker: "Chinese Pole",
      title: "Kraft trifft Höhe.",
      subtitle: "Akrobatik am Pfahl mit Wow-Effekt.",
      tags: ["Kraft", "Vertikal", "Akrobatik"],
    },
    {
      mediaType: "video" as const,
      mediaSrc: "/videos/Short%20Clips/Contortion.webm",
      kicker: "Contortion",
      title: "Grenzenlose Beweglichkeit.",
      subtitle: "Akrobatik, die die Schwerkraft aushebelt.",
      tags: ["Flexibility", "Artistry"],
    },
    {
      mediaType: "video" as const,
      mediaSrc: "/videos/Short%20Clips/Handstand.webm",
      kicker: "Handstand Akrobatik",
      title: "Balance, die fesselt.",
      subtitle: "Konzentration, Kontrolle, Klasse.",
      tags: ["Balance", "Kontrolle"],
    },
    {
      mediaType: "video" as const,
      mediaSrc: "/videos/Short%20Clips/Hula.webm",
      kicker: "Hula Hoop",
      title: "Ringe in Rotation.",
      subtitle: "Flow, Rhythmus und Präzision.",
      tags: ["Flow", "Rhythmus"],
    },
  ];

  const shuffledSmall = useMemo(() => shuffleArray(artistImagesSmall), []);
  const shuffledSpotlights = useMemo(() => shuffleArray(spotlights), []);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById("hero");
      if (!el) return;
      const sectionTop = el.offsetTop;
      const y = window.scrollY;
      if (y >= sectionTop) {
        setOffset((y - sectionTop) * 1); // parallax factor (slower than scroll)
      } else {
        setOffset(0);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // run once in case page is already scrolled
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setCurrentIndex(carouselApi.selectedScrollSnap());
    onSelect();
    carouselApi.on("select", onSelect);
    return () => {
      try { carouselApi.off("select", onSelect); } catch {}
    };
  }, [carouselApi]);

  const activeArtists = useMemo(() => {
    return shuffledSmall;
  }, [rightSize, shuffledSmall]);

  return (
    <>
      <div className="hidden md:block">
        <div
          id="hero"
          className="relative w-screen min-h-[85vh] bg-black bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${hero})`,
            backgroundPosition: `center ${startOffset + offset}px`,
            backgroundSize: 'cover',
            backgroundAttachment: 'scroll'
          }}
        >
          {/* Dark overlay to dim the hero image */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          {/* Pepe Canvas unten mittig */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-12 md:-bottom-5 z-10 flex justify-center">
            <div className="relative w-full max-w-[1080px] aspect-[8/3] overflow-hidden">
              <PepesParticles />
            </div>
          </div>          
        </div>
      </div>

      {/* Mobile-only hero image */}
      <div className="block md:hidden w-full flex items-center justify-center py-8 px-4">
        <img src={pepeMobile} alt="Pepe" className="max-w-full h-auto" />
      </div>

      
          {/* Textblock 1 nach Hero */}
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">

        <Bento1 />
        </div>
  

      <div className="h-px w-full max-w-none mx-auto my-16 bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      {/* Desktop/Tablet: horizontal layout */}
      <div className="hidden md:block">
        <ResizablePanelGroup
          ref={groupRef}
          direction="horizontal"
          className="w-full mx-auto my-12 px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 rounded-lg overflow-hidden"
          onLayout={(sizes: number[]) => {
            // sizes[1] is the right panel when there are two panels
            if (Array.isArray(sizes) && sizes.length > 1) {
              setRightSize(sizes[1]);
            }
          }}
        >
          <ResizablePanel defaultSize={75} minSize={40} className="flex flex-col justify-center px-8 md:px-10 py-10 bg-black/50 w-full">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-white text-left">
              {t("home.findArtistTitle")}
            </h2>
            <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg leading-relaxed text-left">
              {t("home.findArtistSubtitle")}
            </p>
            <div className="flex flex-row gap-4">
            <a href="/anfragen">
              <button className="bg-[#3c4a8f] hover:bg-[#2d366d] text-white font-semibold px-7 py-3.5 rounded-full transition-colors duration-200 cursor-pointer text-sm md:text-base">
                {t("home.findArtistButton")}
              </button>
            </a>
            <AnimatedArrow />
            </div>
            <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg leading-relaxed text-left">{t("home.findArtistTime")}</p>
          </ResizablePanel>
          

          <ResizableHandle
            withHandle
            withLottie={rightSize <= 30.5}
            lottieSrc="https://lottie.host/da09d1f8-6469-4592-a1af-2bd5570a30b5/pQjA8tzdWc.lottie"
            className="bg-white/10 hover:bg-white/20 transition-colors"
            jumpTo={THRESHOLD}
            onJump={handleJump}
          />
          <ResizablePanel defaultSize={30} minSize={30} maxSize={45} className="bg-black w-full min-h-[420px] p-2">
            <Carousel
              className="h-full min-h-[420px]"
              opts={{ loop: true }}
              plugins={[Autoplay({ delay: 3200, stopOnInteraction: false })]}
              setApi={setCarouselApi}
            >
              <CarouselContent className="h-full">
                {shuffledSpotlights.map((s, i) => (
                  <CarouselItem key={i} className="h-full p-3">
                    <div className="relative w-full h-full overflow-hidden rounded-xl ring-1 ring-white/12 shadow-lg">
                      {s.mediaType === "video" ? (
                        <video
                          key={s.mediaSrc}
                          src={s.mediaSrc}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="auto"
                          aria-label="PepeShows Showcase Video"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={s.mediaSrc}
                          alt={s.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                      {/* Tags */}
                      {s.tags && (
                        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
                          {s.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[10px] font-medium text-white/90 backdrop-blur-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Text overlay */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        {s.kicker && (
                          <div className="text-[11px] uppercase tracking-widest opacity-80">{s.kicker}</div>
                        )}
                        <div className="text-base md:text-lg font-semibold leading-snug">{s.title}</div>
                        {s.subtitle && (
                          <div className="text-xs opacity-80 mt-0.5">{s.subtitle}</div>
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile: simple text block (no resizable) */}
      <div className="block md:hidden w-full mx-auto my-6 px-4">
        <div className="bg-black/50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-3 text-white text-left">
            {t("home.findArtistTitle")}
          </h2>
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            {t("home.findArtistSubtitle")}
          </p>
          <a href="/anfragen">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-full transition-colors duration-200">
              {t("home.findArtistButton")}
            </button>
          </a>
          <AnimatedArrow />
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg text-left">
            {t("home.findArtistTime")}
          </p>
        </div>
      </div>

            
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
        <Cta10
          heading={t("home.cta.heading")}
          description={t("home.cta.description")}
          buttons={{
            primary: {
              text: t("home.cta.button"),
              url: "/agentur",
            },
          }}
        />
      </div>
      <div className="h-12 bg-gradient-to-b from-black via-gray-900 to-black" />
 
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">

      <Gallery23 />
      
      </div>
    </>

  );
}