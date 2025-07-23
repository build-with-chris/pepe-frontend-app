import * as React from "react"
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import slide1 from "@/assets/landingpage/slide1.png";
import slide2 from "@/assets/landingpage/slide2.png";
import slide3 from "@/assets/landingpage/slide3.png";
import slide1Lg from "@/assets/landingpage/slide1-lg.png";
import slide2Lg from "@/assets/landingpage/slide2-lg.png";
import slide3Lg from "@/assets/landingpage/slide3-lg.png";

const slides = [
  { small: slide1, large: slide1Lg },
  { small: slide2, large: slide2Lg },
  { small: slide3, large: slide3Lg },
];

export function CarouselOrientation() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      plugins={[Autoplay({ delay: 5000 })]}
      orientation="horizontal"
      className="w-screen h-[400px] md:h-[600px] lg:h-[800px] relative"
    >
      <CarouselContent className="h-full">
        {slides.map(({ small, large }, idx) => (
          <CarouselItem key={idx} className="flex items-center justify-center">
            <picture className="w-full h-full">
              <source media="(min-width: 1024px)" srcSet={large} />
              <img
                src={small}
                alt={`Slide ${idx + 1}`}
                className="object-cover object-center lg:object-top w-full h-full"
              />
            </picture>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2" />
      <CarouselNext     className="absolute top-1/2 right-2 -translate-y-1/2" />
    </Carousel>
  )
}
