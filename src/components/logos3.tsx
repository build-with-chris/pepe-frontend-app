"use client";

import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
}

interface Logos3Props {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

const Logos3 = ({
  heading = "Diese Kunden vertrauen auf Pepe",
  logos = [
    {
      id: "logo-porsche",
      description: "Porsche",
      image: "/images/Logos/porsche.svg",
      className: "h-8 w-auto",
    },
    {
      id: "logo-google",
      description: "Google",
      image: "/images/Logos/google.svg",
      className: "h-8 w-auto",
    },
    {
      id: "logo-mcdonalds",
      description: "McDonald’s",
      image: "/images/Logos/mcdonalds.svg",
      className: "h-8 w-auto",
    },
    {
      id: "logo-astrazeneca",
      description: "AstraZeneca",
      image: "/images/Logos/astrazeneca.svg",
      className: "h-8 w-auto",
    },
    {
      id: "logo-munich-mash",
      description: "Munich Mash",
      image: "/images/Logos/munich-mash.png",
      className: "h-8 w-auto",
    },
    {
      id: "logo-european-championships",
      description: "European Championships",
      image: "/images/Logos/european-championships.svg",
      className: "h-8 w-auto",
    },
    {
      id: "logo-tollwood",
      description: "Tollwood",
      image: "/images/Logos/tollwood.svg",
      className: "h-8 w-auto",
    },
  ],
}: Logos3Props) => {
  const marqueeLogos = [...logos, ...logos, ...logos];
  return (
    <section className="bg-black text-white pt-10 pb-20 mb-10">
      <div className="w-full flex justify-center">
        <h1 className="my-6 text-2xl font-bold text-center lg:text-4xl text-white">
          <span className="block sm:inline">Diese Kunden</span>{" "}
          <span className="block sm:inline">vertrauen auf Pepe</span>
        </h1>
      </div>
      <div className="pt-10 md:pt-16 lg:pt-20">
        <div className="relative mx-auto flex items-center justify-center w-full max-w-none">
          <Carousel
            opts={{ loop: true, align: "start", containScroll: "keepSnaps" }}
            plugins={[
              AutoScroll({
                playOnInit: true,
                stopOnInteraction: false,
                stopOnMouseEnter: false,
                stopOnFocusIn: false,
                speed: 1.2,
              }),
            ]}
          >
            <CarouselContent className="ml-0">
              {marqueeLogos.map((logo, i) => (
                <CarouselItem
                  key={`${logo.id}-${i}`}
                  className="flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <div className="mx-6 md:mx-8 lg:mx-10 flex shrink-0 items-center justify-center">
                    <div>
                      <img
                        src={logo.image}
                        alt={logo.description}
                        className={logo.className}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export { Logos3 };
