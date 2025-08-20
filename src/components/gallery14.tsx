"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const carouselItems = [
  {
    image: "/images/Galery14/Luft.webp",
    title: "Luftakrobatik",
    description:
      "Schwerelos & elegant: Luftshows, die Galas und Firmenfeiern veredeln – mit eigenem, schnell aufbaubarem Rig.",
  },
  {
    image: "/images/Galery14/Feuershow.webp",
    title: "Feuershow",
    description:
      "Epische Bilder, präzise Choreo, maximale Gänsehaut – für Outdoor-Momente, die niemand vergisst.",
  },
  {
    image: "/images/Galery14/Jonglage.webp",
    title: "Jonglage & Variety",
    description:
      "Tempo, Timing, Interaktion: von Close-up bis Bühne – perfekt für Übergänge & Opening-Acts.",
  },
  {
    image: "/images/Galery14/CustomActs.webp",
    title: "Custom Acts",
    description:
      "Brandfarben, Produkt-Motive, Show-Dauer: Wir bauen den Act um deinen Anlass herum.",
  },
  {
    image: "/images/Galery14/Firmenevent.webp",
    title: "Firmen-Events",
    description:
      "Sommerfest, Weihnachtsfeier, Jubiläum – wir liefern Idee, Cast & Ablauf aus einer Hand.",
  },
];

const Gallery14 = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className="overflow-hidden bg-black text-white py-32">
        <Carousel setApi={setApi}>
          <div className="grid gap-8 md:gap-4 lg:grid-cols-2 [&>div[data-slot=carousel-content]]:overflow-visible [&>div[data-slot=carousel-content]]:[clip-path:inset(-100vw_-100vw_-100vw_0)]">
            <div>
              <h2 className="text-4xl font-semibold md:text-6xl text-white">
                Wow statt „nett“.
              </h2>
              <div className="mt-6 space-y-6">
                <p className="text-xl text-gray-300">
                  Akrobatik, Jonglage, Feuer & mehr – individuell kombiniert für deinen Anlass.
                </p>
                <ul className="grid gap-2 text-gray-200 list-disc pl-5">
                  <li><span className="font-medium">Maßgeschneiderte Shows:</span> Motto, Kostüm, Länge & Ablauf individuell anpassbar.</li>
                  <li><span className="font-medium">Breites Künstler‑Netzwerk:</span> Von Zirkus & Luftakrobatik über Jonglage bis Special Acts.</li>
                  <li><span className="font-medium">Sicher & professionell:</span> Erfahrene Künstler, klare Abläufe, zuverlässiges Show‑Management.</li>
                </ul>
                <p className="text-sm text-white/70">Munich‑based Circus & Performance — europaweit buchbar</p>
              </div>
              <div className="mt-8 hidden items-center gap-4 md:flex">
                <CarouselPrevious className="static size-12 translate-x-0 translate-y-0 text-black border-white" />
                <CarouselNext className="static size-12 translate-x-0 translate-y-0 text-black border-white" />
              </div>
            </div>

            <CarouselContent className="max-w-[400px] select-none">
              {carouselItems.map((item, idx) => (
                <CarouselItem className="w-fit" key={idx}>
                  <div className="relative aspect-4/5 max-h-[500px] rounded-2xl">
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-primary to-transparent to-40%" />
                    <img
                      src={item.image}
                      alt={item.title}
                      className="size-full rounded-2xl bg-cover"
                    />
                    <div className="absolute inset-0 p-8">
                      <p className="text-sm font-semibold text-white/70">
                        <span className="mr-1 text-white">
                          {item.title}.
                        </span>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
        </Carousel>
        <div className="mt-8 flex items-center lg:ml-[50%]">
          {Array.from({ length: carouselItems.length }).map((_, index) => (
            <span
              key={index}
              className={cn(
                "flex h-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-muted-foreground/15 text-xs font-semibold whitespace-nowrap transition-all duration-300",
                index + 1 === current ? "w-32" : "m-4 size-4",
              )}
              onClick={() => api && api.scrollTo(index)}
            >
              <span
                className={cn(
                  "inline-block transition-all duration-300",
                  index + 1 === current
                    ? "translate-x-0 opacity-100"
                    : "translate-x-6 opacity-0",
                )}
              >
                {carouselItems[index].title}
              </span>
            </span>
          ))}
        </div>
    </section>
  );
};

export { Gallery14 };
