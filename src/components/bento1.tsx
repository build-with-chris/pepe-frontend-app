"use client";

import { Code, Database, Zap } from "lucide-react";

import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Logo, LogoImage } from "@/components/shadcnblocks/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Bento1 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
          <Card className="bg-primary dark:bg-background relative h-60 overflow-hidden rounded-3xl md:col-span-2 md:row-span-2 md:h-[400px] lg:col-span-4 lg:h-full">
            <FlickeringGrid
              className="absolute inset-0 h-full w-full"
              squareSize={4}
              gridGap={6}
              flickerChance={0.3}
              color="rgb(255, 255, 255)"
              maxOpacity={0.1}
            />
            <CardContent className="flex h-full flex-col justify-end p-6">
              <h2 className="text-primary-foreground dark:text-foreground text-left text-lg font-medium">
                Experience Design Excellence.
              </h2>
              <div className="absolute left-6 top-6 z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 dark:bg-black/20">
                  <Zap className="h-5 w-5 text-white dark:text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border relative h-60 overflow-hidden rounded-3xl border md:col-span-2 md:row-span-2 md:h-[400px] lg:col-span-4 lg:h-[600px]">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/Geometric Staircase and Concrete Wall.jpeg"
              alt="shadcn UI development"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <CardContent className="z-10 flex h-full flex-col justify-end p-6">
              <h2 className="text-left text-lg font-medium text-white">
                Engineer At Scale.
              </h2>
              <div className="absolute left-6 top-6 z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 dark:bg-black/20">
                  <Database className="h-5 w-5 text-white dark:text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary dark:bg-background relative h-60 overflow-hidden rounded-3xl md:col-span-2 md:row-span-2 md:h-[400px] lg:col-span-4 lg:h-full">
            <CardContent className="flex h-full flex-col justify-end p-6">
              <h2 className="text-primary-foreground dark:text-foreground text-left text-lg font-medium">
                Join The Future.
              </h2>
              <div className="absolute left-6 top-6 z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 dark:bg-black/20">
                  <Code className="h-5 w-5 text-white dark:text-white" />
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
