"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

import { Sparkles, Circle, Lightbulb } from "lucide-react";

// NOTE: Requires `framer-motion`. If not installed: npm i framer-motion

import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Logo, LogoImage } from "@/components/shadcnblocks/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Bento1 = () => {
  const [showBeams, setShowBeams] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(cardRef, { amount: 0.4, margin: "-10% 0px -10% 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls
        .start({ y: -70, opacity: 1, scale: 1.08, transition: { type: "spring", stiffness: 80, damping: 18, mass: 1.2, duration: 1.6 } })
        .then(() => setShowBeams(true));
    }
  }, [inView, controls]);

  return (
    <section className="py-32">
      <div className="container">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
          <Card className="bg-black relative h-60 overflow-hidden rounded-3xl md:col-span-2 md:row-span-2 md:h-[400px] lg:col-span-4 lg:h-full">
            <div ref={cardRef} />
            {/* subtle flicker grid stays */}
            <FlickeringGrid
              className="absolute inset-0 h-full w-full"
              squareSize={4}
              gridGap={6}
              flickerChance={0.3}
              color="rgb(255, 255, 255)"
              maxOpacity={0.1}
            />

            {/* Circus tent fly-in */}
            <motion.div
              initial={{ y: -180, opacity: 0, scale: 0.9 }}
              animate={controls}
              transition={{ type: "spring", stiffness: 80, damping: 18, mass: 1.2, duration: 1.6 }}
              onAnimationComplete={() => setShowBeams(true)}
              className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center"
              aria-hidden
            >
              <img
                src="/images/Bento1/CircusTent.png"
                alt="Circuszelt mit Luftartistin"
                className="h-auto w-[100%] max-w-[1400px] select-none"
                loading="eager"
                decoding="async"
                onError={(e) => {
                  // helps debugging if the image path is wrong
                  console.error("/images/Bento1/CircusTent.png failed to load", e.currentTarget.src);
                }}
              />
            </motion.div>

            {/* Spotlights: appear after fly-in */}
            {showBeams && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 0.6 }}
                  className="pointer-events-none absolute bottom-0 left-[8%] h-[140%] w-[45%] rotate-[-18deg] blur-sm"
                  style={{
                    clipPath: "polygon(0% 0%, 22% 0%, 90% 100%, 0% 100%)",
                    background:
                      "linear-gradient(to bottom, rgba(255,255,220,0.0) 0%, rgba(255,255,200,0.25) 25%, rgba(255,253,170,0.35) 55%, rgba(255,253,170,0.0) 100%)",
                    mixBlendMode: "screen",
                  }}
                  aria-hidden
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 0.6, delay: 0.08 }}
                  className="pointer-events-none absolute bottom-0 right-[8%] h-[140%] w-[45%] rotate-[18deg] blur-sm"
                  style={{
                    clipPath: "polygon(78% 0%, 100% 0%, 100% 100%, 10% 100%)",
                    background:
                      "linear-gradient(to bottom, rgba(255,255,220,0.0) 0%, rgba(255,255,200,0.25) 25%, rgba(255,253,170,0.35) 55%, rgba(255,253,170,0.0) 100%)",
                    mixBlendMode: "screen",
                  }}
                  aria-hidden
                />
              </>
            )}

            <CardContent className="relative z-10 flex h-full flex-col justify-end p-6">
              <h2 className="text-primary-foreground dark:text-foreground text-left text-lg font-medium">
                Pepe Shows, die begeistern.
              </h2>
              <div className="absolute left-6 top-6 z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 dark:bg-black/20">
                  <Sparkles className="h-5 w-5 text-white dark:text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border relative h-60 overflow-hidden rounded-3xl border md:col-span-2 md:row-span-2 md:h-[400px] lg:col-span-4 lg:h-[600px]">
            <img
              src="/images/Bento1/AirFestival.webp"
              alt="Performance"
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
            <CardContent className="z-10 flex h-full flex-col justify-end p-6">
              <h2 className="text-left text-lg font-medium text-white">
                Artistik, die fesselt.
              </h2>
              <div className="absolute left-6 top-6 z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 dark:bg-black/20">
                  <Circle className="h-5 w-5 text-white dark:text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black relative h-60 overflow-hidden rounded-3xl md:col-span-2 md:row-span-2 md:h-[400px] lg:col-span-4 lg:h-full">
            <CardContent className="flex h-full flex-col justify-end p-6">
              <h2 className="text-primary-foreground dark:text-foreground text-left text-lg font-medium">
                Innovative Showkonzepte.
              </h2>
              <div className="absolute left-6 top-6 z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 dark:bg-black/20">
                  <Lightbulb className="h-5 w-5 text-white dark:text-white" />
                </div>
              </div>
            </CardContent>
            <BackgroundBeams />
          </Card>

          <Card className="relative col-span-1 h-60 rounded-3xl md:col-span-2 md:row-span-1 md:h-[300px] lg:col-span-3">
            <CardContent className="flex h-full flex-col items-center justify-center p-6">
              <div className="mb-3">
                <span className="text-4xl font-bold md:text-3xl lg:text-4xl">
                  300
                </span>
                <span className="align-top text-2xl font-bold md:text-xl lg:text-3xl">
                  +
                </span>
              </div>
              <p className="text-muted-foreground mb-4 text-left text-sm md:text-sm">
                Delighted developers
              </p>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Avatar
                    key={i}
                    className="border-border h-8 w-8 border-2 md:h-8 md:w-8 lg:h-10 lg:w-10"
                  >
                    <AvatarImage src={`/images/block/avatar-${i + 1}.webp`} />
                    <AvatarFallback>DEV{i}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="relative col-span-1 h-60 overflow-hidden rounded-3xl md:col-span-3 md:row-span-1 md:h-[300px] lg:col-span-5">
            <div className="flex h-full flex-col items-center justify-center p-6">
              <Logo url="https://shadcnblocks.com">
                <LogoImage
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.png"
                  alt="Shadcnblocks.com"
                  className="h-12 md:h-14 dark:invert"
                />
              </Logo>
            </div>
          </Card>

          <Card className="bg-muted relative col-span-1 h-60 rounded-3xl md:col-span-2 md:row-span-1 md:h-[300px] lg:col-span-4">
            <CardContent className="flex h-full flex-col items-center justify-center p-6">
              <p className="text-muted-foreground mb-4 text-left text-sm md:text-sm">
                Ready to get started?
              </p>
              <Button>Create Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export { Bento1 };
