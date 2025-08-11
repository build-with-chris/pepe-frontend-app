import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import PepesParticles from "@/components/InteractivePepeParticles";
import hero from "../assets/PepeHero.webp"
import groupV1 from "../assets/Group V1.webp";
import { useEffect, useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export default function Home() {
  const [offset, setOffset] = useState(0);
  const startOffset = -90; // start lower on the page

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
           <div
      id="hero"
      className="relative w-screen min-h-[80vh] bg-black bg-center bg-no-repeat bg-cover"
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
        {/* Titel + Call-to-Action darunter */}
        
      </div>

      <ResizablePanelGroup direction="horizontal" className="w-full max-w-6xl mx-auto my-8 rounded-lg overflow-hidden border border-white/10">
        <ResizablePanel defaultSize={50} minSize={30} className="flex flex-col justify-center px-6 py-8 bg-black/50">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white text-left">
            🎭 Finde jetzt den perfekten Künstler für dein Event
          </h2>
          <p className="text-base md:text-lg text-gray-200 max-w-xl mb-6 text-left">
            Beantworte nur wenige kurze Fragen und erhalte unverbindlich erste Vorschläge und Preise.
          </p>
          <a href="/anfragen">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-colors duration-200">
              Jetzt starten
            </button>
          </a>
          <p className="text-xs text-gray-300 mt-2 text-left">Dauert weniger als 5&nbsp;Minuten</p>
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-white/10 hover:bg-white/20 transition-colors" />
        <ResizablePanel defaultSize={50} minSize={30} className="bg-black">
          <img src={groupV1} alt="Show Vorschau" className="object-cover w-full h-full" />        
          </ResizablePanel>
      </ResizablePanelGroup>

      <h1 className="mx-auto text-center text-3xl font-mono font-bold my-10">
        Die besten Showacts für ihr Event
      </h1>
      
      <h3 className="p-6 text-lg leading-relaxed max-w-4xl mx-auto">
        Bei PepeShows bringen wir außergewöhnliches Entertainment direkt zu Ihnen! <br />
        Als führende Künstleragentur spezialisieren wir uns auf die Vermittlung von professionellen 
        Zirkuskünstlern für Unternehmen in der DACH-Region. <br />
        Unsere Agentur steht für ein vielseitiges Künstlerportfolio und maßgeschneiderte Performances, 
        die Ihr Firmenevent unvergesslich machen. <br />
        Unsere Künstler sind ideal für jede Art von Firmenfeier und schaffen eine unvergessliche Atmosphäre 
        durch Showeinlagen, Workshops oder maßgeschneiderte Programme.
      </h3>
      
    </>
  );
}