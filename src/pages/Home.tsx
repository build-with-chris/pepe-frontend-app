import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import PepesParticles from "@/components/InteractivePepeParticles";
import hero from "../assets/PepeHero.webp"
import pepeMobile from "../assets/PEPE.png";
import { useEffect, useState, useMemo } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle, AnimatedArrow } from "@/components/ui/resizable";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Gallery23 } from "@/components/gallery23";
import { Hero27 } from "@/components/hero27";
import { Cta10 } from "@/components/cta10";

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
  const [offset, setOffset] = useState(0);
  const [rightSize, setRightSize] = useState(20); // sync with right panel defaultSize
  const startOffset = -90; // start lower on the page

  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const artistImagesSmall = [
    { src: "/images/Slider/Artist-1.webp", name: "Carmen" },
    { src: "/images/Slider/Artist-2.webp", name: "Jonas" },
    { src: "/images/Slider/Artist-3.webp", name: "Sophie" },
  ];

  // new large variants (adjust paths/case to your folder structure)
  const artistImagesLarge = [
    { src: "/images/Slider/Artist1Large.webp", name: "Carmen" },
    { src: "/images/Slider/Artist2Large.webp", name: "Jonas" },
    { src: "/images/Slider/Artist3Large.webp", name: "Sophie" },
    // ...füge hier deine weiteren Artists ein (Artist4Large, Artist5Large, ...)
  ];

  const shuffledSmall = useMemo(() => shuffleArray(artistImagesSmall), []);
  const shuffledLarge = useMemo(() => shuffleArray(artistImagesLarge), []);

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

  const currentSmallName = useMemo(() => {
    if (!shuffledSmall.length) return undefined;
    const idx = currentIndex % shuffledSmall.length;
    return shuffledSmall[idx]?.name;
  }, [currentIndex, shuffledSmall]);

  const activeArtists = useMemo(() => {
    if (rightSize >= THRESHOLD) {
      const idx = shuffledLarge.findIndex(a => a.name === currentSmallName);
      return idx >= 0 ? rotateArray(shuffledLarge, idx) : shuffledLarge;
    }
    return shuffledSmall;
  }, [rightSize, shuffledLarge, shuffledSmall, currentSmallName]);

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
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
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
      <Hero27 />

      <div className="h-[2px] w-4/5 mx-auto my-12 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* Desktop/Tablet: horizontal layout */}
      <div className="hidden md:block">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full max-w-7xl mx-auto my-8 rounded-lg overflow-hidden "
          onLayout={(sizes: number[]) => {
            // sizes[1] is the right panel when there are two panels
            if (Array.isArray(sizes) && sizes.length > 1) {
              setRightSize(sizes[1]);
            }
          }}
        >
          <ResizablePanel defaultSize={80} minSize={40} className="flex flex-col justify-center px-6 py-8 bg-black/50 w-full">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5 text-white text-left">
              Finde jetzt den perfekten Künstler
            </h2>
            <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg text-left">
              Beantworte nur wenige kurze Fragen und erhalte unverbindlich erste Vorschläge und Preise.
            </p>
            <div className="flex flex-row gap-4">
            <a href="/anfragen">
              <button className="bg-[#3c4a8f] hover:bg-[#2d366d] text-white font-semibold px-6 py-3 rounded-md transition-colors duration-200 cursor-pointer">
                Jetzt starten
              </button>
            </a>
            <AnimatedArrow />
            </div>
            <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg text-left">Dauert weniger als 5&nbsp;Minuten</p>
          </ResizablePanel>
          

          <ResizableHandle
            withHandle
            withLottie={rightSize <= 30.5}
            lottieSrc="https://lottie.host/da09d1f8-6469-4592-a1af-2bd5570a30b5/pQjA8tzdWc.lottie"
            className="bg-white/10 hover:bg-white/20 transition-colors"
          />
          <ResizablePanel defaultSize={30} minSize={30} maxSize={45} className="bg-black w-full min-h-[420px]">
            <Carousel
              className="h-full min-h-[420px]"
              opts={{ loop: true }}
              plugins={rightSize < THRESHOLD ? [Autoplay({ delay: 2000, stopOnInteraction: false })] : []}
              setApi={setCarouselApi}
            >
              <CarouselContent className="h-full">
                {rightSize >= THRESHOLD ? (
                  <CarouselItem className="h-full">
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 w-full h-full overflow-hidden">
                        <iframe
                          src="https://www.youtube.com/embed/NdsfmLY8Xb8?rel=0&modestbranding=1&autoplay=1&mute=1&loop=1&playlist=NdsfmLY8Xb8&playsinline=1"
                          title="PepeShows Short"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ) : (
                  activeArtists.map((artist, i) => (
                    <CarouselItem key={i} className="h-full">
                      <div className="relative w-full h-full">
                        <img src={artist.src} alt={artist.name} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-black/30 text-white text-xs px-3 py-2">
                          {artist.name}
                        </div>
                      </div>
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
            </Carousel>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile: simple text block (no resizable) */}
      <div className="block md:hidden w-full mx-auto my-6 px-4">
        <div className="bg-black/50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-3 text-white text-left">
            🎭 Finde jetzt den perfekten Künstler
          </h2>
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            Beantworte wenige kurze Fragen und erhalte unverbindliche Vorschläge & Preise.
          </p>
          <a href="/anfragen">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-md transition-colors duration-200">
              Jetzt starten
            </button>
          </a>
          <AnimatedArrow />
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg text-left">
            Dauert &lt; 5&nbsp;Minuten
          </p>
        </div>
      </div>

            
      <div className="container w-full md:w-2/3 mx-auto">
        <Cta10
          heading="PepeShows – mehr als eine Künstlervermittlung"
          description={`Wir kreieren kommerzielle Shows, fördern Kultur und betreiben unsere eigene Base.\n So vereinen wir Erfahrung, Netzwerk und Leidenschaft – und machen PepeShows zu echten Experten für unvergessliche Erlebnisse.`}
          buttons={{
            primary: {
              text: "Zur Agentur",
              url: "/agentur",
            },
          }}
        />
      </div>
      <div className="h-12 bg-gradient-to-b from-black via-gray-900 to-black" />
 
      <div className="container w-full md:w-4/5 mx-auto">

      <Gallery23 />
      
      </div>
    </>

  );
}