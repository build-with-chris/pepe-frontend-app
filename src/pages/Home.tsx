import PepesParticles from "@/components/InteractivePepeParticles";
import hero from "../assets/PepeHero.webp"
import pepeMobile from "../assets/PEPE.webp";
import { useEffect, useState, useMemo, useRef, Suspense, lazy } from "react";
import { AnimatedArrow } from "@/components/ui/resizable";
import { SpotlightsFixed } from "@/components/SpotlightsFixed";
import { useTranslation } from "react-i18next";
import ConsentBannerLite from '@/components/ConsentBannerLite';

const Bento1 = lazy(() => import("@/components/bento1").then(m => ({ default: m.Bento1 })));
const Cta10 = lazy(() => import("@/components/cta10").then(m => ({ default: m.Cta10 })));
const Gallery23 = lazy(() => import("@/components/gallery23").then(m => ({ default: m.Gallery23 })));


function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}



export default function Home() {
  const { t } = useTranslation();

  const [offset, setOffset] = useState(0);
  const startOffset = -90; // start lower on the page
  const [autoplayPlugin, setAutoplayPlugin] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    let cancelled = false;
    const load = async () => {
      try {
        const mod = await import('embla-carousel-autoplay');
        if (!cancelled) {
          const plugin = mod.default({ delay: 3200, stopOnInteraction: false });
          setAutoplayPlugin(plugin);
        }
      } catch {}
    };
    if (mq.matches) load();
    const onChange = (e: MediaQueryListEvent) => { if (e.matches && !autoplayPlugin) load(); };
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
    return () => {
      cancelled = true;
      mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange);
    };
  }, []);


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

  // (removed carouselApi, currentIndex, rightSize, groupRef, and related effects)


  return (
    <>
      <div className="hidden md:block">
        <div
          id="hero"
          className="relative w-screen min-h-[85vh] bg-black overflow-hidden mt-20 -mb-20"
        >
          {/* Hero image as real element so it can be prioritized as LCP */}
          <picture>
            <source srcSet={hero} type="image/webp" />
            <img
              src={hero}
              alt="PepeShows Hero"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover will-change-transform"
              style={{ transform: `translateY(${startOffset + offset}px)` }}
            />
          </picture>

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
        <img
          src={pepeMobile}
          alt="Pepe"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={960}
          height={540}
          className="max-w-full h-auto"
        />
      </div>

      
          {/* Textblock 1 nach Hero */}
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">

        <Suspense fallback={null}>
          <Bento1 />
        </Suspense>
        </div>
  

      <div className="h-px w-full max-w-none mx-auto my-16 bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      {/* Desktop/Tablet: horizontal layout (fixed, no resize) */}
      <SpotlightsFixed spotlights={shuffledSpotlights} autoplayPlugin={autoplayPlugin} />

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
  
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg text-left">
            {t("home.findArtistTime")}
          </p>
        </div>
      </div>

            
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
        <Suspense fallback={null}>
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
        </Suspense>
      </div>
      <div className="h-12 bg-gradient-to-b from-black via-gray-900 to-black" />
 
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">

      <Suspense fallback={null}>
        <Gallery23 />
      </Suspense>
      
      </div>
      <ConsentBannerLite />
    </>

  );
}