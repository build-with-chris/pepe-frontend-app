import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import PepesParticles from "@/components/InteractivePepeParticles";
import hero from "../assets/PepeHero.webp"

export default function Home() {
  return (
    <>
           <div
      className="relative w-screen min-h-[70vh] bg-black bg-center bg-no-repeat bg-contain"
      style={{ backgroundImage: `url(${hero})` }}
    >
      {/* Dark overlay to dim the hero image */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        {/* Pepe Canvas unten mittig */}
        <div className="pointer-events-none absolute inset-x-0 -bottom-12 md:-bottom-5 z-10 flex justify-center">
          <div className="relative w-full max-w-[1080px] aspect-[8/3] overflow-hidden">
            <PepesParticles />
          </div>
        </div>
        {/* Titel + Call-to-Action darunter */}
        
      </div>

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