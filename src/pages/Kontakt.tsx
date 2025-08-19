import {Contact2} from "../components/contact2";
import { Logos3 } from "@/components/logos3";
import { Cta10 } from "@/components/cta10";


export default function Kontakt() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full md:w-11/12 lg:w-5/6 mx-auto ">

      <Cta10
        heading="Schnell & einfach zur Show"
        description={`Der schnellste Weg zu Ihrem Angebot: unser Booking Assistent. Alle Infos eingeben, Angebot erhalten – einfach, unverbindlich & effizient.\n\nFür persönliche Beratung erreichen Sie uns jederzeit telefonisch.`}
        buttons={{
          primary: { text: "Booking Assistent starten", url: "/anfragen"},
        }}
      />
      <Contact2 />
      <Logos3 />
    </div>
  );
}