import { Button } from "@/components/ui/button";

interface Cta10Props {
  heading?: string;
  description?: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
}

const Cta10 = ({
  heading = "PepeShows – mehr als eine Künstlervermittlung",
  description = "Wir kreieren kommerzielle Shows, fördern Kultur und betreiben unsere eigene Base. So vereinen wir Erfahrung, Netzwerk und Leidenschaft – und machen PepeShows zu echten Experten für unvergessliche Erlebnisse.",
  buttons = {
    primary: {
      text: "Zur Agentur",
      url: "/agentur",
    },
  },
}: Cta10Props) => {
  return (
    <section className="py-16 bg-black text-white">
      <div className="container">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 flex w-full flex-col gap-16 overflow-hidden rounded-lg p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-12">
          <div className="flex-1">
            <h3 className="mb-3 text-2xl font-semibold text-white md:mb-4 md:text-4xl lg:mb-6">
              {heading}
            </h3>
            <p className="max-w-xl text-white/70 lg:text-lg">
              {description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            {buttons.secondary && (
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
              </Button>
            )}
            {buttons.primary && (
              <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200">
                <a href={buttons.primary.url}>{buttons.primary.text}</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Cta10 };
