"use client";

import Autoplay from "embla-carousel-autoplay";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo } from "react";
import { useCallback } from "react";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const Hero228 = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const isMobile = useIsMobile();

  const testimonials = [
    { id: 1, image: "public/images/Künstler/Artist1.webp", name: "Artist 1" },
    { id: 2, image: "public/images/Künstler/Artist2.webp", name: "Artist 2" },
    { id: 3, image: "public/images/Künstler/Artist3.webp", name: "Artist 3" },
    { id: 4, image: "public/images/Künstler/Artist4.webp", name: "Artist 4" },
    { id: 5, image: "public/images/Künstler/Artist5.webp", name: "Artist 5" },
    { id: 6, image: "public/images/Künstler/Artist6.webp", name: "Artist 6" },
    { id: 7, image: "public/images/Künstler/Artist7.webp", name: "Artist 7" },
    { id: 8, image: "public/images/Künstler/Artist8.webp", name: "Artist 8" },
    { id: 9, image: "public/images/Künstler/Artist9.webp", name: "Artist 9" },
    { id: 10, image: "public/images/Künstler/Artist10.webp", name: "Artist 10" },
    { id: 11, image: "public/images/Künstler/Artist11.webp", name: "Artist 11" },
  ];


  const getRotation = useCallback(
    (index: number) => {
      const n = testimonials.length;
      const curr = current % n;
      const next = (curr + 1) % n;
      const next2 = (curr + 2) % n;
      if (index === curr) return "md:-rotate-45 md:translate-x-40 md:scale-75 md:relative";
      if (index === next) return "md:rotate-0 md:z-10 md:relative";
      if (index === next2) return "md:rotate-45 md:-translate-x-40 md:scale-75 md:relative";
      return "md:opacity-60";
    },
    [current, testimonials.length],
  );

  const scrollbarBars = useMemo(
    () =>
      [...Array(40)].map((_, item) => (
        <motion.div
          key={item}
          initial={{
            opacity: item % 5 === 0 ? 0.2 : 0.2,
            filter: "blur(1px)",
          }}
          animate={{
            opacity: item % 5 === 0 ? 1 : 0.2,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.2,
            delay: item % 5 === 0 ? (item / 5) * 0.05 : 0,
            ease: "easeOut",
          }}
          className={cn(
            "w-[1px] bg-white",
            item % 5 === 0 ? "h-[15px]" : "h-[10px]",
          )}
        />
      )),
    [],
  );

  return (
    <section className="bg-black py-32 text-white">
      <div className="container flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="max-w-3xl text-5xl font-medium tracking-tighter text-white md:px-9 md:text-6xl">
          <span className="block text-3xl sm:hidden mt-24">Event-Magie</span>
          <span className="hidden sm:block text-4xl md:text-5xl">Außergewöhnliche Künstler:innen,<br /> perfekt inszeniert für Ihr Publikum</span>
        </h1>
        <p className="mt-5 max-w-xl text-white/70">
        Wir bringen Visionen auf die Bühne – professionell, individuell und mit viel Leidenschaft.
        </p>

        <Carousel
          className="max-w-5xl"
          opts={{ loop: true, align: "start", containScroll: "keepSnaps" }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
              stopOnFocusIn: false,
            }),
          ]}
          setApi={setApi}
        >
          <CarouselContent>
            {testimonials.map((_, index) => (
              <CarouselItem key={index} className="my-10 md:basis-1/3">
                <div
                  className={`h-105 w-full transition-transform duration-500 ease-in-out ${getRotation(index)}`}
                >
                  <img
                    src={testimonials[index].image}
                    className="h-full w-full object-cover"
                    alt={testimonials[index].name}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute right-0 bottom-0 flex w-full translate-y-full flex-col items-center justify-center gap-2">
            <div className="flex gap-2">{scrollbarBars}</div>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={current}
                className="w-full text-lg font-medium"
                initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, scale: 0.9, filter: "blur(5px)" }}
                transition={{ duration: 0.5 }}
              >
                {testimonials[current]?.name}
              </motion.p>
            </AnimatePresence>
            <div className="flex gap-2">{scrollbarBars}</div>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export { Hero228 };
