import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import PepesParticles from "@/components/InteractivePepeParticles";
import hero from "../assets/LP TRY.png"

export default function Home() {
  return (
    <>
           <div
      className="w-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${hero})` }}
    >
        {/* Animation oben: shrinkwrap + padding */}
        <div className="flex justify-center">
          <div className="relative rounded-4xl w-full max-w-[900px] aspect-[8/3] overflow-hidden">
            <PepesParticles />
          </div>
        </div>

        {/* Titel + Call-to-Action darunter */}
        <div className="flex flex-col items-center text-white gap-6 p-6">
          <Link to="/anfragen">
            <Button size="xl" className="font-bold text-white">
              Booking Assistant
            </Button>
          </Link>
        </div>
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