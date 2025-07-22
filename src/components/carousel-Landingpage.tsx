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

const slides = [slide1, slide2, slide3];

export function CarouselOrientation() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      plugins={[Autoplay({ delay: 2000 })]}
      orientation="horizontal"
      className="relative w-full border border-red-500 h-[400px] md:h-[600px] lg:h-[800px]"
    >
      <CarouselContent className="flex h-full w-full overflow-hidden">
        {slides.map((src, idx) => (
          <CarouselItem key={idx} className="flex items-center justify-center h-full min-w-full shrink-0">
            <img
              src={src}
              alt={`Slide ${idx + 1}`}
              className="object-cover w-full h-full max-h-[800px]"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2" />
      <CarouselNext     className="absolute top-1/2 right-2 -translate-y-1/2" />
    </Carousel>
  )
}
