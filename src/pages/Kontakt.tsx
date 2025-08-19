import {Contact2} from "../components/contact2";
import { Logos3 } from "@/components/logos3";
import { Cta10 } from "@/components/cta10";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Kontakt() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full md:w-11/12 lg:w-5/6 mx-auto ">

      <Cta10
        heading="Schnell & einfach zur Show"
        description={`Der schnellste Weg zu Ihrem Angebot: unser Booking Assistent. Alle Infos eingeben, Angebot erhalten \n– einfach, unverbindlich & effizient.\n\nFür persönliche Beratung erreichen Sie uns jederzeit telefonisch.`}
        buttons={{
          primary: { text: "Booking Assistent starten", url: "/anfragen" },
        }}
        rightAddon={
          <DotLottieReact
            src="https://lottie.host/2c55587e-b41b-4714-b82f-f8f8807e88f9/aLh74vbsuU.lottie"
            loop
            autoplay
            style={{ width: "60px", height: "60px" }}
          />
        }
      />
      <Contact2 />
      <Logos3 />
    </div>
  );
}