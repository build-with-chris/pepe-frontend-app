import {
  BatteryCharging,
  GitPullRequest,
  Layers,
  RadioTower,
  SquareKanban,
  WandSparkles,
} from "lucide-react";

interface Reason {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Feature43Props {
  heading?: string;
  reasons?: Reason[];
}

const Feature43 = ({
  heading = "Warum PepeShows?",
  reasons = [
    {
      title: "Maßgeschneiderte Shows",
      description:
        "Jede Performance wird individuell an Motto, Bühne und Zielgruppe angepasst.",
      icon: <WandSparkles className="size-6" />,
    },
    {
      title: "Breites Künstlernetzwerk",
      description:
        "Von Zirkus- und Luftakrobatik über Jonglage, Zauberei bis hin zu Breakdance & Feuerkunst.",
      icon: <Layers className="size-6" />,
    },
    {
      title: "Erfahrung & Professionalität",
      description:
        "Über 15 Jahre Event- und Bühnenerfahrung, klare Abläufe & zuverlässiges Management.",
      icon: <SquareKanban className="size-6" />,
    },
    {
      title: "Innovative Showformate",
      description:
        "Kombination aus Klassik & Moderne, z. B. Artistik + digitale Effekte.",
      icon: <GitPullRequest className="size-6" />,
    },
    {
      title: "Faire Preisgestaltung",
      description:
        "Transparente Basis, gemeinsam mit Künstlern entwickelt – ohne versteckte Kosten.",
      icon: <BatteryCharging className="size-6" />,
    },
    {
      title: "Künstlerische Exzellenz",
      description:
        "Kein Mittelmaß – bei PepeShows gibt’s nur Top-Acts mit internationalem Niveau.",
      icon: <RadioTower className="size-6" />,
    },
  ],
}: Feature43Props) => {
  return (
    <section className="mt-20">
      <div className="container">
        <div className="mb-10 md:mb-20">
          <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
            {heading}
          </h2>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <div key={i} className="flex flex-col">
              <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-white text-black">
                {reason.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Feature43 };
