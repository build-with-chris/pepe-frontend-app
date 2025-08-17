import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import PepesParticles from "@/components/InteractivePepeParticles";
import hero from "../assets/PepeHero.webp"
import pepeMobile from "../assets/PEPE.png";
import { useEffect, useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Gallery23 } from "@/components/gallery23";
import { Blog7 } from "@/components/blog7";
import Artist1 from "@/assets/Slider/Artist-1.webp";
import Artist2 from "@/assets/Slider/Artist-2.webp";
import Artist3 from "@/assets/Slider/Artist-3.webp";

export default function Home() {
  const [offset, setOffset] = useState(0);
  const startOffset = -90; // start lower on the page

  const artistImages = [Artist1, Artist2, Artist3];

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

      <h3
        className="mx-auto max-w-3xl px-4 text-center text-white text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight [text-wrap:balance] mt-8 md:mt-12 mb-4"
      >
        Wir bringen <span className="font-bold text-white/90">außergewöhnliche Künstler</span> und <span className="font-bold text-white/90">unvergessliche Showmomente</span> auf Ihre Bühne.
        <span className="block mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
          Ob Firmenfeier, Gala oder Messe – mit uns wird Ihr Event zum Highlight, über das man noch lange spricht.
        </span>
      </h3>

      {/* Desktop/Tablet: horizontal layout */}
      <div className="hidden md:block">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full max-w-6xl mx-auto my-8 rounded-lg overflow-hidden border border-white/10"
        >
          <ResizablePanel defaultSize={80} minSize={40} className="flex flex-col justify-center px-6 py-8 bg-black/50 w-full">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5 text-white text-left">
              Finde jetzt den perfekten Künstler
            </h2>
            <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg text-left">
              Beantworte nur wenige kurze Fragen und erhalte unverbindlich erste Vorschläge und Preise.
            </p>
            <a href="/anfragen">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-colors duration-200">
                Jetzt starten
              </button>
            </a>
            <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg text-left">Dauert weniger als 5&nbsp;Minuten</p>
          </ResizablePanel>
          <ResizableHandle withHandle className="bg-white/10 hover:bg-white/20 transition-colors" />
          <ResizablePanel defaultSize={30} minSize={15} className="bg-black w-full min-h-[420px]">
            <Carousel
              className="h-full min-h-[420px]"
              opts={{ loop: true }}
              plugins={[Autoplay({ delay: 2000, stopOnInteraction: false })]}
            >
              <CarouselContent className="h-full">
                {artistImages.map((src, i) => (
                  <CarouselItem key={i} className="h-full">
                    <div className="relative w-full h-full">
                      <img src={src} alt={`Artist ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/30 text-white text-xs px-3 py-2">
                        {`Artist ${i + 1}`}
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
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg text-left">
            Dauert &lt; 5&nbsp;Minuten
          </p>
        </div>
      </div>

      <div className="container w-full md:w-2/3 mx-auto">
        <Blog7 />
      </div>
      <div className="container w-full md:w-2/3 mx-auto">
      <Gallery23 />
      
      </div>
    </>

  );
}