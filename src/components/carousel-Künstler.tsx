import * as React from "react"
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,

} from "@/components/ui/carousel"

import slide1 from "@/assets/kuenstlerpage/slide1.webp";
import slide1Lg from "@/assets/kuenstlerpage/slide1-lg.webp";
import slide2 from "@/assets/kuenstlerpage/slide2.webp";
import slide2Lg from "@/assets/kuenstlerpage/slide2-lg.webp";
import slide3 from "@/assets/kuenstlerpage/slide3.webp";
import slide3Lg from "@/assets/kuenstlerpage/slide3-lg.webp";
import slide5 from "@/assets/kuenstlerpage/slide5.webp";
import slide6 from "@/assets/kuenstlerpage/slide6.webp";
import slide7 from "@/assets/kuenstlerpage/slide7.webp";

const slides = [
  { small: slide1, large: slide1Lg },
  { small: slide2, large: slide2Lg },
  { small: slide3, large: slide3Lg },
  { small: slide5, large: slide5 },
  { small: slide6, large: slide6 },
  { small: slide7, large: slide7 },
  // Add more as needed
];

export function CarouselOrientation() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      plugins={[Autoplay({ delay: 4000 })]}
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
                className="w-full h-full object-contain bg-black md:object-cover md:object-center lg:object-top"
              />
            </picture>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
